<template>
  <div class="main_app">
    <el-container id="mainPanel">
      <el-header>
        <el-row>
          <el-col :span="4">
            <el-image
                style="width: 38px; height: 38px"
                :src="require('./message.png')"
                :fit="'cover'"
            ></el-image>
          </el-col>
          <el-col :span="11"><h3>message消息发送器</h3></el-col>
        </el-row>
        <el-row>
          <el-divider style="margin-left: -8px; margin-right: -8px;width:calc(100% + 16px);"></el-divider>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
          <el-descriptions title="好友数据操作" :column="2" :size="'small'">
            <el-descriptions-item><el-button size="small" @click="getAllUserInfo()">获取所有用户</el-button></el-descriptions-item>
            <el-descriptions-item><el-button size="small" @click="saveUserToExcel()">保存用户信息为excel表</el-button></el-descriptions-item>
            <el-descriptions-item><el-button size="small">读取excel好友表</el-button></el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-descriptions title="自动化信息设置" :column="2" :size="'small'">
            <el-descriptions-item><el-button size="small">消息文本</el-button></el-descriptions-item>
            <el-descriptions-item><el-button size="small">定时设置</el-button></el-descriptions-item>
          </el-descriptions>
        </el-row>
      </el-main>
      <el-footer>
        <el-divider style="margin-left: -8px; margin-right: -8px;width:calc(100% + 16px);"></el-divider>
        <div style="margin-top: 15px;color: #99999980">iMessenger by princeLau</div>
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
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="全部聊天" name="1">
            <el-table
                ref="filterHandler"
                :data="allUserInfo"
                highlight-current-row
                :size="'small'"
                row-key="uid"
                style="width: 100%">
              <el-table-column type="selection"/>
              <el-table-column property="image_url" label="头像">
                <template #default="scope">
                  <el-avatar :size="50" :src="scope.row.image_url"></el-avatar>
                </template>
              </el-table-column>
<!--              <el-table-column property="uid" label="uid"/>-->
              <el-table-column property="uname" label="用户名"/>
              <el-table-column property="area" label="区域"
                               :filters="[
                                { text: '未分区', value: '-' },
                                { text: '美国', value: '美国' },
                              ]"
                               :filter-method="filterArea"
                               filter-placement="bottom-end"/>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ElContainer, ElHeader, ElMain, ElFooter, ElImage, ElRow, ElCol, ElButton,
  ElDivider, ElDescriptions, ElDescriptionsItem, ElIcon, ElCollapse, ElCollapseItem,
  ElTable, ElTableColumn, ElAvatar} from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { utils, writeFile } from "xlsx";
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
export default {
  name: 'app',
  components: {
    ElContainer, ElHeader, ElMain, ElFooter, ElImage,
    ElRow, ElCol, ElCollapse, ElCollapseItem,
    ElButton, ElDivider, ElDescriptions, ElDescriptionsItem, ElIcon,
    Close, ElTable, ElTableColumn, ElAvatar
  },
  data() {
    return {
      actionPanelIsShow: false,
      allUserInfo:[],
    }
  },
  methods: {
    filterArea(value, row) {
      return row.area === value
    },
    showDataPanel() {
      let main_app = document.getElementsByClassName("main_app")[0];
      let mainPanel = document.getElementById("mainPanel");
      let actionPanel = document.getElementById("actionPanel");
      main_app.style.width = '600px' ;
      mainPanel.style.borderLeft = '1px solid var(--el-border-color-base)' ;
      mainPanel.style.float = 'right';
      console.log(mainPanel.offsetHeight);
      actionPanel.style.height = mainPanel.offsetHeight;
      this.actionPanelIsShow = true;
    },

    hiddenDataPanel(){
      let main_app = document.getElementsByClassName("main_app")[0];
      let mainPanel = document.getElementById("mainPanel");
      let actionPanel = document.getElementById("actionPanel");
      main_app.style.width = '300px' ;
      mainPanel.style.borderLeft = '0px' ;
      mainPanel.style.float = 'right';
      // actionPanel.style.height = '0px'
      this.actionPanelIsShow = false;
    },

    getAllUserInfo(){
      let this_ = this
      chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
        console.log(response.data)
        let data = [];
        Object.keys(response.data).forEach(function (key){
          data.push(response.data[key]);
        })
        this_.allUserInfo = data;
      });
      this.showDataPanel();
    },

    saveUserToExcel(){
      let wb = utils.book_new();
      let ws_name = "SheetJS";
      let ws_data = [
        [ "用户头像", "用户uid", "用户名", "国家"]
      ];
      chrome.runtime.sendMessage({type:'getUserInfo'},function(response) {
        Object.keys(response.data).forEach(function (key) {
          let user = response.data[key]
          ws_data.push([user.image_url, user.uid, user.uname])
        })
        let ws = utils.aoa_to_sheet(ws_data);
        /* Add the worksheet to the workbook */
        utils.book_append_sheet(wb, ws, ws_name);
        writeFile(wb, 'messager用户表.xlsx');
      })
    }
  }
}
</script>

<style>
body{
  margin: 0;
}
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 300px;
}
#mainPanel{
  position: relative;
  width: 300px;
  margin-right: 0px;
}

.el-header{
  --el-header-padding: 0 0;
  --el-header-height: 50px;
  margin: 8px;
}
.el-main{
  --el-main-padding: 0 0;
  margin: 8px;
  height: 450px;
}
.el-divider--horizontal{
  margin: 0;

}
.el-descriptions__header{
  margin-top: 8px;
  margin-bottom: 8px;
}
.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell{
  padding-bottom: 8px;
}
.el-footer{
  --el-footer-padding: 0;
  --el-footer-height: 40px;
  margin: 8px;
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
</style>
