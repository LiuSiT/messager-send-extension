const schedule = require('node-schedule');
const browserRobot = require('./browserRobot');

const  createScheduleJob = (win, data) =>{
    //每分钟的第30秒定时执行一次:
    let j = schedule.scheduleJob(data.id, '*/5 * * * * *',()=>{
        console.log('执行任务,id：' + data.id + '、时间：' + new Date());
        browserRobot.sendMessenger(data)
        // 定时器取消
        j.cancel();
        win.webContents.send("fromMain", JSON.stringify({code: 'successTask', data:{id: data.id}}));
    });
}

const  deleteScheduleJob = (id) =>{
    schedule.cancelJob(id)
}

module.exports = {
    createScheduleJob,
    deleteScheduleJob
}