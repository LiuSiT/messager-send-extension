const os = require('os');
const internetAvailable = require("internet-available");
const getLocalIP = () => {
    //所有的网卡
    const ifaces = os.networkInterfaces();
    let network = [];
    //移除loopback,没多大意义
    Reflect.ownKeys(ifaces).forEach(key => {
        if (!/loopback/ig.test(key)) {
            network = [...network, ...ifaces[key]];
        };
    });
    return network.reduce((arr, { address, family }) => {
        const ip = (/^IPv4$/ig.test(family) ? [address] : []);
        return [...arr, ...ip];
    }, []);
};

/**
 * 检查海外网络
 * */
function checkInternet(win) {
    internetAvailable({
        domainName: "google.com",
        port: 53,
        host: '114.114.114.114' // 默认，国内请改成114.114.114.114
    }).then(() => {
        console.log("网络可用");
        win.webContents.send("fromMain", JSON.stringify({code: 'pcInfo', data:{internetState: 1}}));
    }).catch(() => {
        console.log("网络不可用");
        win.webContents.send("fromMain", JSON.stringify({code: 'pcInfo', data:{internetState: 2}}));
    });
}

module.exports = {
    checkInternet
}
// checkInternet()
// exports.getLocalIP = getLocalIP
// const a = getLocalIP()
// console.log(a);