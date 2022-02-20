<template>
  <div class="main_app">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="4">
            <el-image
                style="width: 38px; height: 38px"
                :src="require('./message.png')"
                :fit="'cover'"
            ></el-image>
          </el-col>
          <el-col :span="13"><h3>message消息发送器</h3></el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row>
            <el-button>获取所有用户</el-button>
            <el-button>发送消息</el-button>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-button>获取所有用户</el-button>
            <el-button>发送消息</el-button>
        </el-row>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import { ElContainer, ElHeader, ElMain, ElFooter, ElImage, ElRow, ElCol, ElCard, ElButton } from 'element-plus';
import 'element-plus/dist/index.css';
export default {
  name: 'app',
  components: {
    ElContainer, ElHeader, ElMain, ElFooter, ElImage,
    ElRow, ElCol, ElCard,
    ElButton,
  },
}
</script>

<style>
.main_app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 300px;
}
</style>
