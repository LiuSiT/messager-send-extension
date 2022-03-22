<template>
  <div class="main_app">
    <el-container id="mainPanel">
      <el-main>
        <el-row type="flex">
          <el-col :span="24">
            <el-card shadow="always">
              <el-descriptions title="" :column="2" direction="horizontal" border>
                <el-descriptions-item label="用户名:">mac</el-descriptions-item>
                <el-descriptions-item label="网络状态:"><el-tag type="success">可用</el-tag></el-descriptions-item>
                <el-descriptions-item label="chrome浏览器:"><el-tag type="success">可用</el-tag></el-descriptions-item>
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
                <el-col :span="12"><el-button @click="openChrome">打开chrome</el-button></el-col>
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
            <el-table
                ref="filterHandler"
                :data="allUserInfo"
                highlight-current-row
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
              <el-table-column property="area" label="区域"  width="40"
                               :filters="areaFilters"
                               :filter-method="filterArea"
                               filter-placement="bottom-end"/>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="任务面板" name="2">

          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElContainer, ElHeader, ElMain, ElFooter, ElImage, ElRow, ElCol, ElButton,
  ElDivider, ElDescriptions, ElDescriptionsItem, ElIcon, ElCollapse, ElCollapseItem,
  ElTable, ElTableColumn, ElAvatar, ElUpload, ElMessage, ElCard, ElTag} from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { utils, writeFile, read } from "xlsx";

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

export default {
  name: 'app',
  components: {
    ElContainer, ElHeader, ElMain, ElFooter, ElImage,
    ElRow, ElCol, ElCollapse, ElCollapseItem,
    ElButton, ElDivider, ElDescriptions, ElDescriptionsItem, ElIcon,
    Close, ElTable, ElTableColumn, ElAvatar, ElUpload, ElCard, ElTag
  },
  data() {
    return {
      actionPanelIsShow: false,
      allUserInfo:[],
      allUserInfoMain: [],
      userSelection: [],
      fileList: [],
      areaFilters: [
        { text: '未分区', value: '-' },
      ]
    }
  },
  created() {
    let this_ = this
    window.ipcRenderer.receive("fromMain", function (user_data) {
      console.log(user_data)
      this_.allUserInfoMain = JSON.parse(user_data.user_data);
    });
  },
  methods: {
    filterArea(value, row) {
      return row.area === value
    },
    handleSelectionChange(val) {
      this.userSelection = val
    },
    handleUserExcel(file, fileList) {
      let reader = new FileReader();
      reader.onload = function(e) {
        let data = e.target.result;
        let workbook = read(data, {type: 'binary'});
        let first_sheet_name = workbook.SheetNames[0];

        /* Get worksheet */
        let worksheet = workbook.Sheets[first_sheet_name];

        let all_user = {}
        let range = utils.decode_range(worksheet["!ref"])
        for (let i = range.s.r + 1; i < range.e.r; i++) {
          all_user[worksheet[utils.encode_col(1) + utils.encode_row(i)].v] = {
              image_url:worksheet[utils.encode_col(0) + utils.encode_row(i)].v,
              uid: worksheet[utils.encode_col(1) + utils.encode_row(i)].v,
              uname: worksheet[utils.encode_col(2) + utils.encode_row(i)].v,
              area: worksheet[utils.encode_col(3) + utils.encode_row(i)].v
          }
        }
        localStorage.setItem("excel_user", JSON.stringify(all_user));
      }
      reader.readAsBinaryString(file.raw);
    },
    showDataPanel() {
      let main_app = document.getElementsByClassName("main_app")[0];
      let mainPanel = document.getElementById("mainPanel");
      let actionPanel = document.getElementById("actionPanel");
      mainPanel.style.borderLeft = '1px solid var(--el-border-color-base)' ;
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
      // let excelAllUser = null
      // let excelAllUserStr = localStorage.getItem("excel_user");
      // if (excelAllUserStr){
      //   excelAllUser = JSON.parse(excelAllUserStr);
      // }
      // chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
      //   console.log(response.data)
      let data = [];
      let allFilter = new Set();
      this_.areaFilters = [{ text: '未分区', value: '-' }]
      Object.keys(this.allUserInfoMain).forEach(function (key){
        let new_user = this_.allUserInfoMain[key];
        // if (excelAllUser != null && excelAllUser[key] != undefined) {
        //   new_user['area'] = excelAllUser[key].area;
        //   allFilter.add(excelAllUser[key].area);
        // }
        data.push(new_user);

      })
      for(let key of allFilter){
        this_.areaFilters.push({ text: key, value: key })
      }
      this_.allUserInfo = data;
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
        ws_data.push([user.image_url, user.uid, user.uname])
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
</style>
