<template>
  <d2-container>
    <template>
      <el-form
        :inline="true"
        :model="formData"
        ref="formData"
        class="demo-form-inline"
      >
        <el-form-item label="项目来源码：">
          <el-input
            v-model="formData.project_code"
            placeholder=""
            maxlength="50"
          ></el-input
        ></el-form-item>
        <el-form-item label="存档号：">
          <el-input
            v-model="formData.archive_number"
            placeholder=""
            maxlength="50"
          ></el-input
        ></el-form-item>
        <el-form-item label="申请日期：">
          <el-date-picker
            v-model="formData.apply_date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker
        ></el-form-item>
        <el-form-item label="首刷日期：">
          <el-date-picker
            v-model="formData.first_brush_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker
        ></el-form-item>
        <el-form-item label="导入日期：">
          <el-date-picker
            v-model="formData.created_at_data"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker
        ></el-form-item>
        <el-form-item>
          <el-button type="success" @click="applyCardList()" icon="el-icon-search" v-permission="['reportData_carddataimport_search']">查询</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="warning" @click="importHandle" icon="el-icon-upload" v-permission="['reportData_carddataimport_import']">导入</el-button>
        </el-form-item>
         <el-form-item>
            <el-button type="primary" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="序号" prop="id" align="center" width="100" ></el-table-column>
      <el-table-column label="导入日期" prop="created" align="center" width="200" ></el-table-column>
      <el-table-column label="项目来源码" prop="project_code" align="center" width="200" ></el-table-column>
      <el-table-column label="存档号" prop="archive_number" align="center" width="150" ></el-table-column>
      <el-table-column
        label="合作方人员编码"
        prop="partner_code"
        align="center"
        width="200" 
      ></el-table-column>
      <el-table-column
        label="极客上门人员编码"
        prop="geek_code"
        align="center"
        width="150" 
      ></el-table-column>
      <el-table-column label="申请日期" prop="apply_date" align="center" width="150" ></el-table-column>
      <el-table-column label="极客状态" prop="geek_status" align="center" width="100" ></el-table-column>
      <el-table-column
        label="审批状态"
        prop="approval_status"
        align="center"
        width="100" 
      ></el-table-column>
      <el-table-column
        label="首刷日期"
        prop="first_brush_date"
        align="center"
        width="150" 
      ></el-table-column>
    </el-table>
    <div class="ui-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100, 500, 5000,10000,50000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
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
        <p> <el-button type="primary" size="small"   style="position:absolute;top:50px;right:50px;">
           <a :href="url" style="width: 100%;height: 100%;top: 0px; position: absolute;left: 0px;"></a>下载模板</el-button>
        </p>
         
      </div>
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
  </d2-container>
  
</template>

<script>
import axios from "axios";
import { dateFmt, aes_encryptObject, getrq } from "@/api/tools";
export default {
  name:'carddataimport',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      url: process.env.VUE_APP_API + this.$configApi.applyCardDownexcel,
      daoRuLoading: false,
      ImportVisible:false,//批量导入的弹窗
      fileNamess:'',//导入的文件名
      importLoading:false,//文件上传的loading
      daoRuLoading:false,
      fileById:'',
      rulesimport:{
         fileprops: [
          { required: true, message: "请选择文件", trigger: "blur" },
        ],
      },
      importform:{             //文件上传的form
        fileprops:'',
      },
      formData: {
        project_code: "",
        archive_number: "",
        apply_date: [
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
        ],
        first_brush_time: [
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
        ],
        created_at_data: [
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
        ],
      },
      tableData: [],
      uploadApi: process.env.VUE_APP_API + this.$configApi.applyCardImport,
      hasDataPermission: this.hasPermissions(["reportData_carddataimport_data"])
    };
  },
  created() {
    if (this.hasDataPermission) {
      this.applyCardList();
    } else {
      this.$message.info('您还没有该数据权限');
      return
    }  
  },
  methods: {
    importHandle(){
      this.ImportVisible = true;
      if( this.$refs.inputer && this.$refs.inputer.value ){
          this.$refs.inputer.value = ''
      }
    },
     ImportClose(){
       this.importform = {
                      fileprops:'',
                    }
      this.ImportVisible = false;
      this.$refs.importform.resetFields();
      this.fileNamess =''
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
    getImportfile(){
      this.importLoading = true
      let file = this.fileById
      let formData = new FormData()
      formData.append('file', file)
      let url= this.uploadApi
      let config = {
        headers: { //添加请求头
          'Content-Type': 'multipart/form-data',
          'Authorization':sessionStorage.getItem('token')
        }
      }
      axios.post(url, formData, config).then(res => {
        if (res.data.code == 0) {
          this.applyCardList();
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
    applyCardList(page = 1, is_expotr = 0) {
      this.currentPage = page;
      let myData = aes_encryptObject({   
        project_code: this.formData.project_code,
        archive_number: this.formData.archive_number,
        apply_begin_date: this.formData.apply_date
          ? this.formData.apply_date[0]
          : "",
        apply_end_date: this.formData.apply_date
          ? this.formData.apply_date[1]
          : "",
        first_brush_begin_time: this.formData.first_brush_time
          ? this.formData.first_brush_time[0]
          : "",
        first_brush_end_time: this.formData.first_brush_time
          ? this.formData.first_brush_time[1]
          : "",
        created_at_begin: this.formData.created_at_data
          ? this.formData.created_at_data[0]
          : "",
        created_at_end: this.formData.created_at_data
          ? this.formData.created_at_data[1]
          : "",
        limit: this.pageSize,
        page: page,
        export: is_expotr,
      })
      this.$http
        .get(this.$configApi.applyCardList, {params: myData})
        .then((res) => {
          if (res.code == 0) {
            this.total = res.count;
            this.tableData = res.data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    exportExcel() {
      const columns = [
        {
          label: "序号",
          prop: "id",
        },
        {
          label: "导入日期",
          prop: "created",
        },
        {
          label: "项目来源码",
          prop: "project_code",
        },
        {
          label: "存档号",
          prop: "archive_number",
        },
        {
          label: "合作方人员编码",
          prop: "partner_code",
        },
        {
          label: "极客上门人员编码",
          prop: "geek_code",
        },
        {
          label: "申请日期",
          prop: "apply_date",
        },
        { label: "极客状态", prop: "geek_status" },
        {
          label: "审批状态",
          prop: "approval_status",
        },
        {
          label: "首刷日期",
          prop: "first_brush_date",
        },
      ];
      let data = this.tableData
      if(data.length === 0){
          this.$message.info('没有可导出的数据！！！');
          return
      }
      let aa = 'BK'+dateFmt(new Date(), "yyyyMMdd")
      this.$export.csv({
        columns,
        data,
        title: aa,
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.applyCardList();
    },
    handleCurrentChange(val) {
      this.applyCardList(val);
    },
  },
};
</script>

<style lang="scss" scoped>
#inputId {
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
.demo-form-inline .el-form-item{
  margin-left: 20px;
}
</style>