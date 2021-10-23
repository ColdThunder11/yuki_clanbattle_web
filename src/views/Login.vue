<template>
  <div class="common-layout" style="text-align: center;">
    <el-container>
      <el-main>
        <el-form ref="form" :model="login_form" label-width="120px">
          <el-form-item label="QQ号">
            <el-input @keyup.enter="onLogin" v-model="login_form.qq_uid"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input @keyup.enter="onLogin" v-model="login_form.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
//import { h } from 'vue'
import axios from "axios";
// @ is an alias to /src
import { ElMessage } from "element-plus";

export default {
  name: "Login",
  data() {
    return {
      login_form: {
        qq_uid: "",
        password: "",
      },
    };
  },
  components: {},
  methods: {
    onLogin() {
      if (this.login_form.qq_uid == "" || this.login_form.password == "") {
        ElMessage("请输入用户名和密码");
        return;
      }
      axios.post("api/clanbattle/login", this.login_form)
        .then((resp) => {
          let resp_data = resp.data;
          if (resp_data.err_code != 0) {
            ElMessage.error(resp_data.msg);
          } else {
            localStorage.clear()
            this.$router.push("/clan")
          }
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
          ElMessage.error("登录失败：网络错误");
        });
    },
  },
};
</script>

<style>
.el-container {
  height: 100%;
}
</style>