window.onload = function (){
    setTimeout(function () {
        init()
    }, 2000)
    setTimeout(function () {
        getSendMessage()
    }, 2000)
}

// 初始赋值
function init(){
    let data = {}
    let select_data = document.querySelectorAll('div[data-testid=mwthreadlist-item]')
    select_data.forEach((item,index)=>{
        let a_node = item.querySelector('a')
        let image_node = item.querySelector('image')
        let span_node = item.querySelector('span[class="a8c37x1j ni8dbmo4 stjgntxs l9j0dhe7 ltmttdrg g0qnabr5"]')
        let a_node_href = a_node.getAttribute('href')
        let image_node_href = image_node.getAttribute('xlink:href')
        let span_node_text = span_node.textContent
        let a_node_href_array = a_node_href.split('/')
        data[a_node_href_array[3]] = {uid: a_node_href_array[3], url: a_node_href, image_url:image_node_href, uname:span_node_text}
        console.log(a_node_href_array[3])
        console.log(a_node_href)
        console.log(image_node_href)
        console.log(span_node_text)
        if (select_data.length == index + 1 ) {
            console.log(data)
            chrome.runtime.sendMessage({type:'saveUserInfo', data: data},function(response) {})
        }
    })
}

var dispatchTextEvent = function(target, initTextEvent_args) {
    var e = document.createEvent("TextEvent");
    e.initTextEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
};

var dispatchSimpleEvent = function(target, type, canBubble, cancelable) {
    var e = document.createEvent("Event");
    e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
    target.dispatchEvent(e);
};

function getSendMessage() {
    chrome.runtime.sendMessage({type:'getSendMessage'},function(response) {
        let url_array = window.location.href.split('/')
        if (url_array[url_array.length - 1] == response.data.uid) {
            let test = document.querySelector('div[class="_1mf _1mj"] span br')
            dispatchTextEvent(test, 'textInput', true, true, null, response.data.text, response.data.text.length)

            // let keyCoke = 13
            // let keyboardEvent = document.createEvent('KeyboardEvent')
            // let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent'
            // keyboardEvent[initMethod]('keydown', true, true, window, false, false, false, false, keyCoke, 0)
            // document.dispatchEvent(keyboardEvent)
            setTimeout(function () {
                let path_node = document.querySelector('path[d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"]')
                path_node.parentElement.parentElement.click();
                successSendMessage()
            }, 1000)
        }
    })
}

function successSendMessage(){
    setTimeout(function () {
        chrome.runtime.sendMessage({type: 'successSendMessage'}, function (response) {
        })
    }, 1000)
}

function add_text(){
    let all_data_node = document.querySelector('div[data-testid=MWJewelThreadListContainer]')
    let select_data = document.querySelectorAll('div[data-testid=mwthreadlist-item]')
    all_data_node.appendChild(select_data[0]);
}