document.getElementById("jumpHome").addEventListener('click',function () {
    chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
        console.log(response.data)
        user_list_node(response.data)
    });
})

document.getElementById("sendMessage").addEventListener('click',function () {
    let send_text = document.getElementById("sendText").innerHTML
    var id = document.getElementsByName('Users');
    var value = new Array();
    for(var i = 0; i < id.length; i++){
        if(id[i].checked)
            value.push(id[i].value);
    }
    chrome.runtime.sendMessage({type:'sendMessage', data: {users:value, text: send_text}},function(response) {})
})

function user_list_node(data) {
    let user_node = $('#u-list ul')
    Object.keys(data).forEach(function (key){
        let user = data[key]
        $(user_node).append('<li>\n' +
            '                        <label><input name="Users" type="checkbox" value="' + user.uid + '" />\n' +
            '                            <img src="' + user.image_url + '" alt="" width="50" height="50"/>\n' +
            '                            <span>' + user.uname + '</span>\n' +
            '                        </label>\n' +
            '                    </li>');
    })
}