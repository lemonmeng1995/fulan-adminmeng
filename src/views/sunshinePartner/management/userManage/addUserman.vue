<template>
  <d2-container>
    <el-form
      class="add-form-class"
      ref="addForm"
      :rules="rules"
      :model="addForm"
      label-width="150px"
    >
      <el-form-item label="用户名：" prop="salesman_name">
        <el-input v-model="addForm.salesman_name"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="salesman_mobile">
        <el-input v-model="addForm.salesman_mobile"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="salesman_name">
        <el-input v-model="addForm.salesman_name"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="salesman_mobile">
        <el-input v-model="addForm.salesman_mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱： " prop="salesman_mobile">
        <el-input v-model="addForm.salesman_mobile"></el-input>
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
        code: "",
        name: "",
        merchant_id: "",
        merchant_name: "",
        store_id: "",
        store_code: "",
        card_store_id: "",
        card_store_code: "",
        salesman_name: "",
        salesman_mobile: "",
        status: 1,
        card_store_name: "",
        type: [],
      },
      rules: {
        merchant_id: [
          { required: true, message: "请选择商家", trigger: "change" },
        ],
        store_id: [
          { required: true, message: "请选择实物店铺", trigger: "change" },
        ],
        card_store_id: [
          { required: true, message: "请选择虚拟店铺", trigger: "change" },
        ],
        salesman_name: [
          { required: true, message: "请输入业务人员姓名", trigger: "blur" },
        ],
        salesman_mobile: [
          {
            required: true,
            message: "请输入业务人员手机号码",
            trigger: "blur",
          },
        ],
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
    //提交表单
    submitForm(formName) {
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
      this.$router.push("/management/user");
    },
  },
};
</script>

<style lang="scss" scoped>
.add-form-class {
  .el-input {
    width: 40%;
  }
  .el-checkbox-group {
    width: 40%;
  }
}
</style>