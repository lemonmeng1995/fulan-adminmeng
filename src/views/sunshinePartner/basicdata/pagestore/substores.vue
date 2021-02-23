<template>
  <d2-container>
    <template>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="子门店名称：" prop="name">
          <el-input v-model="formInline.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="子门店代码：" prop="code">
          <el-input v-model="formInline.code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商户号：" prop="merchant_code">
              <el-input v-model="formInline.merchant_code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="通道：" prop="channel">
          <el-select v-model="formInline.channel">
            <el-option label="全部" value=""></el-option>
            <el-option label="人工" value="1"></el-option>
            <el-option label="自助" value="2"></el-option>
            <el-option label="人工/自助" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省/市/区县：" prop="city">
          <el-cascader
             style="width: 300px;"
              v-model="formInline.city"
              ref='cascaderAddr'
              :options="store_cityData"
              :props="{ expandTrigger: 'hover' }"
              clearable
              @change="handleChangecity">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="serch" icon="el-icon-search" v-permission="['basicdata_pagestore_substores_search']">查询</el-button>
          <el-button type="warning" @click="importHandle" icon="el-icon-upload" v-permission="['basicdata_pagestore_substores_import']">批量导入</el-button>
          <el-button type="primary" @click="add" icon="el-icon-circle-plus-outline" v-permission="['basicdata_pagestore_substores_add']">新建场景子门店</el-button>
          <el-button type="success" @click="switchBtn(1)" icon="el-icon-check" v-permission="['basicdata_pagestore_substores_stop']">批量启用</el-button>
          <el-button type="danger" @click="switchBtn(0)" icon="el-icon-close" v-permission="['basicdata_pagestore_substores_stop']">批量禁用</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tableData" style="width: 100%" border size="medium"  @selection-change="handleSelectionChange">
      <el-table-column fixed="left" align="center" type="selection" width="55"></el-table-column>
      <el-table-column label="序号" align="center" prop="id"  width="90"></el-table-column>
      <el-table-column label="子门店代码" prop="code" align="center"  width="120"></el-table-column>
      <el-table-column label="子门店ID" prop="store_child_id" align="center"  width="120"></el-table-column>
      <el-table-column label="子门店名称" prop="name" align="center"  width="120"></el-table-column>
      <el-table-column label="商户号" prop="merchant_code" align="center"  width="120"></el-table-column>
      <el-table-column label="通道" prop="channel" align="center"  width="120">
         <template slot-scope="scope">
            <span v-if='scope.row.channel == "1"'>人工</span>
            <span v-if='scope.row.channel == "2"'>自助</span>
            <span v-if='scope.row.channel == "3"'>人工/自助</span>
        </template>
      </el-table-column>
      <el-table-column label="省" prop="province" align="center"  width="90"></el-table-column>
      <el-table-column label="市" prop="city" align="center"  width="90"></el-table-column>
      <el-table-column label="区" prop="area" align="center"  width="90"></el-table-column>
      <el-table-column label="区域" prop="region" align="center"  width="120"></el-table-column>
      <el-table-column label="详细地址" prop="address" align="center"  width="150"></el-table-column>
      <el-table-column label="状态" align="center"  width="150" v-if="hasEditPermission">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeState(scope.row.id, scope.row.status)"
          ></el-switch>
        </template>
      </el-table-column>
       <el-table-column label="操作人" prop="operator" align="center"  width="200"></el-table-column>
         <el-table-column label="操作时间" prop="updated_at" align="center"  width="200"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center"  width="120">
        <template slot-scope="scope">
          <el-button type="warning" @click="edit(scope.row)" size="small" v-permission="['basicdata_pagestore_substores_edit']"
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
        <p> <el-button type="primary" size="small"   style="position:absolute;top:50px;right:50px;">
           <a :href="StorechildDownexcelHttp" style="width: 100%;height: 100%;top: 0px; position: absolute;left: 0px;"></a>下载模板</el-button>
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

    <el-dialog
      :title="addTitle"
      :visible.sync="addStoreVisible"
      width="50%"
      :before-close="addStoreClose"
    >
      <el-form
        ref="addform"
        :model="ADDform"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="子门店代码：" prop="code">
          <el-input v-model="ADDform.code" :disabled="disabled"   style="width:70%;"></el-input>
        </el-form-item>
         <el-form-item label="子门店ID：" prop="store_child_id">
          <el-input v-model="ADDform.store_child_id"   style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="子门店名称：" prop="name">
          <el-input v-model="ADDform.name"   style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="商户号：" prop="merchant_code">
          <el-input v-model="ADDform.merchant_code"   style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="通道：" prop="channel">
             <el-select v-model="ADDform.channel"   style="width:70%;">
                <el-option label="人工" value="1"></el-option>
                <el-option label="自助" value="2"></el-option>
                <el-option label="人工/自助" value="3"></el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="省/市/区县：" prop="pca_arr">
            <el-cascader
               style="width:70%;"
                v-model="ADDform.pca_arr"
                :options="store_cityData"
                ref='cascaderAddr'
           
                clearable
                :props="{ expandTrigger: 'hover' }"
                @change="handleChangecity">
            </el-cascader>
        </el-form-item>
          <el-form-item label="区域：" prop="region">
          <el-input v-model="ADDform.region"   style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="address">
          <el-input v-model="ADDform.address"   style="width:70%;"></el-input>
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
import { mapState, mapActions } from "vuex";
import { aes_encryptObject } from '@/api/tools'
import { StorechildAddModifyFun,StorechildChangeStatusFun} from "@api/modules/sys.user.js";
import axios from 'axios'
export default {
  name: "basicdataSubstores",
  data() {
    return {
      substores_id:'',//带过来的门店id
      store_cityData:[], //省市区
      StorechildDownexcelHttp: process.env.VUE_APP_API + this.$configApi.StorechildTemplate,//模板下载的接口
      importLoading:false,//文件上传的loading
      ImportVisible:false,//批量导入的弹窗
      fileNamess:'',//导入的文件名
      daoRuLoading:false,
      fileById:'',//缓存的文件
      selectIds: '',//选择的id的字符串多个
      checklist: [],
      importform:{             //文件上传的form
        fileprops:'',
      },
      formInline: {
        code: "",
        name: "",
        status: "",
        merchant_code:'',
        channel:'',
        province:'',
        city:"",
        area:'',
      },
      cityComs:{}, //暂存的省市区
      ADDform: {
        id:'',
        store_id: "",
        name: "",
        code: "",
        merchant_code:'',
        channel:'',
        pca_arr:'',//暂存的数组
        region:'',
        address:'',
        store_child_id:'',
      },
      disabled: false,
      rulesimport:{
         fileprops: [
          { required: true, message: "请选择文件", trigger: "blur" },
        ],
      },
      rules: {
        code: [{ required: true, message: "请输入子门店代码", trigger: "blur" },
         { validator:function(rule,value,callback){
                            if(value.length > 50){
                                   callback(new Error("子门店代码不能超过50个字符！"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                }],
        name: [{ required: true, message: "请输入子门店名称", trigger: "blur" },
        { validator:function(rule,value,callback){
                            if(value.length > 50){
                                   callback(new Error("子门店名称不能超过50个字符！"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                }],
        store_child_id: [{ required: true, message: "请输入子门店ID", trigger: "blur" }],
        merchant_code: [{ required: true, message: "请输入商户号", trigger: "blur" },
         { validator:function(rule,value,callback){
                            if(/^[0-9a-zA-Z]+$/.test(value) == false || value.length > 50){
                                   callback(new Error("商户号只能是纯数字并且不能超过50位！"));
                            }else{
                                   callback();
                            }
                          }, trigger: 'blur'
                }],
        channel: [{ required: true, message: "请选择通道", trigger: "blur" }],
        pca_arr: [{ required: true, message: "请选择省/市/区县", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      addStoreVisible: false,
      dptotal: 1,
      limit: 10,
      page: 1,
      tableData: [],
      addTitle: "",
      hasDataPermission: this.hasPermissions(["basicdata_pagestore_substores_data"]),
      hasEditPermission: this.hasPermissions(["basicdata_pagestore_substores_edit"])
    };
  },
  created() {
    this.id = sessionStorage.getItem('substores_id')
    let rqs = aes_encryptObject({Authorization:sessionStorage.getItem('token')})
    console.log("一进来，，id",   this.id,process.env.VUE_APP_API + this.$configApi.StorechildTemplate,
   
    process.env.VUE_APP_API + this.$configApi.StorechildTemplate +'?'+rqs,
    sessionStorage.getItem('token'));

    if (this.hasDataPermission) {
      this.getData();
      this.getCityDataFun()
    } else {
      this.$message.info('您还没有该数据权限');
      return
    }
  },
  computed: {
    ...mapState('d2admin/user', ['cityData'])
  },
  methods: {
     ...mapActions('d2admin/user', ['getCityData']),
      async getCityDataFun() {
        if(this.cityData.length === 0 ||  this.store_cityData.length === 0){
            await this.getCityData()
            this.store_cityData = this.cityData
        }else{
            this.store_cityData = this.cityData
        }    
        console.log("this.store_cityData", this.store_cityData)
      },
    async getData(data) {
      if (data) {
        if(data.city.length == 0) data.city = ""
        this.$http
          .get(this.$configApi.StoreChildList, {
            params: aes_encryptObject({ ...data, limit: this.limit, page: this.page,id:this.id  }),
          }).then((res) => {
            if (res.code === "0") {
              this.tableData = res.data;
              this.dptotal = res.count;
            }
          });
      } else {
        this.$http.get(this.$configApi.StoreChildList, {
            params: aes_encryptObject({ limit: this.limit, page: this.page,id:this.id }),
          }).then((res) => {
            if (res.code === "0") {
              this.tableData = res.data;
              this.dptotal = res.count;
            }
          });
      }
    },
      // 批量启用
    async switchBtn(status){
        const text = ['禁用','启用'];
        const text1 = ['启用','禁用'];
        console.log(" 批量启用,",status)
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
          StorechildChangeStatusFun({id: this.selectIds, status: status}).then((res => {
            if (res.code === "0") {
               let newDobj = {
                  ...this.formInline,
                  ...this.cityComs
                }
              this.getData(newDobj);
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
    importHandle(){
      this.ImportVisible = true;
      if( this.$refs.inputer && this.$refs.inputer.value ){
          this.$refs.inputer.value = ''
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
      formData.append('store_id', this.id)
      let url=process.env.VUE_APP_API+ this.$configApi.StorechildImport
      let config = {
        headers: { //添加请求头
          'Content-Type': 'multipart/form-data',
          'Authorization':sessionStorage.getItem('token')
        }
      }
      axios.post(url, formData, config).then(res => {
        if (res.data.code == 0) {
          this.getData()
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
      if(!file){
        this.daoRuLoading= false
        return
      }
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
    exportExcel() {
      const columns = [
        {
          label: '序号',
          prop: 'id',
        },
        {
          label: '子门店代码',
          prop: 'code',
        },
         {
          label: '子门店ID',
          prop: 'store_child_id',
        },
        {
          label: '子门店名称',
          prop: 'name',
        },
        {
          label: '商户号',
          prop: 'merchant_code',
        },
        {
          label: '通道',
          prop: 'channel',
        },
            {
          label: '省',
          prop: 'province',
        },
         {
          label: '市',
          prop: 'city',
        },
        {
          label: '区',
          prop: 'area',
        },
        {
          label: '区域',
          prop: 'region',
        },
        {
          label: '详细地址',
          prop: 'address',
        },
        {
          label: '状态',
          prop: 'status',
        },
          {
          label: '操作人',
          prop: 'operator',
        },
        {
          label: '操作时间',
          prop: 'updated_at',
        },
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
     let aa = '子门店管理'+dateFmt(new Date(), "yyyyMMdd")
      this.$export.csv({
        columns,
        data,
        title: aa,
      })
    },
    serch() {
      let newDobj = {
        ...this.formInline,
        ...this.cityComs
      }
      this.page = 1
      this.getData(newDobj);
    },
    handleChangecity(value){
      this.cityComs = {}
      let nodesObj =this.$refs['cascaderAddr'].getCheckedNodes()[0]? this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels :[]
      console.log("123选择城市，",nodesObj,value,this.$refs['cascaderAddr'].getCheckedNodes()[0])
      let newObj = {}
      newObj.province = nodesObj.length>0? nodesObj[0]:''
      newObj.city =  nodesObj.length>0?nodesObj[1]:''
      newObj.area =  nodesObj.length>0? nodesObj[2]:''
      this.cityComs  = newObj
    },
    handleSelectionChange(val){
      this.selectIds = '';
      this.checklist = [];
      this.selectIds = val.map(item => item.id).join(',');
      this.checklist = val.map(item => item.status);
    },
    add() {
      this.disabled = false;
      this.addStoreVisible = true;
      this.cityComs = {}
      this.ADDform = {
        id:'',
        store_id: "",
        name: "",
        code: "",
        merchant_code:'',
        channel:'',
        pca_arr:[],
        region:'',
        address:'',
        store_child_id:'',
      }
      this.addTitle = "添加子门店";
    },
    addStoreClose() {
      this.addStoreVisible = false;
      this.$refs.addform.resetFields();
    },
    edit(row) {
      this.disabled = true;
      this.addStoreVisible = true;
      let isFlag;   //判断省市区是否对的上
      if(row.pca_arr.length > 0){
        let rowPca_arr = row.pca_arr
        isFlag = rowPca_arr.some((a)=> a == '0' )
      }
      this.ADDform = {
        id:row.id,
        store_id: row.store_id,
        name: row.name,
        code: row.code,
        merchant_code:row.merchant_code,
        channel:row.channel,
        pca_arr:isFlag?[] : row.pca_arr,
        region:row.region,
        address:row.address,
        store_child_id:row.store_child_id,
        province:row.province,
        city:row.city,
        area:row.area,
      }
      if(!isFlag){
         this.cityComs={
          province:row.province,
          city:row.city,
          area:row.area,
        }
      }
      this.addTitle = "修改门店";
    },
    async changeState(id, status) {
      await StorechildChangeStatusFun({ id: id, status: status }).then((res) => {
        if (res.code === "0") {
          this.getData({ limit: this.limit });
          this.$message.success(res.msg);
        } else {
          this.getData({ limit: this.limit });
        }
      });
    },
    onAddSubmit() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          this.getstoreEditFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getstoreEditFun() {
      let newADDform = {...this.ADDform,store_id:this.id,...this.cityComs}
      await StorechildAddModifyFun(newADDform).then((res) => {
        if (res.code === "0") {
          this.getData();
          this.$message.success(res.msg);
          this.addStoreVisible = false;
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData({  ...this.formInline });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData({  ...this.formInline });
    },
  },
};
</script>
<style scoped lang="scss">
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