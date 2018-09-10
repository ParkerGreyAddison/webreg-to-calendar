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