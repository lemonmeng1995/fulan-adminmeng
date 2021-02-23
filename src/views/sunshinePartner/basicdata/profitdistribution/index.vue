<template>
  <d2-container>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      class="form"
      label-width="180px"
    >
      <el-form-item prop="total_fee" label="办卡成功一户，总费用为">
        <el-row>
          <el-col :span="4">
            <el-input v-model="formData.total_fee" type="text"></el-input>
          </el-col>
          <el-col :span="1" style="margin-left: 4px">元</el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分配规则说明">
        <div>1. 分配规则设置，总费用不可大于办卡成功一户的总费用</div>
        <div>2. 金额设置规则，默认小数点后2位</div>
        <div>3. 金额取整模式，默认四舍五入</div>
        <div>
          4.规则修改后，只对未导入的办卡数据生效，已导入的，按照原规则，到导入时计算利润
        </div>
        <div>5. 分配规则，修改后会对员工利润计算造成影响，请谨慎修改</div>
      </el-form-item>
      <el-form-item label="计算方式：">
        <el-select v-model="calculation_method" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="商户管理费:" prop="merchant_manage_fee">
            <span v-show="calculation_method == 1">￥</span>
            <el-input
              v-model="formData.merchant_manage_fee"
              type="text"
              style="margin: 0 2px"
            ></el-input>
            <span v-show="calculation_method == 1">元</span>
            <span v-show="calculation_method == 2">%</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="员工利润：" prop="staff_profit_fee">
            <span v-show="calculation_method == 1">￥</span>
            <el-input
              v-model="formData.staff_profit_fee"
              type="text"
              style="margin: 0 2px"
            ></el-input>
            <span v-show="calculation_method == 1">元</span>
            <span v-show="calculation_method == 2">%</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="神雀管理费：" prop="shenque_manage_fee">
            <span v-show="calculation_method == 1">￥</span>
            <el-input
              v-model="formData.shenque_manage_fee"
              type="text"
              style="margin: 0 2px"
            ></el-input>
            <span v-show="calculation_method == 1">元</span>
            <span v-show="calculation_method == 2">%</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="办卡客户奖励费用：" prop="customer_reward_fee">
            <span v-show="calculation_method == 1">￥</span>
            <el-input
              v-model="formData.customer_reward_fee"
              type="text"
              style="margin: 0 2px"
            ></el-input>
            <span v-show="calculation_method == 1">元</span>
            <span v-show="calculation_method == 2">%</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预存费用：" prop="prestorage_fee">
            <span v-show="calculation_method == 1">￥</span>
            <el-input
              v-model="formData.prestorage_fee"
              type="text"
              style="margin: 0 2px"
            ></el-input>
            <span v-show="calculation_method == 1">元</span>
            <span v-show="calculation_method == 2">%</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="submitForm('formData')" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { aes_encryptObject } from '@/api/tools'
export default {
  data() {
    var validateData1 = (rule, value, callback) => {
      let reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
      if (value === "") {
        callback(new Error("请输入金额"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正数，保留2位小数"));
      } else {
        callback();
      }
    };
    var validateData2 = (rule, value, callback) => {
      let reg = /^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
      if (value === "") {
        callback(new Error("请输入金额"));
      } else if (!reg.test(value)) {
        callback(new Error("请输入正数/0，保留2位小数"));
      } else if (this.calculation_method == 2 && value > 100) {
        callback(new Error("不能大于100%"));
      } else {
        callback();
      }
    };
    return {
      loading:false,
      formData: {
        total_fee: "",
        merchant_manage_fee: "",
        staff_profit_fee: "",
        shenque_manage_fee: "",
        customer_reward_fee: "",
        prestorage_fee: "",
      },
      calculation_method: 1,
      options: [
        {
          label: "指定金额",
          value: 1,
        },
        {
          label: "指定百分比",
          value: 2,
        },
      ],
      rules: {
        total_fee: [
          { required: true, validator: validateData1, trigger: "blur" },
        ],
        merchant_manage_fee: [
          { required: true, validator: validateData2, trigger: "blur" },
        ],
        staff_profit_fee: [
          { required: true, validator: validateData2, trigger: "blur" },
        ],
        shenque_manage_fee: [
          { required: true, validator: validateData2, trigger: "blur" },
        ],
        customer_reward_fee: [
          { required: true, validator: validateData2, trigger: "blur" },
        ],
        prestorage_fee: [
          { required: true, validator: validateData2, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.profitDistribution();
  },
  methods: {
    ...mapActions("d2admin/page", ["close"]),
    profitDistribution() {
      this.$http
        .get(this.$configApi.profitDistribution, {
          params: aes_encryptObject({
            project_id: sessionStorage.getItem('project_id'),
          }),
        })
        .then((res) => {
          if (res.code == 0) {
            this.calculation_method = res.data.calculation_method == 0 ? 1: res.data.calculation_method;
            this.formData = res.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http
            .post(this.$configApi.profitDistributionEdit,aes_encryptObject({
              project_id: sessionStorage.getItem('project_id'),
              calculation_method: this.calculation_method,
              total_fee: this.formData.total_fee,
              merchant_manage_fee: this.formData.merchant_manage_fee,
              staff_profit_fee: this.formData.staff_profit_fee,
              shenque_manage_fee: this.formData.shenque_manage_fee,
              customer_reward_fee: this.formData.customer_reward_fee,
              prestorage_fee: this.formData.prestorage_fee,
            }))
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
              }
              this.loading = false;
            })
            .catch((e) => {
              this.loading = false;
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.close({
        tagName: this.$route.fullPath
      })
      // this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  .el-col-8,
  .el-col-16 {
    .el-input {
      width: 215px;
    }
  }
}
</style>