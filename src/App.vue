<template>
  <div class="page">
    <div class="common-layout">
      <el-container>
        <el-header>
          <router-link to="/">主页</router-link> |
          <router-link to="/clan">公会</router-link> |
          <router-link to="/help">帮助</router-link> |
          <router-link to="/about">关于</router-link>
        </el-header>
      </el-container>
    </div>
    <router-view />
    <div class="common-layout">
      <el-container>
        <el-footer
          >Yuki Clanbattle by
          <el-link type="primary" href="https://github.com/ColdThunder11"
            >ColdThunder11</el-link
          > &nbsp;&nbsp;&nbsp;&nbsp;Illustration:&nbsp;<el-link type="primary" href="https://www.pixiv.net/artworks/87514114">PID:87514114</el-link> by 
          <el-link type="primary" href="https://www.pixiv.net/users/7075448">u_U</el-link> 
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  padding:0px;
  margin:0px;
  position:absolute;
  top:0px;
  left:0px;
  width:100%;
  height:100%;
  border:hidden;
}
.el-header {
  /*background-color: #409EFF;*/
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
.el-footer {
  /*background-color: #409EFF;*/
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
.page{
  margin: 0 0 0 0;
  background:url("https://pic.wkny.moe/images/2021/10/13/87514114_p0459b2235439aded4.png");
  width:100%;
  height:100%;
  position:fixed;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
