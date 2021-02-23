<template>
  <d2-container>
    <el-form
      class="add-form-class"
      ref="addForm"
      :rules="rules"
      :model="addForm"
      label-width="150px"
    >
      <el-form-item label="角色名称:" prop="salesman_name">
        <el-input v-model="addForm.salesman_name"></el-input>
      </el-form-item>
      <el-form-item label="角色描述:" prop="merchant_id">
        <el-input type="textarea" v-model="addForm.salesman_mobile"></el-input>
      </el-form-item>
      <el-form-item label="角色权限:" prop="sale_role">
        <el-tree
          :data="dataTree"
          show-checkbox
          node-key="id"
          @check="handleNodeClick"
          :props="defaultProps"
        >
        </el-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')"
          >确认</el-button
        >
        <el-button @click="closePage">关闭</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "manageaddUserman",
  data() {
    return {
      addForm: {
        id: "",
        merchant_id: "",
        salesman_name:"",
        sale_role:'',
        status: 1,
      },
      rules: {
        store_id: [
          { required: true, message: "请选择实物店铺", trigger: "change" },
        ],
        salesman_name: [
          { required: true, message: "请输入业务人员姓名", trigger: "blur" },
        ],
        sale_role: [
          {
            required: true,
            message: "请选择权限",
            trigger: "blur",
          },
        ],
      },
      dataTree: [
        {
          id: 1,
          label: "系统管理",
          children: [
            {
              id: 4,
              label: "用户管理",
              children: [
                {
                  id: 9,
                  label: "新增",
                },
                {
                  id: 10,
                  label: "删除",
                },
                {
                  id: 14,
                  label: "编辑",
                },
                {
                  id: 15,
                  label: "导出",
                },
              ],
            },
            {
              id: 11,
              label: "角色管理",
              children: [
                {
                  id: 12,
                  label: "三级 1-1-1",
                },
                {
                  id: 13,
                  label: "三级 1-1-2",
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {
    ...mapState("d2admin/page", [
      "opened",
      "current", //用户获取当前页面的地址，用于关闭
    ]),
  },
  mounted() {
    this.addForm.id = this.$route.query.id ? this.$route.query.id : "";
    if (this.addForm.id) {
      // this.getdata();
      // this.$router.history.current.meta.title = '修改用户'
    } else {
    }
  },
  methods: {
    ...mapActions("d2admin/page", ["closeNowPage"]),
    handleNodeClick(data, node) {
      console.log("节点被点击时的回调，", data, node);
      this.addForm.sale_role = data
    },
    getCheckedNodes(leafOnly, includeHalfChecked) {
      console.log("目前被选中的节点所组成的数组", leafOnly, includeHalfChecked);
    },
    //提交表单
    submitForm(formName) {
      console.log("提交表单", formName);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("表单数据", this.addForm);
          //   let data=aes_encryptObject(this.addForm)
          //   this.$http.post('/v1/cooperative_org/add_modify', data).then((res) => {

          // })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closePage() {
      let tagName = this.current;
      this.closeNowPage({ tagName });
      this.$router.push("/management/role");
    },
  },
};
</script>

<style lang="scss" scoped>
.add-form-class {
  .el-input {
    width: 40%;
  }
  .el-checkbox-group,
  .el-textarea {
    width: 40%;
  }
}
</style>