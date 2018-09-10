// Execute when message from background.js tells me to start scrape

browser.runtime.onMessage.addListener(begin);

function begin(message) {
    if (!message.start) {
        return;
    }

    // Do the scrape!
}


// Define a handful of functions that can scrape the schedule from this page.


// Send to conversion js

