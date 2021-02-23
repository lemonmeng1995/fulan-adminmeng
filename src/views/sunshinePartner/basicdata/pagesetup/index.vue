<template>
  <d2-container>
    <el-form
      class="add-form-class"
      ref="addForm"
      :rules="rules"
      :model="addForm"
      label-width="150px"
    >
      <el-form-item label="首页背景图：" prop="index_bg_image">
        <el-upload
          class="avatar-uploader"
          v-loading.fullscreen.lock="Loading"
          element-loading-text="图片正在上传中，请稍等"
          action
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="(file) => beforeAvatarUpload(file)"
        >
          <img
            v-if="addForm.index_bg_image"
            :src="addForm.index_bg_image"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="登录链接：" prop="login_link">
        <el-input type="textarea" v-model="addForm.login_link"></el-input>
      </el-form-item>
      <el-form-item label="在线客服：" prop="online_service">
        <el-input
          type="textarea"
          v-model="addForm.online_service"
        ></el-input> </el-form-item
      ><el-form-item label="提现说明：" prop="withdrawal_intro">
        <el-input
          type="textarea"
          v-model="addForm.withdrawal_intro"
        ></el-input> </el-form-item
      ><el-form-item label="单笔提现额度说明：" prop="single_withdrawal_intro">
        <el-input
          type="textarea"
          v-model="addForm.single_withdrawal_intro"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('addForm')"  v-permission="['basicdata_pagesetup_submit']"
          >确认</el-button
        >
        <!-- <el-button @click="closePage">关闭</el-button> -->
      </el-form-item>
    </el-form>
  </d2-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { aes_encryptObject } from '@/api/tools'
import qs from "qs";
import {
  uploadComFun,
  configEditeFun,
  configEditFun,
} from "@api/modules/sys.user.js";
import axios from "axios";
export default {
  name: "manageaddUserman",
  data() {
    return {
      addForm: {
        id: "",
        index_bg_image: "",
        // IndexBgImage2:'',
        login_link: "",
        online_service: "",
        withdrawal_intro: "",
        single_withdrawal_intro: "",
      },
      Loading: false,
      headers: { "content-type": "multipart/form-data" },
      actionHttp: "",
      // IndexBgImage: "",
      //  IndexBgImage: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607513842586&di=26c7e96cf7f41910502fda967971e970&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F30%2F29%2F01300000201438121627296084016.jpg',
      rules: {
        index_bg_image: [
          { required: true, message: "请上传首页背景图", trigger: "blur" },
        ],
        login_link: [
          { required: true, message: "请输入登录链接", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              //                  /^http:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
              if (
                /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(
                  value
                ) == false
              ) {
                callback(new Error("请输入正确的登录链接！"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        // online_service: [
        //   { required: true, message: "请输入在线客服", trigger: "blur" },
        // ],
        withdrawal_intro: [
          { required: true, message: "请输入提现说明", trigger: "blur" },
        ],
        single_withdrawal_intro: [
          { required: true, message: "请输入单笔提现额度说明", trigger: "blur" },
        ],
      },
      hasDataPermission: this.hasPermissions(["basicdata_pagesetup_data"])
    };
  },
  computed: {
    ...mapState("d2admin/page", [
      "opened",
      "current", //用户获取当前页面的地址，用于关闭
    ]),
  },
  mounted() {  
    if (this.hasDataPermission) {
      this.getconfigEditeFun();
    } else {
      this.$message.info('您还没有该数据权限');
      return
    }
    if (this.addForm.ID) {
      // this.getdata();
      // this.$router.history.current.meta.title = '修改用户'
    } else {
    }
    this.actionHttp = process.env.VUE_APP_API + this.$configApi.uploadCom;
  },
  methods: {
    ...mapActions("d2admin/page", ["closeNowPage"]),

    async getconfigEditeFun() {
      const res = await configEditeFun();
      if (res.code === "0") {
        this.addForm.id = res.data.ID;
        this.addForm.index_bg_image = res.data.IndexBgImage;
        this.addForm.login_link = res.data.LoginLink;
        this.addForm.online_service = res.data.OnlineService;
        this.addForm.withdrawal_intro = res.data.WithdrawalIntro;
        this.addForm.single_withdrawal_intro = res.data.SingleWithdrawalIntro;
      }
    },
    //configEditFun
    async getconfigEditFun() {
      const res = await configEditFun(this.addForm);
      if (res.code === "0") {
        this.getconfigEditeFun();
        this.$message.success(res.msg);
      }
    },
    handleAvatarSuccess(res, file) {
      this.addForm.index_bg_image = URL.createObjectURL(file.raw);
    },
    upLoadImg(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传文件格式不正确!");
        return;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 1MB!");
        return;
      }

      const fromData = new FormData();
      fromData.append("file", file);

      let url = process.env.VUE_APP_API + "/v1/common/upload";
      let config = {
        headers: {
          //添加请求头
          "Content-Type": "multipart/form-data",
          Authorization: sessionStorage.getItem("token"),
        },
      };
      axios
        .post(url, fromData, config)
        .then((res) => {
          if (res.data.code === "0") {
            this.addForm.index_bg_image = res.data.data.url;
            this.$message({
              message: "图片上传成功",
              type: "success",
            });
            this.Loading = false;
          }
        })
        .catch((err) => {
          console.log("错误", err);
          this.$message({
            message: "图片上传错误",
            type: "warning",
          });
        });
    },
    beforeAvatarUpload(file) {
      this.Loading = true;
      this.upLoadImg(file);
    },

    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getconfigEditFun();
        } else {
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
  .el-input,
  .el-textarea {
    width: 40%;
  }
}

.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>