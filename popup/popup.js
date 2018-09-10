document.addEventListener("click", function (e) {
    if (e.target.id !== "start-conversion") {
        return;
    }

    browser.runtime.sendMessage("FooBar");

});