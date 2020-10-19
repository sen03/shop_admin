/* eslint-disable */
export default {
  data() {
    return {
      usersData: [{
          username: "sen",
          email: "sen@.com",
          mobile: "123123123"
        },
        {
          username: "sen2",
          email: "sen@.com",
          mobile: "123123123"
        }
      ],
      // 总个数
      total: 0,
      // 当前页
      pagenum: 1,
      //查询内容
      queryText: "",
      // 用户状态
      // state: true,
      // 是否 显示添加用户 对话框
      dialogAddUserFormVisible: false,
      // 添加用户表单对象
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户 的校验规则
      rules: {
        // 用户名
        username: [
          // 判断是否有输入内容
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          // 判断 格式是否正确
          {
            min: 2,
            max: 6,
            message: "输入内容应该在 2-6 之间",
            trigger: "blur"
          }
        ],
        // 用户名
        password: [
          // 判断是否有输入内容
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          // 判断 格式是否正确
          {
            min: 5,
            max: 10,
            message: "输入密码内容应该在 5-10 之间",
            trigger: "blur"
          }
        ],
        // 邮箱
        email: [{
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: "格式不正确",
          trigger: "blur"
        }],
        // 手机
        mobile: [{
          pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
          message: "格式不正确",
          trigger: "blur"
        }]
      },
      // 是否显示编辑用户对话框
      dialogEditUserFormVisible: false,
      editUserForm: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      // 是否显示分配角色对话框
      dialogAssignRoleVisible: false,
      // 分配角色表单对象
      assignRoleForm: {
        username: "",
        id: 0,
        rid: ""
      },
      // 角色列表
      rolesData: []
    };
  },
  created() {
    // 获取路由 参数 =>页码
    const page = this.$route.params.page
    // console.log(page)
    this.loadUsersData(page);
    this.loadRolesData();
  },
  methods: {
    // 方法：加载用户信息 async await改造
    async loadUsersData(pagenum = 1, query = "") {
      const url = "users";
      const config = {
        params: {
          query,
          pagenum,
          pagesize: 2
        }
        // axios请求需要携带token main.js已解决
        // headers: {
        //   Authorization: localStorage.getItem("token")
        // }
      };

      let res = await this.$axios.get(url, config);
      // console.log(res);
      // 保存列表数据
      this.usersData = res.data.data.users;
      // 保存 用户总个数
      this.total = res.data.data.total;
      // 保存当前页码
      this.pagenum = res.data.data.pagenum;

      // loadUsersData(pagenum = '1', query = '') {
      //   axios
      //     .get('http://localhost:8888/api/private/v1/users', {
      //       params: {
      //         query,
      //         pagenum,
      //         pagesize: 2
      //       },
      //       headers: {
      //         Authorization: localStorage.getItem('token')
      //       }
      //     })
      //     .then(res => {
      //       // console.log(res)
      //       // 保存列表数据
      //       this.usersData = res.data.data.users
      //       // 保存 用户总个数
      //       this.total = res.data.data.total
      //       // 保存当前页码
      //       this.pagenum = res.data.data.pagenum
      //     })
    },
    // 方法：点击页码
    clickCurrentPage(curPage) {
      // console.log('点击了页码', curPage)

      // 改变入口路径
      this.$router.push('/users/' + curPage)

      // this.queryText 内容里面的第几页
      this.loadUsersData(curPage, this.queryText);
    },
    startQuery() {
      // t :  查看内容为t的第一页
      this.loadUsersData(1, this.queryText);
    },
    // 方法：显示添加用户对话框
    showAddUserDialog() {
      this.dialogAddUserFormVisible = true;
    },
    // 方法：添加用户
    async addUser() {
      // 收集表单数据 发送请求
      // 格式 : axios.post(url,data,config)
      let res = await this.$axios.post("users", this.addUserForm);
      // console.log(res);
      if (res.data.meta.status === 201) {
        //1. 关闭对话框
        this.dialogAddUserFormVisible = false;
        //2. 重新刷新页面
        this.loadUsersData();
        //3. 添加用户成功提示
        this.$message({
          message: "添加用户成功",
          type: "success",
          duration: 800
        });
        // 4. 重置表单
        this.$refs.addUserForm.resetFields();
      } else {
        console.log("添加失败");
        // 添加失败
      }
    },
    // 方法：删除用户
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        // 发送请求删除用户
        // axios.delete(url,config)
        let res = await this.$axios.delete(`users/${id}`);
        // console.log(res);
        if (res.data.meta.status === 200) {
          //1. 刷新页面
          this.loadUsersData();
          //2. 提示
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 800
          });
        }
      } catch (error) {
        this.$message({
          message: "取消删除",
          type: "info",
          duration: 800
        });
      }
    },
    // 方法：用户状态改变
    async stateChanged(row) {
      //1. 从row 对象里 获取  id 和 mg_state
      const {
        id,
        mg_state: mgState
      } = row;

      // console.log('改了:', mgState)
      // change事件  false => true
      // 格式 : axios.put(url,data,config)
      let res = await this.$axios.put(`users/${id}/state/${mgState}`);
      // console.log(res)
      if (res.data.meta.status === 200) {
        //1. 提示修改状态成功
        this.$message({
          message: "修改状态成功",
          type: "success",
          duration: 800
        });
        //2. 刷新当前页
        this.loadUsersData(this.pagenum);
      }
    },
    // 方法：显示编辑用户对话框
    showEditUserDialog(row) {
      //1. 获取 用户名 邮箱 电话
      const {
        username,
        email,
        mobile,
        id
      } = row;

      //2. 赋值给绑定表单的数据对象 editUserForm
      this.editUserForm.username = username;
      this.editUserForm.email = email;
      this.editUserForm.mobile = mobile;
      this.editUserForm.id = id;

      this.dialogEditUserFormVisible = true;
    },
    // 方法：编辑用户
    async editUser() {
      // 1. 从编辑用户对象里读取需要的数据
      const {
        email,
        mobile,
        id
      } = this.editUserForm;

      // axios.put(url,data,config)
      let res = await this.$axios.put(`users/${id}`, {
        email,
        mobile
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        //1.关闭对话框
        this.dialogEditUserFormVisible = false;
        //2. 刷新页面
        this.loadUsersData(this.pagenum);
        //3. 提示
        this.$message({
          message: "更新成功",
          type: "success",
          duration: 800
        });
      }
    },
    // 方法：获取所有的角色列表
    async loadRolesData() {
      let res = await this.$axios.get("roles");
      // console.log(res);
      this.rolesData = res.data.data;
    },
    // 方法：显示分配角色对话框
    async showAssignRoleDialog(row) {
      this.dialogAssignRoleVisible = true;
      //1. 获取 对象里 需要三个参数 id username rid
      const {
        id,
        username
      } = row;
      // rid 在row中没有,但是留了一个接口, 可以使用id 去请求获取
      // 根据 ID 查询用户信息
      let res = await this.$axios.get(`users/${id}`);
      // console.log(res);
      //2. 把三个参数 赋值 给 assignRoleForm对象
      this.assignRoleForm.id = id;
      this.assignRoleForm.username = username;
      this.assignRoleForm.rid =
        res.data.data.rid == -1 ? "" : res.data.data.rid;
    },
    // 方法：分配角色
    async assignRole() {
      //1. 获取需要的参数
      let {
        id,
        rid
      } = this.assignRoleForm;
      //2. 请求
      let res = await this.$axios.put(`users/${id}/role`, {
        rid
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        //1. 关闭对话框
        this.dialogAssignRoleVisible = false;
        //2. 提示
        this.$message({
          message: "分配角色成功",
          type: "success",
          duration: 800
        });
        //3.刷新
        this.loadUsersData(this.pagenum);
      }
    }
  }
};
