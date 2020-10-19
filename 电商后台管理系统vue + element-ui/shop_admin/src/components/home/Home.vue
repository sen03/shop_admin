<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8">
          <img
            src="../../assets/images/logo.gif"
            alt="logo"
            class="logo1"
          />
          <img
            src="../../assets/images/logo.png"
            alt="logo"
            class="logo2"
          />
        </el-col>
        <el-col :span="8">
          <h1>电商后台管理系统</h1>
        </el-col>
        <el-col
          :span="8"
          class="col_r"
        >
          前端项目<a
            href="#"
            @click.prevent="logout()"
          >退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- 侧栏 -->
        <!--
          el-menu : 菜单组件
           -  default-active="2" 默认选中 默认高亮 (index:2)
           - @open="handleOpen"
           - @close="handleClose"
          el-submenu 菜单子组件 (可展开)
          el-menu-item 菜单元素 (最小单位)
          el-menu-item-group 分组
        -->
        <el-menu
          :router="true"
          :default-active="test()"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#e9f0f1"
          text-color="#000"
          active-text-color="#007ACC"
        >
          <!-- 用户管理 -->
          <el-submenu
            :index="item.id+''"
            v-for='item in menus'
            :key='item.id'
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 菜单元素 -->
            <el-menu-item
              v-for='item1 in item.children'
              :key='item1.id'
              :index="'/'+item1.path"
            >{{ item1.authName }}</el-menu-item>
          </el-submenu>
          <!-- 权限管理 -->
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template> -->
          <!-- 菜单元素 -->
          <!-- <el-menu-item index="/roles">角色列表</el-menu-item>
            <el-menu-item index="/rights">权限列表</el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 子组件的出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.loadMenusData()
  },
  methods: {
    // 退出
    logout () {
      this.$confirm("确认退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 1.退出登录需清除token
          localStorage.removeItem("token");
          this.$message({
            type: "success",
            message: "退出成功!",
            duration: 800
          });
          // 2.跳转至login页面
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出",
            duration: 800
          });
        });
    },
    // 导航菜单打开和关闭
    handleOpen () {
      console.log("打开了");
    },
    handleClose () {
      console.log("关闭了");
    },
    // 加载菜单
    async loadMenusData () {
      let res = await this.$axios.get('menus')
      console.log(res);
      this.menus = res.data.data

    },
    // 侧栏打开的路径
    test () {
      console.log('侧栏打开的路径:', this.$route.path.split('/')[1]);
      return '/' + this.$route.path.split('/')[1]
    }
  }
};
</script>

<style scoped lang="less">
/* 外部容器 */
.el-container {
  height: 100%;
  min-width: 900px;
}

/* 头部 */
.el-header {
  background: #0683b1;
  padding: 0;
  .logo1 {
    width: 90px;
    height: 60px;
  }

  .logo2 {
    width: 60px;
    height: 60px;
    margin-left: 25px;
  }

  h1 {
    color: #fff;
    text-align: center;
    line-height: 60px;
    font-size: 26px;
  }

  .col_r {
    text-align: center;
    line-height: 60px;
    padding-right: 30px;
  }

  .col_r a {
    color: #71bb7b;
  }
}

/* 侧边栏 */
.el-aside {
  background: #e9f0f1;
}

/* 主体 */
.el-main {
  background: #f1f4f5;
}
</style>
