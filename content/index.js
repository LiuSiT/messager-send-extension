document.getElementById("jumpHome").addEventListener('click',function () {
    chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
        console.log(response.data)
        user_list_node(response.data)
    });
})

document.getElementById("sendMessage").addEventListener('click',function () {
    let send_text = document.getElementById("sendText").value
    var id = document.getElementsByName('Users');
    var value = new Array();
    for(var i = 0; i < id.length; i++){
        if(id[i].checked)
            value.push(id[i].value);
    }
    chrome.runtime.sendMessage({type:'saveSendMessage', data: {users:value, text: send_text}},function(response) {})
})

function user_list_node(data) {
    $('#u-list').empty()
    $('#u-list').append('<ul></ul>')
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

function excel_user_data_node(country, data) {
    $('#u-list').append('<button class="' + country + '-button">全选：' + country + '</button>')
    $('#u-list').append('<ul class="' + country + '-ul"></ul>')
    let user_node = $('#u-list .' + country + '-ul')
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

document.getElementById("saveExcel").addEventListener('click',function () {
    /* create a new blank workbook */
    var wb = XLSX.utils.book_new();
    var ws_name = "SheetJS";
    /* make worksheet */
    var ws_data = [
        [ "用户头像", "用户uid", "用户名", "国家"]
    ];
    chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
        Object.keys(response.data).forEach(function (key) {
            let user = response.data[key]
            ws_data.push([user.image_url, user.uid, user.uname])
        })
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        /* Add the worksheet to the workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, 'messager用户表.xlsb');
    });
})

document.getElementById("files").addEventListener('change', function () {
    var file = document.getElementById('files').files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Find desired cell */
        var desired_cell = worksheet[address_of_cell];

        // /* Get the value */
        // var desired_value = (desired_cell ? desired_cell.v : undefined);
        // console.log(desired_value)
        let all_user = {}
        var range = XLSX.utils.decode_range(worksheet["!ref"])
        for (let i=range.s.r + 1;i<range.e.r;i++){
            if(all_user[worksheet[XLSX.utils.encode_col(3) + XLSX.utils.encode_row(i)].v] != undefined) {
                all_user[worksheet[XLSX.utils.encode_col(3) + XLSX.utils.encode_row(i)].v].push(
                    {
                        image_url:worksheet[XLSX.utils.encode_col(0) + XLSX.utils.encode_row(i)].v,
                        uid: worksheet[XLSX.utils.encode_col(1) + XLSX.utils.encode_row(i)].v,
                        uname: worksheet[XLSX.utils.encode_col(2) + XLSX.utils.encode_row(i)].v
                    }
                )
            } else {
                all_user[worksheet[XLSX.utils.encode_col(3) + XLSX.utils.encode_row(i)].v] = [
                    {
                        image_url:worksheet[XLSX.utils.encode_col(0) + XLSX.utils.encode_row(i)].v,
                        uid: worksheet[XLSX.utils.encode_col(1) + XLSX.utils.encode_row(i)].v,
                        uname: worksheet[XLSX.utils.encode_col(2) + XLSX.utils.encode_row(i)].v
                    }
                ]
            }
        }
        Object.keys(all_user).forEach(function (key) {
            excel_user_data_node(key, all_user[key])
        })
    }
    reader.readAsBinaryString(file);
})