<template>
  <d2-container>
    <template >
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="formInline.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="项目来源码：" prop="code">
          <el-input v-model="formInline.code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="formInline.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="serch" icon="el-icon-search" v-permission="['basicdata_projectSettings_search']">查询</el-button>
          <el-button type="primary" @click="add" icon="el-icon-circle-plus-outline" v-permission="['basicdata_projectSettings_add']">新建项目</el-button>
           <el-button type="danger" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tableData" style="width: 100%" border size="medium">
      <el-table-column label="序号" prop="id" align="center" width="100"></el-table-column>
      <el-table-column label="项目来源码" prop="code" align="center" width="200"></el-table-column>
      <el-table-column label="项目名称" prop="name" align="center" width="200"></el-table-column>
      <el-table-column
        label="推广链接"
        prop="popularize_link"
        align="center" width="200"
      ></el-table-column>
      <el-table-column label="操作人" prop="fullname" align="center" width="150"></el-table-column>
      <el-table-column label="创建时间" prop="created" align="center" width="200"></el-table-column>
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
      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="warning" @click="edit(scope.row)" size="small" v-permission="['basicdata_projectSettings_edit']"
            >修改</el-button
          >
          <el-button type="primary" @click="rule(scope.row)" size="small" v-permission="['basicdata_projectSettings_dissules']"
            >分配规则</el-button
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
      :title="addTitle"
      :visible.sync="addStoreVisible"
      width="60%"
      :before-close="addStoreClose"
    >
      <el-form
        ref="addform"
        :model="ADDform"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="项目来源码：" prop="code">
          <el-input v-model="ADDform.code" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="ADDform.name"></el-input>
        </el-form-item>
        <el-form-item label="推广链接：" prop="popularize_link">
          <el-input v-model="ADDform.popularize_link"></el-input>
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
import { projectStatusFun, projectEditFun } from "@api/modules/sys.user.js";
import { aes_encryptObject } from '@/api/tools'
export default {
  name: "basicdataProjectSettings",
  data() {
    return {
      formInline: {
        name: "",
        code: "",
        status: "",
      },
      ADDform: {
        id: "",
        code: "",
        name: "",
        popularize_link: "",
      },
      disabled: false,
      addStoreVisible: false,
      rules: {
        code: [
          { required: true, message: "请输入项目来源码", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        popularize_link: [
          { required: true, message: "请输入推广链接", trigger: "blur" },
          {
            validator: function (rule, value, callback) {
              //                  /^http:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
              if (
                /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(
                  value
                ) == false
              ) {
                callback(new Error("请输入正确的推广链接"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      dptotal: 1,
      limit: 10,
      page: 1,
      addTitle: "",
      hasDataPermission: this.hasPermissions(["basicdata_projectSettings_data"]),
      hasEditPermission: this.hasPermissions(["basicdata_projectSettings_edit"])
    };
  },
  created() {
     if (this.hasDataPermission) {
      this.getData();
    } else {
      this.$message.info('您还没有该数据权限');
      return
    }  
  },
  methods: {
    getData(data) {
      if (data) {
        this.$http
          .get(this.$configApi.projectList, {
            params:aes_encryptObject({ ...data, limit: this.limit, page: this.page }),
          })
          .then((res) => {
            if (res.code === "0") {
              this.tableData = res.data;
              this.dptotal = res.count;
            }
          });
      } else {
        this.$http
          .get(this.$configApi.projectList, {
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
    exportExcel() {
      const columns = [
        {
          label: '序号',
          prop: 'id',
        },
        {
          label: '项目来源码',
          prop: 'code',
        },
        {
          label: '项目名称',
          prop: 'name',
        },
        {
          label: '推广链接',
          prop: 'popularize_link',
        },
        {
          label: '操作人',
          prop: 'fullname',
        },
        {
          label: '创建时间',
          prop: 'created',
        },
        {
          label: '状态',
          prop: 'status',
        },
      ]
      let data = this.tableData
      if(data.length === 0){
          this.$message.info('没有可导出的数据！！！');
          return
      }else{
        data.map((item,index) => {
          return item.status = item.status == '1' ? '开启':'关闭'
        })
      }
      let aa = '项目设置'+dateFmt(new Date(), "yyyyMMdd")
      this.$export.csv({
        columns,
        data,
        title: aa,
      })
    },
    serch() {
      this.getData(this.formInline);
    },
    add() {
      //  this.$router.push("/management/addUserman");
      this.disabled = false;
      this.addStoreVisible = true;
      this.ADDform.id = "";
      this.ADDform.code = "";
      this.ADDform.name = "";
      this.ADDform.popularize_link = "";
      this.addTitle = "添加项目";
    },
    addStoreClose() {
      this.addStoreVisible = false;
      this.$refs.addform.resetFields();
    },
    rule(row){
      sessionStorage.setItem('project_id',row.id)
      this.$router.push({path:"/basicdata/profitdistribution"})
    },
    edit(row) {
      this.disabled = true;
      this.addStoreVisible = true;
      this.ADDform.id = row.id;
      this.ADDform.code = row.code;
      this.ADDform.name = row.name;
      this.ADDform.popularize_link = row.popularize_link;
      this.addTitle = "修改项目";
      //    this.$router.push({path:"/management/addUserman",query:{id:'1'}})
    },
    onAddSubmit() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          this.getprojectEditFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getprojectEditFun() {
      await projectEditFun(this.ADDform).then((res) => {
        if (res.code === "0") {
          this.getData();
          this.$message.success(res.msg);
          this.addStoreVisible = false;
        }
      });
    },
    async changeState(id, status) {
      await projectStatusFun({ id: id, status: status }).then((res) => {
        if (res.code === "0") {
          this.getData({ limit: this.limit });
          this.$message.success(res.msg);
        } else {
          this.getData({ limit: this.limit });
        }
      });
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData({  ...this.formInline});
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData({  ...this.formInline});
    },
  },
};
</script>
<style scoped lang="scss">
.demo-form-inline .el-form-item{
  margin-left: 20px;
}
</style>