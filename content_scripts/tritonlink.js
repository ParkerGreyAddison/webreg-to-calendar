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
    browser.runtime.sendMessage({
        schedule: schedule
    });
}


function scrapeSchedule() {
    const csContainer = document.getElementById("class_schedule");

    const csTable = csContainer.children[1].children[0];

    const csRows = Array.from(csTable.rows);

    const daysRow = csRows[0];
    const courseRows = csRows.slice(1);

    let daysMap = initDaysMap(daysRow);

    const courses = {};


    /* For each row of courses
        For each day in row
        Trim whitespace, split at newlines, trim whitespace again
        Assign first line to Time, second to Subject, third to Location
        Associate course info to subject
    */
    for (let row of courseRows) {
        let columns = Array.from(row.children);

        columns.forEach((column, index) => {
            // Clean the text
            let courseText = column.textContent;
            let splitText = courseText.trim().split('\n').map(Function.prototype.call, String.prototype.trim);

            let courseSubject = splitText[1];
            let courseDay = daysMap[index];

            // Ignoring empty cells
            if (courseSubject) {

                if (courses[courseSubject]) {
                    // If already in courses, append the day to list of days
                    courses[courseSubject]["days"].push(courseDay);
                } else {
                    // Otherwise parse and add course info
                    let courseTimeText = splitText[0];
                    let courseTime = courseTimeText.split(" - ");
                    let courseStartTime = courseTime[0];
                    let courseEndTime = courseTime[1];

                    let courseLocation = splitText[2];

                    let courseInfo = {
                        startTime: courseStartTime,
                        endTime: courseEndTime,
                        location: courseLocation,
                        days: [courseDay]
                    };

                    courses[courseSubject] = courseInfo;
                }
            }
        });
    }

    // Change the list of days into a standardized string MO,TU,WE,TH,FR
    for (course in courses) {
        courses[course]["days"] = changeDayFormats(courses[course]["days"]);
    }

    return courses;
}

function initDaysMap(daysRow) {
    daysMap = [];

    // Initialize days of schedule as empty lists and map
    const daysOfWeek = Array.from(daysRow.cells);

    daysOfWeek.forEach((value, index) => {
        day = value.textContent.trim();

        daysMap[index] = day;
    });

    return daysMap;
}

function changeDayFormats(daysArray) {
    // Take the first two letters and make them upper-case
    const convertDayString = dayString => dayString.slice(0, 2).toUpperCase();

    let formattedDaysArray = daysArray.map(convertDayString);

    return formattedDaysArray.join(',');
}