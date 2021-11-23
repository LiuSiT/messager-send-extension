document.getElementById("jumpHome").addEventListener('click',function () {
    chrome.runtime.sendMessage({type:'getUrl'},function(response) {
        console.log(response)
    });
    chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
        console.log(response.data)
    });
})