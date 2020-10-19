<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb
      class="bread"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="rightsData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
      > </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180"
      > </el-table-column>
      <el-table-column label="等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      // 权限数据
      rightsData: [
        {
          authName: "商品管理",
          path: "goods",
          level: "一级"
        }
      ]
    };
  },
  created () {
    this.loadRightsData();
  },
  methods: {
    // 方法：请求权限数据
    async loadRightsData () {
      let res = await this.$axios.get("rights/list");
      // console.log(res);
      this.rightsData = res.data.data;
    },
    // 处理索引
    // 形参 :形参的值 就是从 0 开始的
    // 方法的形参就是从0开始的,,我们需要的也就是从0开始的, 所以拿过来直接返回即可
    indexMethod (index) {
      // console.log(index);
      return index;
    }
  }
};
</script>

<style scoped>
.bread {
  height: 40px;
  background: #d4dae0;
  line-height: 40px;
  padding-left: 20px;
}
</style>
