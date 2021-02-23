<template>
  <d2-container>
    <el-dropdown size="small" class="d2-mr">
      <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item @click.native="dialogFormVisible = true">
          <d2-icon name="pencil-square-o" class="d2-mr-5" />修改密码
        </el-dropdown-item> -->
        <el-dropdown-item @click.native="logOff">
          <d2-icon name="power-off" class="d2-mr-5" />退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form
        :model="form"
        size="small"
        :rules="rules"
        :label-width="formLabelWidth"
        ref="ruleForm"
      >
        <el-form-item label="原始密码" prop="oldpwd">
          <el-input v-model="form.oldpwd" type="password" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input v-model="form.newpwd" type="password" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpwd">
          <el-input v-model="form.confirmpwd" type="password" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm" size="small">取 消</el-button>
        <el-button type="primary" @click="savePwd" size="small">保 存</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { aes_encryptObject, getrq } from '@/api/tools'
import { ChangePwd } from '@api/modules/sys.user'
export default {
  computed: {
    ...mapState('d2admin/user', ['info']),
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.form.newpwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      formLabelWidth: '80px',
      form: {
        oldpwd: '',
        newpwd: '',
        confirmpwd: '',
      },
      rules: {
        oldpwd: [
          { required: true, message: '原始密码不能为空', trigger: 'blur' },
        ],
        newpwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
        ],
        confirmpwd: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    ...mapActions('d2admin/account', ['logout']),
    /**
     * @description 登出
     */
    logOff() {
      this.logout({
        confirm: true,
      })
    },
    savePwd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = aes_encryptObject({
            username: this.info.name,
            password: this.form.oldpwd,
            new_password: this.form.newpwd,
          })
          ChangePwd(data).then((res) => {
            if (res.code === '0') {
              this.$message.success('登录密码修改成功，请重新登录')
              this.$router.replace({
                name: 'login',
              })
            }
          }).catch(e=>{
            console.log(e)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelForm() {
      this.dialogFormVisible = false
      this.$refs.ruleForm.resetFields()
    },
  },
}
</script>
