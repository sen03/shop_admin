/* eslint-disable */
export default {
  data() {
    return {
      rolesData: [
        {
          roleName: '主管',
          roleDesc: '技术负责人'
        }
      ],
      // 是否显示 对话框
      dialogAssignRightsVisible: false,
      // 树的数据
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        // children 负责显示结构
        children: 'children',
        // label : 负责显示标题
        label: 'authName'
      },
      // 角色id
      roleId: 0
    }
  },
  created() {
    this.loadRolesData()
    this.loadAllRightsData()
  },
  methods: {
    // 加载角色列表数据
    async loadRolesData() {
      let res = await this.$axios.get('roles')
      console.log(res)

      this.rolesData = res.data.data
    },
    // 处理索引
    indexMethod(index) {
      return index
    },
    // 获取所有的权限信息
    async loadAllRightsData() {
      let res = await this.$axios.get('rights/tree')
      console.log(res)
      this.treeData = res.data.data
    },
    // 显示分配权限对话框
    showAssignRightsDialog(row) {
      //0. 拿到row的id(角色id) 保存起来
      this.roleId = row.id

      //1. 窗口显示
      this.dialogAssignRightsVisible = true

      //2. 获取第三层的id
      let keys = []
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            console.log(item3.id)
            keys.push(item3.id)
          })
        })
      })

      //3. 设置  keys
      // 原因异步DOM更新,打印有点早了,
      // DOM更新完毕了,再获取
      // nextTick
      this.$nextTick(() => {
        console.log(this.$refs.tree)
        this.$refs.tree.setCheckedKeys(keys)
      })
    },
    // 分配权限
    async assignRights() {
      //1. 获取Tree 里 半选和选中的key
      let keys1 = this.$refs.tree.getHalfCheckedKeys()
      let keys2 = this.$refs.tree.getCheckedKeys()
      // console.log(keys2)
      let keys = keys1.concat(keys2)

      // 参数
      // 参数1 : roleId 当前角色的id   this.roleId
      // 参数2 :  rids 权限的id
      let res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        // 要的是,分割的字符串
        rids: keys.join(',')
      })

      console.log(res)
      if (res.data.meta.status === 200) {
        // 1. 关闭对话框
        this.dialogAssignRightsVisible = false
        // 2. 提示消息
        this.$message({
          message: '分配权限成功',
          type: 'success',
          duration: 800
        })
        // 3. 刷新
        this.loadRolesData()
      }
    }
  }
}
