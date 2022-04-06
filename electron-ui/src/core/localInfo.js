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
function checkInternet() {
    internetAvailable({
        domainName: "google.com",
        port: 53,
        host: '8.8.8.8' // 默认，国内请改成114.114.114.114
    }).then(() => {
        console.log("Internet available");
    }).catch(() => {
        console.log("No internet");
    });
}
checkInternet()
// exports.getLocalIP = getLocalIP
// const a = getLocalIP()
// console.log(a);