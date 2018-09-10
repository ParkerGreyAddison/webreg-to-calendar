// Execute when message from background.js tells me to start scrape

browser.runtime.onMessage.addListener(begin);

function begin(message) {
    if (!message.start) {
        return;
    }

    // Do the scrape!
    let schedule = scrapeSchedule();

    console.log(schedule);
}


// Define a handful of functions that can scrape the schedule from this page.
function scrapeSchedule() {
    const csContainer = document.getElementById("class_schedule");

    const csTable = csContainer.children[1].children[0];

    const csRows = Array.from(csTable.rows);
    
    console.log("Got csRows array");

    let schedule = {};
    let daysMap = {};

    // Initialize days of schedule as empty lists and map
    const daysOfWeek = Array.from(csRows[0].cells);

    daysOfWeek.forEach((value, index) => {
        day = value.textContent.trim();

        schedule[day] = [];
        daysMap[index] = day;
    });

    console.log("Initialized schedule and map");
    console.log(schedule);
    console.log(daysMap);

    /* For each row of courses
        For each day in row
        Trim whitespace, split at newlines, trim whitespace again
        Assign first line to Time, second to Subject, third to Location
    */
    for (let courseRow of csRows.slice(1)) {
        let courseDays = Array.from(courseRow.children);

        console.log("Converted row into array");

        courseDays.forEach((courseDay, index) => {
            // Clean the text
            let courseText = courseDay.textContent;
            let splitText = courseText.trim().split('\n').map(Function.prototype.call, String.prototype.trim);

            // Parse the information
            let courseTimeText = splitText[0];
            let courseTime = courseTimeText.split(" - ");
            let courseStartTime = courseTime[0];
            let courseEndTime = courseTime[1];

            let courseSubject = splitText[1];

            let courseLocation = splitText[2];

            let course = {
                startTime: courseStartTime,
                endTime: courseEndTime,
                subject: courseSubject,
                location: courseLocation
            };

            // Finally add to appropriate day
            schedule[daysMap[index]].push(course);

// TODO: =======================================================================
//! SHOULD ASSOCIATE EACH CLASS TO ITS OWN OBJECT WITH DAYS, TIME, LOCATION
//! TO ALLOW FOR RECURRING EVENTS        


        });
    }



    // Send to conversion js



    return schedule;

}