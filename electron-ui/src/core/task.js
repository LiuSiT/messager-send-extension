const schedule = require('node-schedule');
const browserRobot = require('./browserRobot');

const  createScheduleJob = (win, data) =>{
    // //每分钟的第30秒定时执行一次:
    // let j = schedule.scheduleJob(id, '*/5 * * * * *',()=>{
    //     console.log('执行任务,id：' + id + '、时间：' + new Date());
    //     browserRobot.sendMessenger()
    //     // 定时器取消
    //     j.cancel();
    //     win.webContents.send("fromMain", JSON.stringify({code: 'successTask', data:{id: id}}));
    // });
}

const  deleteScheduleJob = (id) =>{
    schedule.cancelJob(id)
}

module.exports = {
    createScheduleJob,
    deleteScheduleJob
}