const schedule = require('node-schedule');

const  scheduleCronstyle = () =>{

    //每分钟的第30秒定时执行一次:
    let j = schedule.scheduleJob('*/5 * * * * *',()=>{
        console.log('scheduleCronstyle:' + new Date());
        console.log('定时器取消')
        // 定时器取消
        j.cancel();
    });
}

scheduleCronstyle();