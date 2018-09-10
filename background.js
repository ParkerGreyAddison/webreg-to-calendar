// When the toolbar icon is clicked, check the url and send to the proper content_script

browser.browserAction.onClicked.addListener((tab) => {

    if (tab.url.includes("://act.ucsd.edu/myTritonlink20/display.htm")) {
        // Send to tritonlink.js
        browser.tabs.sendMessage(tab.id, {
            "start": true
        });
    } else if (tab.url.includes("://act.ucsd.edu/webreg2/main")) {
        // Send to webreg.js
        browser.tabs.sendMessage(tab.id, {
            "start": true
        });
    } else {
        browser.browserAction.setPopup({
            tabId: tab.id,
            popup: browser.runtime.getURL("popup/error.html")
        });
        browser.browserAction.openPopup();
        browser.browserAction.disable(tab.id);
    }

});


// Listen for content_scripts sending schedule over
browser.runtime.onMessage.addListener((message) => {
    const schedule = message.schedule;
});

function convertToICS(schedule) {
    const initString = "BEGIN:VCALENDAR\r\nPRODID:Courses\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n";
    const closeString = "END:VCALENDAR";

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

    let calendarString = initString;

    let i = 0;
    for (let subject in schedule) {

        calendarString += "BEGIN:VEVENT\r\n";

        // Adding starttime, endtime
        let dtstartString = `DTSTART;TZID=America/Los_Angeles:${}`;
        let dtendString = `DTEND;TZID=America/Los_Angeles:${}`;


        // Adding recurrence rule
        let daysbyString = changeDayFormats(schedule[subject]["days"]);
        let rruleString = `FREQ=WEEKLY;INTERVAL=1;UNTIL=${};BYDAY=${daysbyString}\r\n`;


        // Adding timestamp
        let dtstampString = `DTSTAMP:${}`;


        // Adding uid
        let uidString = `UID:uid${i}@default`;
        calendarString += uidString;

        // Adding summary, location
        let detailsString = `SUMMARY:${subject}\r\nLOCATION:${schedule[subject]["location"]}\r\n`;
        calendarString += detailsString;

        // Adding default values
        calendarString += "SEQUENCE:0\r\nSTATUS:CONFIRMED\r\nTRANSP:OPAQUE\r\n";

        // Adding alarm
        let alarmString = `BEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-P0DT0H10M0S\r\nDESCRIPTION:${subject} in 10 minutes\r\nEND:VALARM\r\n`;
        calendarString += alarmString;

        // Increase index
        i++;
    }

}

function changeDayFormats(daysArray) {
    // Take the first two letters and make them upper-case
    const convertDayString = dayString => dayString.slice(0, 2).toUpperCase();

    formattedDaysArray = daysArray.map(convertDayString);

    return formattedDaysArray.join(',');
}