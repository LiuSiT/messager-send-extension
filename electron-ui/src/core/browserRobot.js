const os = require('os');
const fs = require("fs")
const userInfo = os.userInfo();
const child_process = require('child_process');
const puppeteer = require('puppeteer');
const iconv = require('iconv-lite');
const robot = require("robotjs");
const http = require('./snysHttp');
const encoding = 'cp936';
const binaryEncoding = 'binary';

function getPcInfo(){
    let result_data = {}
    let exec_path = ''
    let username = userInfo.username;
    result_data.username = username
    switch(process.platform) {
        case 'darwin':
            exec_path = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
            break;
        case 'win32':
            let exec_path_list = [`C:/Users/${username}/AppData/Local/Google/Chrome/Application/chrome.exe`,
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
            for( let i = 0; i < exec_path_list.length; i ++){
                let exists = fs.existsSync(exec_path_list[i]);
                if(exists) {
                    exec_path = '"' + exec_path_list[i] + '"'
                    break
                }
            }
            break;
    }
    if (exec_path == null) {
        result_data.chromeState = 2
    } else {
        result_data.chromeState = 1
    }
    return result_data
}

function openChrome() {
    let exec_path = null;
    let user_data_dir;
    let profile_dir = null;
    let username = userInfo.username;
    switch(process.platform) {
        case 'darwin':
            exec_path = '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"'
            user_data_dir = `/Users/${username}/Library/Application Support/Google/Chrome`
            break;
        case 'win32':
            let exec_path_list = [`C:/Users/${username}/AppData/Local/Google/Chrome/Application/chrome.exe`,
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
            for( let i = 0; i < exec_path_list.length; i ++){
                let exists = fs.existsSync(exec_path_list[i]);
                if(exists) {
                    exec_path = '"' + exec_path_list[i] + '"'
                    user_data_dir = `C:/Users/${username}/AppData/Local/Google/Chrome/User Data`
                    break
                }
            }
            break;
    }
    if (exec_path == null) {
        console.log("没有找到chrome浏览器!")
        return
    }
    let profile_arg;
    let use_user_data_dir;
    if (profile_dir != null) {
        use_user_data_dir = user_data_dir + '/' + profile_dir
        profile_arg = ` --profile-directory="${profile_dir}"`
    }  else {
        // use_user_data_dir = user_data_dir + '/Default'
        use_user_data_dir = user_data_dir
        profile_arg = ''
        let exists = fs.existsSync(use_user_data_dir);
        if (!exists) {
            console.log("没有chrome用户!")
            return
        }
    }
    console.log(JSON.stringify({exec_path: exec_path, user_data_dir: user_data_dir}));
    let cmd = `${exec_path} --remote-debugging-port=9222 --user-data-dir="${user_data_dir}"${profile_arg}`
    // const decoder = new TextDecoder('cp936');
    return child_process.exec(cmd,{ encoding: binaryEncoding }, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + iconv.decode(new Buffer(stdout, binaryEncoding), encoding));
        console.log('stderr: ' + stderr);
    });
}

function closeChrome(chromeProcess){
    if (chromeProcess != null) {
        if( process.platform == 'darwin') {
            chromeProcess.kill("SIGINT");
        } else if (process.platform == 'win32'){
            child_process.execSync(`taskkill /F /T /PID ${chromeProcess.pid}`);
        }
    }
}
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * 获取messenger聊天用户
 */
function ptrT(win) {
    (async () => {
        openChrome();
        await sleep(4000);
        // 请求例子
        let {data} = await http.sendHttpRequest('localhost', 9222, 'json/version');
        let new_data = JSON.parse(data)
        const browser = await puppeteer.connect({
            browserWSEndpoint: new_data.webSocketDebuggerUrl,
            defaultViewport: null
        });
        const pages = await browser.pages();
        let page;
        if (pages.length > 0) {
            page = pages[0];
        } else {
            // 打开空白页面
            page = await browser.newPage();
        }
        await page.goto('https://www.facebook.com/messages');
        for (let y = 0; y <= 12; y += 1) {
            await sleep(3000);
            await page.evaluate(function () {
                let pup_test = document.querySelector('div[data-pagelet="MWThreadList"]').parentNode.parentNode;
                for (let yy = 0; yy <= 600; yy += 100) {
                    pup_test.scrollBy(0, yy)
                }
            })
        }
        let user_data = await page.evaluate(function () {
            let data = {}
            let select_data = document.querySelectorAll('div[data-testid=mwthreadlist-item]')
            for (let i = 0; i < select_data.length; i++) {
                let a_node = select_data[i].querySelector('a')
                let image_node = select_data[i].querySelector('img')
                let a_node_href = a_node.getAttribute('href')
                let image_node_href = image_node.getAttribute('src')
                let span_node_text = image_node.getAttribute('alt')
                let a_node_href_array = a_node_href.split('/')
                data[a_node_href_array[3]] = {
                    uid: a_node_href_array[3],
                    url: a_node_href,
                    image_url: image_node_href,
                    uname: span_node_text,
                    area: '-'
                }
            }
            return data
        })
        await browser.close();
        // return user_data;
        win.webContents.send("fromMain", JSON.stringify({code: 'getUserData', data: user_data}));
        // setTimeout(async function () {

        //     },100000)
    })();
}

// 自动发送消息
function sendMessenger(task_data){
    (async () => {
        openChrome();
        await sleep(4000);
        // 请求例子
        let {data} = await http.sendHttpRequest('localhost', 9222, 'json/version');
        let new_data = JSON.parse(data)
        const browser = await puppeteer.connect({
            browserWSEndpoint: new_data.webSocketDebuggerUrl,
            defaultViewport: null
        });
        const pages = await browser.pages();
        let page;
        if (pages.length > 0) {
            page = pages[0];
        } else {
            // 打开空白页面
            page = await browser.newPage();
        }
        for(let userInfoIndex=0; userInfoIndex<task_data.userSelection.length; userInfoIndex++) {
            await page.goto('https://www.facebook.com/messages/t/' + task_data.userSelection[userInfoIndex].uid + '/');
            let screenSize = robot.getScreenSize()
            let twoPI = Math.PI * 2.0;
            console.log('width:' + screenSize.width + ',height:' + screenSize.height)
            await sleep(3000);
            robot.setMouseDelay(2);
            let height = (screenSize.height / 2) - 10;
            let width = screenSize.width;
            for (let x = 0; x < width / 2; x+=10) {
                let y = height * Math.sin((twoPI * x) / width) + height;
                robot.moveMouse(x, y);
            }
            for(let sendMessengerIndex=0; sendMessengerIndex<task_data.sendMessenger.length; sendMessengerIndex++) {
                switch (process.platform) {
                    case 'darwin':
                        child_process.exec('pbcopy', {encoding: "utf-8"}).stdin.end(task_data.sendMessenger[sendMessengerIndex])
                        break
                    case 'win32':
                        child_process.exec('clip').stdin.end(iconv.encode(task_data.sendMessenger[sendMessengerIndex], encoding))
                        break
                }
                robot.mouseClick();
                await sleep(500);
                switch (process.platform) {
                    case 'darwin':
                        robot.keyTap("v", ["command"])
                        break
                    case 'win32':
                        robot.keyTap("v", ["control"]);
                        break
                }
                await sleep(1000);
                robot.keyTap("enter");
                await sleep(2000);
            }
        }
        await browser.close();
    })()
}

module.exports = {
    openChrome,
    closeChrome,
    ptrT,
    sendMessenger,
    getPcInfo
}

// child_process.exec('pbcopy').stdin.end('sssss')
// openChrome()
// setTimeout(async function () {
//     ptrT()
// },2000)