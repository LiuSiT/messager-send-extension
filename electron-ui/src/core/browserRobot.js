const os = require('os');
const fs = require("fs")
const userInfo = os.userInfo();
const child_process = require('child_process');

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
            let exec_path_list = [`C:/Users/{username}/AppData/Local/Google/Chrome/Application/chrome.exe`,
                'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe']
            for( let i = 0; i < exec_path_list.length; i ++){
                fs.exists(exec_path_list[i], function(exists) {
                    if(exists) {
                        exec_path = '"' + exec_path_list[i] + '"'
                        user_data_dir = `C:/Users/${username}/AppData/Local/Google/Chrome/User Data`
                    }
                })
            }
            break;
    }
    if (exec_path == null) {
        console.log("没有找到chrome浏览器!")
        return
    }
    let profile_arg;
    let use_user_data_dir;
    if (profile_dir == null) {
        use_user_data_dir = user_data_dir + '/' + profile_dir
        profile_arg = ` --profile-directory="${profile_dir}"`
    }  else {
        use_user_data_dir = user_data_dir + '/Default'
        profile_arg = ''
        fs.exists(use_user_data_dir, function(exists) {
            if (!exists) {
                console.log("没有chrome用户!")
                return
            }
        })
    }
    let cmd = `${exec_path} --remote-debugging-port=9222 --user-data-dir="${user_data_dir}"${profile_arg}`
    return child_process.exec(cmd, function (error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('Error code: ' + error.code);
            console.log('Signal received: ' + error.signal);
        }
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
    });
}

function closeChrome(chromeProcess){
    if (chromeProcess != null) {
        chromeProcess.kill("SIGINT");
    }
}

module.exports = {
    openChrome,
    closeChrome
}