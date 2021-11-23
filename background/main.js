let token = {};

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "getUrl") {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            sendResponse({data: {url: tabs[0].url}})
        })
        return true
    } else if (request.type == "saveUserInfo") {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            if (tabs[0].url.indexOf("https://www.facebook.com/messages") != -1) {
                token = request.data
            }
        })
        return true
    } else if (request.type == "getUserInfo") {
        sendResponse({data: token})
        return true
    }
});