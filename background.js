// When the toolbar icon is clicked, check the url and send to the proper content_script

let tabId;

browser.browserAction.onClicked.addListener((tab) => {

    tabId = tab.id;

    if (tab.url.includes("://act.ucsd.edu/myTritonlink20/display.htm")) {
        // Send to tritonlink.js
        browser.tabs.sendMessage(tabId, {
            "start": true
        });
        newPopup(tabId, "popup/download.html");
    } else if (tab.url.includes("://act.ucsd.edu/webreg2/main")) {
        // Send to webreg.js
        browser.tabs.sendMessage(tabId, {
            "start": true
        });
        newPopup(tabId, "popup/download.html");
    } else {
        newPopup(tabId, "popup/error.html");
        // browser.browserAction.setPopup({
        //     tabId: tabId,
        //     popup: browser.runtime.getURL("popup/error.html")
        // });
        // browser.browserAction.openPopup();
        browser.browserAction.disable(tabId);
    }
});

// Listen for content_scripts sending schedule over
browser.runtime.onMessage.addListener((message) => {
    const schedule = message.schedule;

    const calendarString = convertToCalendarString(schedule);

    browser.runtime.onMessage.addListener((message) => {
        if (message.download) {
            downloadICS(calendarString);
        }
    })
});

function newPopup(tabId, popupPath) {
    browser.browserAction.setPopup({
        tabId: tabId,
        popup: browser.runtime.getURL(popupPath)
    });
    browser.browserAction.openPopup();
}

function convertToCalendarString(schedule) {
    const initString = "BEGIN:VCALENDAR\r\nPRODID:Courses\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN";
    const closeString = "END:VCALENDAR";

    // Gets todays date, converts to ISO string, and removes symbols.
        // Takes only the first 15 characters (no milliseconds)
    const todaysStamp = new Date(Date.now()).toISOString().replace(/[^\w]/g, '').slice(0, 15) + 'Z';
    
    // Start date should be the start of quarter, UNTIL should be after last day of instruction
        // Hard coding in these dates for now, will need to make a system to
        // update it using the 2017-2013 approved calendar.
 
    const instructionStartDate = "20180924";
    const instructionEndDate = "20181208";

    /*
    BEGIN:VEVENT
    DTSTART;TZID=America/Los_Angeles:20180910T120000
    DTEND;TZID=America/Los_Angeles:20180910T123000
    RRULE:FREQ=WEEKLY;UNTIL=20180912;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR
    DTSTAMP:20180909T220000Z-07
    UID:uid0@default
    SUMMARY:Fun times with a working calendar
    LOCATION:Dude wow
    SEQUENCE:0
    STATUS:CONFIRMED
    TRANSP:OPAQUE
    BEGIN:VALARM
    ACTION:DISPLAY
    TRIGGER:-P0DT0H10M0S
    DESCRIPTION:Fun times in 10 minutes
    END:VALARM
    END:VEVENT
    */

    const calendarLines = [initString];

    let i = 0;
    for (let subject in schedule) {

        calendarLines.push("BEGIN:VEVENT");

        // Adding starttime, endtime
        let startTime = changeTimeFormat(schedule[subject]["startTime"]);
        let endTime = changeTimeFormat(schedule[subject]["endTime"]);

        let dtstartString = `DTSTART;TZID=America/Los_Angeles:${instructionStartDate}T${startTime}`;
        let dtendString = `DTEND;TZID=America/Los_Angeles:${instructionStartDate}T${endTime}`;

        calendarLines.push(dtstartString);
        calendarLines.push(dtendString);

        // Adding recurrence rule
        let daysbyString = changeDayFormats(schedule[subject]["days"]);
        let rruleString = `RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=${instructionEndDate};BYDAY=${daysbyString}`;

        calendarLines.push(rruleString);

        // Adding timestamp
        let dtstampString = `DTSTAMP:${todaysStamp}`;
        calendarLines.push(dtstampString);

        // Adding uid
        let uidString = `UID:uid${i}@default`;
        calendarLines.push(uidString);

        // Adding summary, location
        let detailsString = `SUMMARY:${subject}\r\nLOCATION:${schedule[subject]["location"]}`;
        calendarLines.push(detailsString);

        // Adding default values
        calendarLines.push("SEQUENCE:0\r\nSTATUS:CONFIRMED\r\nTRANSP:OPAQUE");

        // Adding alarm
        let alarmString = `BEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-P0DT0H10M0S\r\nDESCRIPTION:${subject} in 10 minutes\r\nEND:VALARM`;
        calendarLines.push(alarmString);

        // End event
        calendarLines.push("END:VEVENT")

        // Increase index
        i++;
    }

    calendarLines.push(closeString);

    const calendarString = calendarLines.join("\r\n");

    return calendarString;

}

function downloadICS(calendarString) {
    console.log(calendarString);

    const encoder = new TextEncoder("utf-8");

    const file = new Blob([calendarString], {type: "text", endings: "transparent"});

    let downloading = browser.downloads.download({
        url: URL.createObjectURL(file),
        filename: "UCSD_Course_Schedule.ics"
    });
}

function changeDayFormats(daysArray) {
    // Take the first two letters and make them upper-case
    const convertDayString = dayString => dayString.slice(0, 2).toUpperCase();

    let formattedDaysArray = daysArray.map(convertDayString);

    return formattedDaysArray.join(',');
}

function changeTimeFormat(timeString) {
    // Recieves time formatted as 'hh:MMpm'
        // need to add leading zero if missing
        // need to add 12 hrs if pm

    const split = timeString.split(':');
    let hour = parseInt(split[0]);
    if (split[1].slice(2) === "pm") {
        hour = (hour % 12) + 12;
    } else if (hour < 10) {
        hour = `0${hour}`;
    }
    const minutes = split[1].slice(0, 2);

    let formattedTimeString = `${hour}${minutes}00`;

    return formattedTimeString;
}