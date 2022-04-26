<template>
  <el-config-provider :locale="locale">
  <div class="main_app">
    <el-container id="mainPanel">
      <el-main>
        <el-row type="flex">
          <el-col :span="24">
            <el-card shadow="always">
              <el-descriptions title="" :column="2" direction="horizontal" border>
                <el-descriptions-item label="用户名:">{{ info.username }}</el-descriptions-item>
                <el-descriptions-item label="网络状态:">
                  <el-tag v-if="info.internetState === 1" type="success">可用</el-tag>
                  <el-tag v-else-if="info.internetState === 2" type="danger">不可用</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="chrome浏览器:">
                  <el-tag v-if="info.chromeState === 1" type="success">可用</el-tag>
                  <el-tag v-else-if="info.internetState === 2" type="danger">不可用</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-card shadow="always">
                <el-row style="margin: 0">
                  <span><b>好友数据操作</b></span>
                  <el-divider style="margin-top: 10px"></el-divider>
                </el-row>
                <el-row :gutter="6" style="margin: 0; margin-top: 10px">
                  <el-col :span="12"><el-button type="primary" @click="getAllUserInfo()">获取所有用户</el-button></el-col>
                  <el-col :span="12"><el-button type="primary" @click="saveUserToExcel()">存为excel</el-button></el-col>
                </el-row>
                <el-row :gutter="6" style="margin: 0; margin-top: 10px">
                  <el-col :span="24">
                    <el-upload
                        class="upload-demo"
                        multiple
                        :limit="1"
                        :auto-upload="false"
                        :on-change="handleUserExcel"
                        :file-list="fileList"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                      <el-button type="primary">读取excel好友表</el-button>
                      <template #tip>
                        <div class="el-upload__tip">只能上传 1 个 excel 文件, 只支持 xlsx 格式</div>
                      </template>
                    </el-upload>
                  </el-col>
                </el-row>
<!--                <el-descriptions title="好友数据操作" :column="2" direction="horizontal">-->
<!--                  <el-descriptions-item><el-button size="small" @click="getAllUserInfo()">获取所有用户</el-button></el-descriptions-item>-->
<!--                  <el-descriptions-item><el-button size="small" @click="saveUserToExcel()">存为excel</el-button></el-descriptions-item>-->
<!--                  <el-descriptions-item>-->
<!--                    <el-upload-->
<!--                        class="upload-demo"-->
<!--                        multiple-->
<!--                        :limit="1"-->
<!--                        :auto-upload="false"-->
<!--                        :on-change="handleUserExcel"-->
<!--                        :file-list="fileList"-->
<!--                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">-->
<!--                      <el-button size="small">读取excel好友表</el-button>-->
<!--                      <template #tip>-->
<!--                        <div class="el-upload__tip">只能上传 1 个 excel 文件, 只支持 xlsx 格式</div>-->
<!--                      </template>-->
<!--                    </el-upload>-->
<!--                  </el-descriptions-item>-->
<!--                </el-descriptions>-->
            </el-card>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="24">
            <el-card shadow="always">
              <el-row style="margin: 0">
                <span><b>自动化信息设置</b></span>
                <el-divider style="margin-top: 10px"></el-divider>
              </el-row>
              <el-row :gutter="6" style="margin: 0; margin-top: 10px">
                <el-col :span="12"><el-button @click="openChrome">获取ins聊天</el-button></el-col>
                <el-col :span="12"><el-button @click="closeChrome">关闭chrome</el-button></el-col>
                <el-col :span="12"><el-button @click="openDataPanel">打开数据面板</el-button></el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
<!--        <el-divider style="margin-left: -8px; margin-right: -8px;width:calc(100% + 16px);"></el-divider>-->
        <div style="color: #99999980; text-shadow:2px 2px 5px #00000050;"><h5>iMessenger by princeLau</h5></div>
      </el-footer>
    </el-container>
    <el-container id="actionPanel" v-show="actionPanelIsShow">
      <el-header>
        <el-row>
          <el-col :span="2">
            <el-icon :color="''" :size="20" @click="hiddenDataPanel()" id="closeIcon">
              <close />
            </el-icon>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-collapse>
          <el-collapse-item title="全部聊天" name="1">
            <el-row :gutter="6" style="margin: 0; margin-top: 10px">
              <el-col :span="8"><el-button type="primary" @click="">导出</el-button></el-col>
              <el-col :span="8"><el-button type="primary" @click="">导入</el-button></el-col>
              <el-col :span="8"><el-button type="primary" @click="dialogVisible = true">创建任务</el-button></el-col>
            </el-row>
            <el-table
                ref="filterHandler"
                :data="allUserInfo"
                highlight-current-row
                @cell-click ="handleCellClick"
                :size="'small'"
                row-key="uid"
                style="width: 100%"
                @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="20"/>
              <el-table-column property="image_url" label="头像" width="50">
                <template #default="scope">
                  <el-avatar :size="42" :src="scope.row.image_url"></el-avatar>
                </template>
              </el-table-column>
<!--              <el-table-column property="uid" label="uid"/>-->
              <el-table-column property="uname" label="用户名"/>
              <el-table-column property="area" label="区域"  width="80"
                               :filters="areaFilters"
                               :filter-method="filterArea"
                               filter-placement="bottom-end">
                <template #default="scope">
                  <div class="input-box">
                    <el-input v-show="false" size="small" @blur="handleInputBlur" v-model="scope.row.area" ></el-input>
                  </div>
                  <span>{{scope.row.area}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="任务面板" name="2">
            <el-table
                ref="filterHandler"
                :data="allTaskInfo"
                highlight-current-row
                :size="'small'"
                row-key="uid"
                style="width: 100%"
                @selection-change="handleSelectionChange">
<!--              <el-table-column type="selection" width="20"/>-->
              <el-table-column property="desc" label="描述"/>
              <el-table-column property="time" label="时间"/>
              <el-table-column label="状态">
                <template #default="scope">
                  <el-tag v-if="scope.row.status == 0" size="small">等待执行</el-tag>
                  <el-tag v-else-if="scope.row.status == 1" type="success" size="small">完成</el-tag>
                  <el-tag v-else-if="scope.row.status == 2" type="danger" size="small">未完成</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-row>
                    <el-col :span="12"><el-button size="small" type="primary" round>详情</el-button></el-col>
                    <el-col :span="12"><el-button size="small" type="danger" :icon="buttonDelete" round @click="deleteTask(scope.row.id)"></el-button></el-col>
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>

    <!--创建任务dialog-->
    <el-dialog
        v-model="dialogVisible"
        title="创建任务"
        width="50%">
      <el-scrollbar max-height="260px">
        <el-form ref="form" :model="createTaskForm" label-width="80px">
          <el-form-item label="执行时间">
<!--            <ElTimePicker-->
<!--                v-model="createTaskForm.time"-->
<!--                placeholder="任意时间点">-->
<!--            </ElTimePicker>-->
            <Datepicker v-model="createTaskForm.time" locale="zh-cn" autoApply :closeOnAutoApply="false"></Datepicker>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="createTaskForm.desc"
                :autosize="{ minRows: 2, maxRows: 4}"
                show-word-limit
            />
          </el-form-item>
          <el-form-item label="发送内容">
            <el-row :gutter="6" v-for="(item, index) in createTaskForm.sendMessenger" style="width: 100%; margin-top: 2px">
              <el-col :span="20">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="createTaskForm.sendMessenger[index]"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  show-word-limit
                />
              </el-col>
              <el-col :span="4">
                <el-button v-if="index === 0" type="primary" size="small" :icon="buttonPlus" round @click="addSendMessenger()"></el-button>
                <el-button v-else type="danger" size="small" :icon="buttonMinus" round  @click="deleteSendMessenger(index)"></el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <span class="dialog-footer">
          <el-row :gutter="6">
              <el-col :span="12"><el-button @click="dialogVisible = false">取消</el-button></el-col>
              <el-col :span="12"><el-button type="primary" @click="createTask();dialogVisible = false">确认</el-button></el-col>
          </el-row>
        </span>
      </template>
    </el-dialog>
  </div>
  </el-config-provider>
</template>

<script>
import { ElContainer, ElHeader, ElMain, ElFooter, ElImage, ElRow, ElCol, ElButton,
  ElDivider, ElDescriptions, ElDescriptionsItem, ElIcon, ElCollapse, ElCollapseItem,
  ElTable, ElTableColumn, ElAvatar, ElUpload, ElMessage, ElCard, ElTag, ElInput, ElDialog,
  ElForm, ElFormItem, ElTimePicker, ElConfigProvider, ElScrollbar} from 'element-plus';
import { Close, Delete, Plus, Minus } from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { utils, writeFile, read } from "xlsx";
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

export default {
  name: 'app',
  components: {
    ElContainer, ElHeader, ElMain, ElFooter, ElImage,
    ElRow, ElCol, ElCollapse, ElCollapseItem,
    ElButton, ElDivider, ElDescriptions, ElDescriptionsItem, ElIcon,
    Close, ElTable, ElTableColumn, ElAvatar, ElUpload, ElCard, ElTag , ElInput, ElDialog,
    ElForm, ElFormItem, ElTimePicker, ElConfigProvider, ElScrollbar,
    Datepicker
  },
  data() {
    return {
      locale: zhCn,
      dialogVisible: false,
      actionPanelIsShow: false,
      allUserInfo:[],
      allTaskInfo:[],
      allUserInfoMain: [],
      userSelection: [],
      fileList: [],
      info: {
        username: '',
        internetState: '',
        chromeState: ''
      },
      areaFilters: [
        { text: '未分区', value: '-' },
      ],
      createTaskForm: {
        id: "",
        time: new Date(),
        sendMessenger: [""],
        desc: ""
      },
      buttonDelete: Delete,
      buttonPlus: Plus,
      buttonMinus: Minus
    }
  },
  created() {
    let this_ = this
    window.ipcRenderer.receive("fromMain", function (data) {
      data = JSON.parse(data);
      console.log(data)
      switch (data.code) {
        case 'getUserData':
          this_.allUserInfoMain = data.data
          console.log(data.data)
          break
        case 'successTask':
          for(let i=0; i<this_.allTaskInfo.length; i++) {
            if (this_.allTaskInfo[i].id == data.data.id){
              this_.allTaskInfo[i].status = 1;
            }
          }
          break
        case 'pcInfo':
          if (data.data.username) {
            this_.info.username = data.data.username
          }
          if (data.data.username) {
            this_.info.chromeState = data.data.chromeState
          }
          if (data.data.internetState) {
            this_.info.internetState = data.data.internetState
          }
          break
      }
    });
    this.getPcInfo()
  },
  methods: {
    filterArea(value, row) {
      return row.area === value
    },
    handleSelectionChange(val) {
      this.userSelection = val
    },
    handleUserExcel(file, fileList) {
      let this_ = this
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.target.result;
        let workbook = read(data, {type: 'binary'});
        let first_sheet_name = workbook.SheetNames[0];

        /* Get worksheet */
        let worksheet = workbook.Sheets[first_sheet_name];

        let all_user = {}
        let range = utils.decode_range(worksheet["!ref"])
        for (let i = range.s.r + 1; i <= range.e.r; i++) {
          all_user[worksheet[utils.encode_col(1) + utils.encode_row(i)].v] = {
              image_url:worksheet[utils.encode_col(0) + utils.encode_row(i)].v,
              uid: worksheet[utils.encode_col(1) + utils.encode_row(i)].v,
              uname: worksheet[utils.encode_col(2) + utils.encode_row(i)].v,
              area: worksheet[utils.encode_col(3) + utils.encode_row(i)].v
          }
        }
        localStorage.setItem("excel_user", JSON.stringify(all_user));
        let data_list = []
        Object.keys(all_user).forEach(function (key){
          let new_user = all_user[key];
          data_list.push(new_user);
        })
        this_.allUserInfo = data_list;
      }
      reader.readAsBinaryString(file.raw);
    },
    showDataPanel() {
      let main_app = document.getElementsByClassName("main_app")[0];
      let mainPanel = document.getElementById("mainPanel");
      let actionPanel = document.getElementById("actionPanel");
      mainPanel.style.borderLeft = '1px solid #00000010' ;
      mainPanel.style.width = "50%"
      mainPanel.style.float = 'right';
      console.log(mainPanel.offsetHeight);
      actionPanel.style.height = 'calc(' + mainPanel.offsetHeight + '- 60px)';
      this.actionPanelIsShow = true;
      window.ipcRenderer.send('new-message', {code:'openDataPanel',data:{}});
    },

    hiddenDataPanel(){
      let main_app = document.getElementsByClassName("main_app")[0];
      let mainPanel = document.getElementById("mainPanel");
      let actionPanel = document.getElementById("actionPanel");
      mainPanel.style.borderLeft = '0px' ;
      mainPanel.style.width = "100%"
      mainPanel.style.float = 'right';
      // actionPanel.style.height = '0px'
      this.actionPanelIsShow = false;
      window.ipcRenderer.send('new-message', {code:'closeDataPanel',data:{}});
    },

    getAllUserInfo(){
      let this_ = this
      let excelAllUser = null
      let excelAllUserStr = localStorage.getItem("excel_user");
      if (excelAllUserStr){
        excelAllUser = JSON.parse(excelAllUserStr);
      }
      // chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
      //   console.log(response.data)
      // let data = [{uid:"100047516107942", url:"https://www.facebook.com/messages/t/100047516107942/", image_url: 'dasd', uname: 'test', area:'-'}];
      let data = []
      let allFilter = new Set();
      this_.areaFilters = [{ text: '未分区', value: '-' }]
      Object.keys(this.allUserInfoMain).forEach(function (key){
        let new_user = this_.allUserInfoMain[key];
        data.push(new_user);
      })
      for(let key of allFilter){
        this_.areaFilters.push({ text: key, value: key })
      }
      this_.allUserInfo = data;
      Object.keys(this.allUserInfo).forEach(function (key){
        let new_user = this_.allUserInfo[key];
        if (excelAllUser != null && excelAllUser.length >= 1 && excelAllUser[new_user.uid] != undefined) {
          new_user['area'] = excelAllUser[new_user.uid].area;
          allFilter.add(excelAllUser[key].area);
        }
      })
      // });
      this.showDataPanel();
    },

    saveUserToExcel(){
      let this_ = this
      let wb = utils.book_new();
      let ws_name = "SheetJS";
      let ws_data = [
        [ "用户头像", "用户uid", "用户名", "国家"]
      ];
      Object.keys(this_.userSelection).forEach(function (key) {
        let user = this_.userSelection[key]
        ws_data.push([user.image_url, user.uid, user.uname, user.area])
      })
      let ws = utils.aoa_to_sheet(ws_data);
      /* Add the worksheet to the workbook */
      utils.book_append_sheet(wb, ws, ws_name);
      writeFile(wb, 'messager用户表.xlsx');
    },

    openChrome() {
      window.ipcRenderer.send('new-message', {code:'openChrome',data:{}});
    },
    closeChrome() {
      window.ipcRenderer.send('new-message', {code:'closeChrome',data:{}});
    },
    openDataPanel() {
      window.ipcRenderer.send('new-message', {code:'openDataPanel',data:{}});
    },
    getPcInfo() {
      window.ipcRenderer.send('new-message', {code:'getPcInfo',data:{}});
    },

    //单元格点击后，显示input，并让input 获取焦点
    handleCellClick:function(row, column, cell, event){
        if(cell.hasChildNodes()&& cell.childNodes.length == 1) {
          let _inputNode = cell.childNodes[0].childNodes[2].childNodes[0].childNodes[4];
          if (_inputNode.tagName === 'INPUT') {
            cell.childNodes[0].childNodes[2].childNodes[0].style.display = "block"
            _inputNode.focus();
            cell.childNodes[0].childNodes[3].style.display = "none"
          }
        }
    },

    //input框失去焦点事件
    handleInputBlur:function(event){   //当 input 失去焦点 时,input 切换为 span，并且让下方 表格消失（注意，与点击表格事件的执行顺序）
      let this_ = this;
      let _inputNode = event.target;
      _inputNode.parentNode.style.display = "none"
      _inputNode.parentNode.parentNode.parentNode.childNodes[3].style.display = "block"
      let allFilter = new Set();
      this.areaFilters = [{ text: '未分区', value: '-' }]
      Object.keys(this.allUserInfo).forEach(function (key){
        allFilter.add(this_.allUserInfo[key].area);
      })
      for(let key of allFilter){
        this.areaFilters.push({ text: key, value: key })
      }
    },

    // 创建任务
    createTask(){
      this.createTaskForm.id = this.UUID()
      let new_obj = JSON.parse(JSON.stringify(this.createTaskForm))
      new_obj.status = 0
      new_obj.userSelection = this.userSelection
      this.allTaskInfo.push(new_obj)
      window.ipcRenderer.send('new-message', {code:'createTask',data: JSON.stringify(new_obj)});
      this.createTaskForm.id = ""
      this.createTaskForm.time = new Date()
      this.createTaskForm.sendMessenger = [""]
      this.createTaskForm.desc = ""
      console.log(this.allTaskInfo)
    },

    // 删除任务
    deleteTask(id) {
      for(let i=0; i<this.allTaskInfo.length; i++) {
        if (this.allTaskInfo[i].id == id){
          this.allTaskInfo.splice(i, 1)
        }
      }
    },

    UUID() {
      let str = '0123456789abcdef'
      let arr = []
      for(let i = 0; i < 36; i++){
        arr.push(str.substr(Math.floor(Math.random() * 0x10), 1))
      }
      arr[14] = 4;
      arr[19] = str.substr(arr[19] & 0x3 | 0x8, 1)
      arr[8] = arr[13] = arr[18] = arr[23] = '-'
      return arr.join('')
    },

    // 添加发送消息
    addSendMessenger() {
      this.createTaskForm.sendMessenger.push("")
      console.log('添加发送消息')
    },

    // 删除发送消息
    deleteSendMessenger(index) {
      this.createTaskForm.sendMessenger.splice(index, 1)
    }
  }
}
</script>

<style>
body{
  margin: 2px;
}
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
#mainPanel{
  position: relative;
  width: 100%;
  margin-right: 0px;
}

.el-header{
  --el-header-padding: 0 0;
  /*--el-header-height: 138px;*/
  /*margin: 8px;*/
  height: 32px;
}
.el-main{
  --el-main-padding: 0 0;
  margin: 8px;
  height: 550px;
}
.el-main .el-row{
  margin-top: 10px;
}
.el-divider--horizontal{
  margin: 0;

}
.el-descriptions__header{
  margin-bottom: 8px;
}
.el-descriptions__title{
  font-size: 15px;
}
.el-descriptions__body .el-descriptions__table{
  border: 2px solid #e2f0ff;
  box-shadow: 0 0 0 2px #e2f0ff;
  border-radius: max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px;
  overflow: hidden;
}
.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell{
  padding-bottom: 8px;
}
.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell .el-descriptions__label{
  padding-bottom: 8px;
  font-weight: 600;
}
.el-button{
  width: 100%;
  border: 0;
}
.el-footer{
  --el-footer-padding: 0;
  --el-footer-height: 40px;
}
/*鼠标点击后移开，恢复本身样式*/
#closeIcon, #closeIcon:focus:not(#closeIcon:hover){
  font-size: 20px;
  color: var(--color);
}
/*鼠标悬浮，没有按下；鼠标按下后抬起，没有移开*/
#closeIcon:focus, #closeIcon:hover{
  font-size: 20px;
  color: #2794f8;
}
/*鼠标按下，没有抬起*/
#closeIcon:active {
  color: #ffff;
}
.el-message{
  min-width: 260px !important;
}
.el-card{
  --el-card-border-radius: max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px;
}
.el-button{
  --el-border-radius-base: max(0px, min(8px, calc((100vw - 4px - 100%) * 9999))) / 8px;
  font-weight: 600;
}
.tb-edit .input-box {
  display: none
}
.tb-edit .current-cell .input-box {
  display: block;
  margin-left: -15px;
}
.el-picker-panel__body{
}
</style>
