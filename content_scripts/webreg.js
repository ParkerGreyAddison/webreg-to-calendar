// Execute when message from background.js tells me to start scrape

browser.runtime.onMessage.addListener(begin);

function begin(message) {
    if (!message.start) {
        return;
    }

    // Do the scrape!
    let schedule = scrapeSchedule();

    console.log(schedule);

    // Send schedule back to background.js to be converted
    browser.runtime.sendMessage({schedule: schedule});
}


function scrapeSchedule() {

    const csTable = document.getElementById("list-id-table");

    const numRows = csTable.rows.length - 1;

    const courses = {};

    let currCourse;

    // The rows with info have ids 0 to length-2
    for (let i = 0; i < numRows; i++) {
        let row = document.getElementById(`${i}`);
        let cells = Array.from(row.cells);

        // If subject cell is not blank, new subject
        let subjectText = cells[0].innerText.trim();
        if (subjectText) {
            // Current course name is updated (collapse whitespace)
            currCourse = subjectText.replace(/\s+/g, ' ');;
        }

        // If type of meeting of blank, it's because there's a dropdown menu
            // just skip to the next row
            // For now skip Finals too
        let typeText = cells[3].innerText.trim();
        if (typeText === "FI" || !typeText ) {
            continue;
        }

        let courseSubject = `${currCourse} - ${typeText}`;

        let daysText = cells[7].innerText.trim();
        // If the days have a date (one time occurrence) skip for now
        if (daysText.match(/\d/)) {
            continue;
        }
        let courseDays = changeDayFormats(daysText);

        let timeText = cells[8].innerText.trim();
        let courseTime = timeText.split('-');
        let courseStartTime = courseTime[0];
        let courseEndTime = courseTime[1];

        let buildingText = cells[9].innerText.trim();
        let roomText = cells[10].innerText.trim();
        let courseLocation = `${buildingText} ${roomText}`;

        let courseInfo = {
            startTime: courseStartTime,
            endTime: courseEndTime,
            location: courseLocation,
            days: courseDays
        };

        courses[courseSubject] = courseInfo;
    }

    return courses;
}

function changeDayFormats(daysString) {
    // Make everything uppercase
    let formattedDaysString = daysString.toUpperCase();

    // Replace M -> MO, W -> WE, F -> FR
    const wordMap = {
        M: "MO",
        W: "WE",
        F: "FR",
    };
    formattedDaysString = formattedDaysString.replace(/M|W|F/g, matched => wordMap[matched]);

    // Place comma every two
    formattedDaysString = formattedDaysString.match(/.{2}/g).join(',');

    return formattedDaysString;
}