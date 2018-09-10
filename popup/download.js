window.onload = () => {
    // Loading bar for a second, then download ready
    loading();
    setTimeout(revealDownload, 1500);

    document.getElementById("download").addEventListener("click", download);

};

function loading() {
    const progress = document.getElementById("loadingProgress");
    let width = 1;
    let load = setInterval(increment, 10);

    function increment() {
        if (width >= 100) {
            clearInterval(load);
        } else if (width === 60) {
            // Pausing for a moment and changing text
            document.getElementById("loadingText").innerText = "converting to calendar";
            setTimeout(() => {
                width++;
            }, 300)
        } else {
            width++;
            progress.style.width = width + '%';
        }
    }
}

function revealDownload() {
    document.getElementById("loadingBar").style.visibility = "hidden";
    document.getElementById("content").style.opacity = "1";
}

function download() {
    // Tell background to prompt download
    browser.runtime.sendMessage({download: true});
}
