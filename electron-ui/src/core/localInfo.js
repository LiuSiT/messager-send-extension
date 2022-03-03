const os = require('os');
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

// exports.getLocalIP = getLocalIP
// const a = getLocalIP()
// console.log(a);