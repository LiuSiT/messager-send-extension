let token = {};
let allUser = [];
let text = "";
let indexUser = "";

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
    } else if (request.type == "saveSendMessage") {
        let req_data = request.data
        allUser = req_data['users']
        text = req_data['text']
        indexUser = allUser.pop()
        openUserDialogPage(indexUser)
        return true
    } else if (request.type == "getSendMessage") {
        sendResponse({data: {uid: indexUser, text: text}})
        return true
    } else if (request.type == 'successSendMessage') {
        indexUser = "";
        is_user = allUser.pop()
        if (is_user){
            indexUser = is_user
        }
        openUserDialogPage(is_user)
        return  true
    }
});

function openUserDialogPage(uid) {
    window.open('https://www.facebook.com/messages/t/' + uid);

}