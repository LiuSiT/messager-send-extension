window.onload = function (){
    setTimeout(function () {
        init()
    }, 5000)
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

function add_text(){
    let all_data_node = document.querySelector('div[data-testid=MWJewelThreadListContainer]')
    let select_data = document.querySelectorAll('div[data-testid=mwthreadlist-item]')
    all_data_node.appendChild(select_data[0]);
}