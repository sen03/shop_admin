<template>
  <el-row
    type="flex"
    justify="center"
    align="middle"
  >
    <el-col :span="8">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="username"
        >
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="startLogin()"
          >登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    startLogin () {
      // // 校验 :(async await 改造)
      // this.$refs.ruleForm.validate(async valid => {
      //   if (!valid) {
      //     return alert('格式不正确')
      //   }

      //   // 就可以放心的发送请求开始登录
      //   let res = await axios.post('http://localhost:8888/api/private/v1/login', this.ruleForm)
      //   console.log(res)
      //   if (res.data.meta.status === 200) {
      //     // 1. 把 token 保存到本地
      //     localStorage.setItem('token', res.data.data.token)

      //     // 2. 成功提示
      //     this.$message({
      //       message: '恭喜你，登录成功',
      //       type: 'success',
      //       duration: 800
      //     })
      //     // 3. 跳转到home页
      //     this.$router.push('/home')
      //   } else {
      //     this.$message({
      //       message: res.data.meta.msg,
      //       type: 'error',
      //       duration: 800
      //     })
      //   }
      // Promise校验
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return alert('格式不正确!')
        }
        // 发送登录请求
        axios
          .post('http://localhost:8888/api/private/v1/login', this.ruleForm)
          .then(res => {
            if (res.data.meta.status === 200) {
              // 1 将token保存到本地
              localStorage.setItem('token', res.data.data.token)
              this.$message(
                {
                  // 2 成功提示 message消息提示
                  message: '恭喜你，登录成功',
                  type: 'success',
                  duration: 800
                })
              // 3 跳转到home页
              this.$router.push('/home')
            } else {
              this.$message(
                {
                  // 失败提示 message消息提示
                  message: res.data.meta.msg,
                  type: 'error',
                  duration: 800
                })
            }
          })
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped>
.el-row {
  height: 100%;
  background: #c1d6e0;
}

.el-col {
  background: #fff;
  padding: 20px 30px;
  border-radius: 15px;
}
</style>
