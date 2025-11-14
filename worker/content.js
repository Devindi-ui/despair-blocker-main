/**
 * content script for Blocker extension
 * This script runs on all pages and communicate with background script
 * This script serves as a fallback and for additional page monitoring
 */

//prevent multiple execution
let despaiBlockerActive = false;

(function initContentScript() {
    if(despaiBlockerActive){
        return;
    }

    despaiBlockerActive = true;

    //listen for messages from background script
    chrome.runtime.onMessage.addListner((request, sender, sendResponse) => {
        if(request.action === 'checkBlockStatus'){
            sendResponse({
                url: window.location.href,
                title: document.title 
            });
        }
    });

    //monitoring for dynamic navigation - SPA(single page application) sites
    let lastUrl = window.location.href;

    const observer = new MutationObserver(() => {
        if(window.location.href !== lastUrl){
            lastUrl = window.location.href;

            chrome.runtime.sendMessage({
                action: 'urlChanged',
                url: window.location.href
            }).catch(() => {

            });
        }
    });

    //start observer
    observer.observe(document.body,  {
        childList: true,
        subtree: true
    })
})();

function isDespairBlockerActive(){
    return document.getElementById('despair-blocker-overlay') !== null;
}

//clean up function for page unload
window.addEventListener('beforeunload', () => {
    despaiBlockerActive = false;
});