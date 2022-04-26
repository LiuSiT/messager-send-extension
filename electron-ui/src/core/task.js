const schedule = require('node-schedule');
const browserRobot = require('./browserRobot');
const localInfo = require('./localInfo');

const  createScheduleJob = (win, data) =>{
    let time = new Date(data.time)
    let cron = time.getSeconds() + ' ' + time.getMinutes() + ' '  +
        time.getHours() + ' '  + time.getDate() + ' '  +
        (time.getMonth() + 1) + ' ' + '?'
    console.log(cron)
    //根据cron定时执行一次:
    let j = schedule.scheduleJob(data.id, cron,()=>{
        console.log('执行任务,id：' + data.id + '、时间：' + new Date());
        browserRobot.sendMessenger(data)
        // 定时器取消
        j.cancel();
        win.webContents.send("fromMain", JSON.stringify({code: 'successTask', data:{id: data.id}}));
    });
}

const createInternetCheckJob = (win) => {
    schedule.scheduleJob('internetCheck', '*/10 * * * * ?',()=> {
        localInfo.checkInternet(win)
    });
}

const  deleteScheduleJob = (id) =>{
    schedule.cancelJob(id)
}

module.exports = {
    createScheduleJob,
    deleteScheduleJob,
    createInternetCheckJob
}