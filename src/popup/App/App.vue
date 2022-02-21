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
            <el-descriptions-item><el-button size="small" @click="showDataPanel()">获取所有用户</el-button></el-descriptions-item>
            <el-descriptions-item><el-button size="small">保存用户信息为excel表</el-button></el-descriptions-item>
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
      <div>没有数据</div>
    </el-container>
  </div>
</template>

<script>
import { ElContainer, ElHeader, ElMain, ElFooter, ElImage, ElRow, ElCol, ElButton,
  ElDivider, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import 'element-plus/dist/index.css';
export default {
  name: 'app',
  components: {
    ElContainer, ElHeader, ElMain, ElFooter, ElImage,
    ElRow, ElCol,
    ElButton, ElDivider, ElDescriptions, ElDescriptionsItem
  },
  data() {
    return {
      actionPanelIsShow: false,
    }
  },
  methods: {
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
</style>
