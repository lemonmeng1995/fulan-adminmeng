<template>
  <d2-container>
    <template>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="员工姓名：" prop="fullname">
          <el-input
            v-model="formInline.fullname"
            placeholder=""
          ></el-input> 
        </el-form-item>
        <el-form-item label="员工编码：" prop="code">
          <el-input
            v-model="formInline.code"
            placeholder=""
          ></el-input> 
        </el-form-item>
        <el-form-item label="合作方员工编码：" prop="partner_code">
          <el-input
            v-model="formInline.partner_code"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="系统员工编码：" prop="system_code" >
          <el-input
            v-model="formInline.system_code"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="项目来源码：" prop="project_code">
          <el-input
            v-model="formInline.project_code"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="场景门店代码：" prop="store_code">
          <el-input
            v-model="formInline.store_code"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input
            v-model="formInline.mobile"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="serch" icon="el-icon-search" v-permission="['basicdata_staffpages_search']">查询</el-button>
          <el-button type="primary" @click="add" icon="el-icon-circle-plus-outline" v-permission="['basicdata_staffpages_add']">新建员工</el-button>
          <el-button type="warning"  @click="importHandle" icon="el-icon-upload" v-permission="['basicdata_staffpages_import']">
            批量导入
            <!-- <input
              id="inputId"
              ref="inputer"
              v-loading.fullscreen.lock="daoRuLoading"
              element-loading-text="数据正在上传中，请稍等"
              type="file"
              class="download-template"
              size="small"
              placeholder="导入Excel"
              @change="downloadTemplate"
            /> -->
          </el-button>
          <el-button type="success" @click="switchBtn(1)" icon="el-icon-check" v-permission="['basicdata_staffpages_batchstart']">批量启用</el-button>
          <el-button type="danger" @click="switchBtn(0)" icon="el-icon-close" v-permission="['basicdata_staffpages_batchdisable']">批量禁用</el-button>
          <el-button type="warning" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>

      </el-form>
    </template>
    <el-table :data="tableData" style="width: 100%" border size="medium" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
      <el-table-column label="序号" prop="id" align="center"  width="100"></el-table-column>
      <el-table-column
        label="系统员工编码"
        prop="system_code"
        width="200"
        align="center"
      ></el-table-column>
      <el-table-column label="员工编码" prop="code" align="center" width="150"></el-table-column>
      <el-table-column
        label="合作方员工编码"
        prop="partner_code"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column label="员工姓名" prop="fullname" align="center" width="150"></el-table-column>
      <el-table-column label="手机号码" prop="mobile" align="center" width="150"></el-table-column>
      <el-table-column label="身份证号码" prop="identity" width="200" align="center"></el-table-column>
      <el-table-column label="项目来源码" prop="project_code" width="200" align="center"></el-table-column>
      <el-table-column label="场景门店代码" prop="store_code" width="200" align="center"></el-table-column>
      <el-table-column label="场景子门店代码" prop="store_child_code" width="200" align="center"></el-table-column>
      <el-table-column label="操作人" prop="operationname" width="150" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="created" width="200" align="center"></el-table-column>
      <el-table-column label="状态" align="center" width="100" v-if="hasEditPermission">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeState(scope.row.id, scope.row.status)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="warning" @click="edit(scope.row)" size="small" v-permission="['basicdata_staffpages_edit']"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="ui-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 50, 100, 500, 5000,10000,50000]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dptotal"
      ></el-pagination>
    </div>

      <el-dialog
      title="批量导入"
      :visible.sync="ImportVisible"
      width="60%"
      :before-close="ImportClose"
    >
      <el-form
        ref="importform"
        :model="importform"
        label-width="150px"
        :rules="rulesimport"
        :validate-on-rule-change="false"
      >
      <div class="importdivred">
        <p>注意事项:</p>
        <p>1、请模板中的员工信息对应同一个项目来源码</p>
        <p>2、一次最多导入2000条</p>
        <p> <el-button type="primary" size="small"   style="position:absolute;top:50px;right:50px;">
           <a :href="staffDownexcelHttp" style="width: 100%;height: 100%;top: 0px; position: absolute;left: 0px;"></a>下载模板</el-button>
        </p>
         
      </div>
        <el-form-item label="项目来源码：" prop="project_id">
          <el-select v-model="importform.project_id" style="width: 100%">
            <el-option
              v-for="(item, index) in staffProjectlistData"
              :label="item.code"
              :value="item.id"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="导入文件：" prop="fileprops">
          <el-button type="primary" style="position: relative" >
            选择文件
            <input
              id="inputId"
              ref="inputer"
              v-loading.fullscreen.lock="daoRuLoading"
              element-loading-text="数据正在上传中，请稍等"
              type="file"
              class="download-template"
              size="small"
              placeholder="导入Excel"
              @change="downloadTemplate"
            />
            
          </el-button>
           <!-- <input
              id="inputId"
              ref="inputer"
              v-loading.fullscreen.lock="daoRuLoading"
              element-loading-text="数据正在上传中，请稍等"
              type="file"
              class="download-template"
              size="small"
              placeholder="导入Excel"
              @change="downloadTemplate"
            /> -->
            <span style="margin-left:20px">
               <span v-if="fileNamess">{{fileNamess}}</span>
               <span v-if="!fileNamess">未选择任何文件</span>
            </span>
            
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onImportSubmit"   v-loading.fullscreen.lock="importLoading">确定</el-button>
          <el-button @click="ImportClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="addTitle"
      :visible.sync="addStoreVisible"
      width="60%"
      :before-close="addStoreClose"
    >
      <el-form
        ref="addform"
        :model="ADDform"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="员工姓名：" prop="fullname">
          <el-input v-model="ADDform.fullname" :maxlength="18" :minlength="2"></el-input>
        </el-form-item>
        <el-form-item label="手机号码："  prop="mobile">
          <el-input v-model="ADDform.mobile" type="number" oninput="if(value.length>11)value=value.slice(0,11)" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" prop="identity">
          <el-input v-model="ADDform.identity" ></el-input>
        </el-form-item>
        <el-form-item label="员工编码：" prop="code">
          <el-input v-model="ADDform.code" maxlength="6"></el-input>
        </el-form-item>
        <el-form-item label="合作方员工编码：" prop="partner_code">
          <el-input v-model="ADDform.partner_code" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="项目来源码：" prop="project_id">
          <el-select v-model="ADDform.project_id" style="width: 100%">
            <el-option
              v-for="(item, index) in staffProjectlistData"
              :label="item.name"
              :value="item.id"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景门店：" prop="store_id">
          <el-select v-model="ADDform.store_id" style="width: 100%" @change="storeChange(ADDform.store_id)">
            <el-option
              v-for="(item, index) in staffStorelistData"
              :label="item.name"
              :value="item.id"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景子门店：" prop="store_child_id">
          <el-select v-model="ADDform.store_child_id" style="width: 100%">
            <el-option
              v-for="(item, index) in staffChildStorelistData"
              :label="item.name"
              :value="item.id"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddSubmit">确定</el-button>
          <el-button @click="addStoreClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </d2-container>
</template>

<script>
import xlsx from "xlsx";
import axios from 'axios'
import { aes_encryptObject } from '@/api/tools'
import {
  staffListFun,
  stafStatusFun,
  staffEditFun,
  staffImportFun,
} from "@api/modules/sys.user.js";
export default {
  name: "basicdataProjectSettings",
  data() {
    return {
      formInline: {
        fullname: "",
        status: "",
        code: "",
        partner_code: "",
        project_code: "",
        system_code: "",
        mobile: "",
      },
      addStoreVisible: false,
      tableData: [],
      table: {
        columns: [],
        data: [],
        size: "mini",
        stripe: true,
        border: true,
      },
      importform:{
        project_id:'',
        fileprops:'',

      },
      addTitle:'',
      ADDform: {
        id:'',
        fullname: "",
        mobile: "",
        identity: "",
        code:'',
        partner_code: "",
        project_id:'',
        store_id:'',
        store_child_id: ''
      },
      ADDformTwo: {
        fullname: "",
        mobile: "",
        identity: "",
        code:'',
        partner_code: "",
        project_id:'',
        store_id:'',
        store_child_id: ''
      },
      rulesimport:{
         project_id: [
          { required: true, message: "请选择项目来源码", trigger: "blur" },
        ],
         fileprops: [
          { required: true, message: "请选择文件", trigger: "blur" },
        ],
      },
      rulesBian: {
      },
      rules:{
        fullname: [
          { required: true, message: "请输入员工姓名", trigger:"blur"  },
          ///^[\u4e00-\u9fa5]+$/
           { validator:function(rule,value,callback){
                            if(/^[\u4e00-\u9fa5]+$/.test(value) == false){
                                   callback(new Error("请输入正确的员工姓名,只能是中文，2-18位"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                },
        ],
        mobile: [
          { required: true, message: "请输入手机号码",trigger: "blur"},
          // { validator:function(rule,value,callback){
          //                   if(/^[1][3,4,5,7,8][0-9]{9}$/.test(value) == false){
          //                          callback(new Error("请输入正确的手机号码"));
          //                   }else{
          //                          callback();
          //                   }
          //                 }, trigger: 'blur'
          //       },
        ],
        identity: [
          { required: true, message: "请输入身份证号码",trigger: "blur"  },
           { validator:function(rule,value,callback){
                            if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value) == false){
                                   callback(new Error("请输入正确的身份证号码"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                },
        ],
        code: [
          { required: true, message: "请输入员工编码", trigger: "blur"  },
            { validator:function(rule,value,callback){
                            if(/^[0-9a-zA-Z]+$/.test(value) == false || value.length != 6){
                                   callback(new Error("员工编码只能是6位，数字或者数字字母组合"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                },
        ],
        partner_code: [
          { required: true, message: "请输入合作方员工编码", trigger: "blur" },
           { validator:function(rule,value,callback){
                            if(/^[0-9a-zA-Z]+$/.test(value) == false || value.length < 6){
                                   callback(new Error("合作方员工编码6-50位，数字或者数字字母组合"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                },
        ],
        project_id: [
          { required: true, message: "请选择项目来源码", trigger: "blur"  },
        ],
        store_id: [
          { required: true, message: "请选择场景门店代码", trigger: "blur" },
        ],
        store_child_id: [
          { required: true, message: "请选择场景子门店代码", trigger: "blur" },
        ],
      },
      dptotal: 1,
      limit: 10,
      page: 1,
      staffProjectlistData: [],
      staffStorelistData: [],
      staffChildStorelistData: [],
      actionHttp:'',
      daoRuLoading:false,
      ImportVisible:false,
      fileNamess:"",
      importLoading:false,
      loadingDownexcel:false,
      loadingDownexcelText:'',
      staffDownexcelHttp: process.env.VUE_APP_API + this.$configApi.staffDownexcel,
      selectIds: '',
      checklist: [],
      fileById:'',
      hasDataPermission: this.hasPermissions(["basicdata_staffpages_data"]),
      hasEditPermission: this.hasPermissions(["basicdata_staffpages_edit"])
    };
  },
  created() {
    if (this.hasDataPermission) {
      this.getstaffListFun();
    } else {
      this.$message.info('您还没有该数据权限');
      return
    }
    this.actionHttp = process.env.VUE_APP_API + this.$configApi.staffImport

  },
  methods: {
    exportExcel() {
      const columns = [
         {
          label: '序号',
          prop: 'id',
        },
        {
          label: '系统员工编码',
          prop: 'system_code',
        },
        {
          label: '员工编码',
          prop: 'code',
        },
        {
          label: '合作方员工编码',
          prop: 'partner_code',
        },
        {
          label: '员工姓名',
          prop: 'fullname',
        },
        {
          label: '手机号码',
          prop: 'mobile',
        },
        {
          label: '身份证号码',
          prop: 'identity',
        },
            {
          label: '项目来源码',
          prop: 'project_code',
        },
         {
          label: '场景门店代码',
          prop: 'store_code',
        },
        {
          label: '场景子门店代码',
          prop: 'store_child_code',
        },
        {
          label: '操作人',
          prop: 'operationname',
        },
        {
          label: '创建时间',
          prop: 'created',
        },
        {
          label: '状态',
          prop: 'status',
        }
      ]
      let data = this.tableData
      if(data.length === 0){
          this.$message.info('没有可导出的数据！！！');
          return
      }else{
        data.map((item,index) => {
         return ( 
           item.channel = item.channel == '1'?'人工':item.channel == '2'?'自助':'人工/自助',
           item.status = item.status == '1' ? '开启':'关闭'
         )
        })
      }
      let aa = '员工管理'+dateFmt(new Date(), "yyyyMMdd")
      this.$export.csv({
        columns,
        data,
        title: aa,
      })
    },
    importHandle(){
      this.ImportVisible = true;
      if( this.$refs.inputer && this.$refs.inputer.value ){
          this.$refs.inputer.value = ''
      }
      this.getstaffProjectlistData()
    },
    ImportClose(){
       this.importform = {
                      project_id:'',
                      fileprops:'',
                    }
      this.ImportVisible = false;
      this.$refs.importform.resetFields();
      this.fileNamess =''
    },
    getstaffListFun(data) {
      if (data) {
        let newdata = { ...data, limit: this.limit, page: this.page }
        this.$http
          .get(this.$configApi.staffList, {
            params: aes_encryptObject(newdata),
          })
          .then((res) => {
            if (res.code === "0") {
              this.tableData = res.data;
              this.dptotal = res.count;
            }
          });
      } else {
        this.$http
          .get(this.$configApi.staffList, {
            params: aes_encryptObject({ limit: this.limit, page: this.page }),
          })
          .then((res) => {
            if (res.code === "0") {
              this.tableData = res.data;
              this.dptotal = res.count;
            }
          });
      }
    },
    getstaffStorelistData() {
      this.$http.get(this.$configApi.staffStorelist).then((res) => {
        if (res.code === "0") {
          this.staffStorelistData = res.data;
        }
      });
    },
    storeChange(value) {
      this.staffChildStorelistData = '';
      this.ADDform.store_child_id = '';
      this.$http.get(this.$configApi.staffChildStorelist,{params: aes_encryptObject({ store_id: value })}).then((res) => {
        if (res.code === "0") {
          this.staffChildStorelistData = res.data;
        }
      });
    },
    getstaffProjectlistData() {
      this.$http.get(this.$configApi.staffProjectlist).then((res) => {
        if (res.code === "0") {
          this.staffProjectlistData = res.data;
        }
      });
    },
    serch() {
      this.getstaffListFun(this.formInline);
    },
    // 多选
    handleSelectionChange(val){
      this.selectIds = '';
      this.checklist = [];
      this.selectIds = val.map(item => item.id).join(',');
      this.checklist = val.map(item => item.status);
    },
    // 批量启用
    async switchBtn(status){
        const text = ['禁用', '启用'];
        const text1 = ['启用','禁用'];
        if (this.checklist.indexOf(status) >= 0) {
          this.$message({
            type: 'info',
            message: `请选择${text1[status]}状态数据~`
          });
          return
        }
        if (this.checklist.length == 0) {
          this.$message({
            type: 'info',
            message: `请先选择${text1[status]}状态数据~`
          });
          return
        }
        this.$confirm(`是否批量${text[status]}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          stafStatusFun({id: this.selectIds, status: status}).then((res => {
            if (res.code === "0") {
              this.getstaffListFun({ ...this.formInline});
              this.$message({
                type: 'success',
                message: `批量${text[status]}成功!`
              });
            }
          }))        
        }).catch(() => {
          this.$message({
            type: 'info',
            message: `已取消批量${text[status]}`
          });
        });
    },
    add() {
      this.staffChildStorelistData = '';
      this.addStoreVisible = true;
       this.getstaffProjectlistData()
       this.getstaffStorelistData();
       this.addTitle = '添加员工'
    
      this.ADDform = { ...this.ADDformTwo };
    },
    addStoreClose() {
      this.addStoreVisible = false;
      this.$refs.addform.resetFields();

    },
    edit(row) {
      this.getstaffStorelistData();
      this.getstaffProjectlistData();
      this.addStoreVisible = true;
      this.ADDform = {...row};
       this.addTitle = '修改员工'
    },
    //导入文件
     downloadTemplate(){
      this.daoRuLoading=true
      let file = document.getElementById('inputId').files[0]
      this.fileById = file
      console.log(file)
      if(!file){
        this.daoRuLoading= false
        return
      }
      let formData = new FormData()
      formData.append('file', file)
      let fileName = file.name
    
      let pos = fileName.lastIndexOf('.')
      let lastName = fileName.substring(pos, fileName.length)
      if (
        (lastName.toLowerCase() !== '.xlsx' && lastName.toLowerCase() !== '.XLSX') &&  (lastName.toLowerCase() !== '.csv' &&lastName.toLowerCase() !== '.CSV') 
      ) {
        this.daoRuLoading=false
        this.$message({
          message: '请上传正确的文件类型',
          type: 'warning'
        })
        return
      }else{
        this.$refs.inputer.value=null;
        setTimeout(()=>{ 
          this.daoRuLoading= false
          this.importform.fileprops = fileName
          this.fileNamess = fileName
            this.$message({
              message: '选择上传文件成功',
              type: 'success'
            })
        }, 100);
      }
    },
    getImportfile(){
      this.importLoading = true
       let file = this.fileById
      let formData = new FormData()
      console.log(file)
      formData.append('file', file)
      formData.append('project_id', this.importform.project_id)
       let url=process.env.VUE_APP_API+ this.$configApi.staffImport
      let config = {
        headers: { //添加请求头
          'Content-Type': 'multipart/form-data',
          'Authorization':sessionStorage.getItem('token')
        }
      }
      axios.post(url, formData, config).then(res => {
        if (res.data.code == 0) {
          this.getstaffListFun()
          this.importLoading=false
          this.ImportClose()
            this.$message({
            message: res.data.msg,
            type: 'success'
          })
        
        }else{
          this.importLoading=false
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
           if (res.data.code === '20_00_1_00006') {
             this.$router.replace({
                name: "login"
              });
          }
        }
      }).catch(err => {
        this.importLoading = false
        this.$message({
            message: '数据格式有问题！！！',
            type: 'warning'
          })
        console.log('数据请求问题，，，，',err)
      });

    },
    onImportSubmit(){
       this.$refs.importform.validate((valid) => {
          if (valid) {
              this.getImportfile()
          } else {
            console.log('error submit!!');
            return false;
          }
        });

    },
     onAddSubmit() {
         this.$refs.addform.validate((valid) => {
          if (valid) {
            this.getstaffEditFun()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    async getstaffEditFun(){
        await staffEditFun(this.ADDform).then((res) => {
              if (res.code === "0") {
                this.getstaffListFun();
                this.$message.success(res.msg);
                this.addStoreVisible = false;
              }
      });
    },
    async changeState(id, status) {
        await stafStatusFun({ id: id, status: status }).then((res) => {
          if (res.code === "0") {
            this.getstaffListFun({ limit: this.limit });
            this.$message.success(res.msg);
          }else{
            //  this.$message.error(res.msg);
          }
        });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getstaffListFun({...this.formInline});
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getstaffListFun({ ...this.formInline});
    },
  },
};
</script>
<style scoped lang="scss">
.eluploadclass {
  display: inline-block;
  margin-left: 18px;
}
#inputId {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
.importdivred{
  color:red;

}
.demo-table-expand {
  font-size: 0;
  }
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 30%;
}
.demo-form-inline .el-form-item{
  margin-left: 20px;
}
</style>