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
        <el-form-item label="手机号：">
          <el-input v-model="formData.mobile" placeholder=""></el-input
        ></el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="formData.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getExamineList()" icon="el-icon-search" v-permission="['reportData_cardrewardreview_search']">查询</el-button>
          <el-button type="primary" @click="Examine" icon="el-icon-s-opportunity" v-permission="['reportData_cardrewardreview_batchaudit']">批量审核</el-button>
          <el-button type="warning" @click="exportExcel" icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-form>    
    </template>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left"> </el-table-column>
      <el-table-column label="序号" prop="id" align="center"  width="100"></el-table-column>
      <el-table-column label="审核状态" align="center"  width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0" style="color: #f56c6c"
            ><i class="el-icon-error"></i>未审核</span
          >
          <span style="color: #67c23a" v-else
            ><i class="el-icon-success"></i>已审核</span
          >
        </template>
      </el-table-column>
      <el-table-column label="项目来源码" prop="project_code" align="center"  width="200"></el-table-column>
      <el-table-column label="存档号" prop="archive_number" align="center"  width="150"></el-table-column>
      <el-table-column
        label="合作方人员编码"
        prop="partner_code"
        align="center"
        width="200"
      ></el-table-column>
      <el-table-column label="门店代码" prop="store_code" align="center" width="150"></el-table-column>
      <el-table-column label="门店名称" prop="store_name" align="center" width="150"></el-table-column>
        <el-table-column label="子门店代码" prop="store_child_code" align="center" width="150"></el-table-column>
      <el-table-column label="子门店名称" prop="store_child_name" align="center" width="150"></el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" width="150"></el-table-column>
      <el-table-column
        label="首刷日期"
        prop="first_brush_date"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column label="办卡奖励/元" align="center" width="150">
        <template slot-scope="scope">
          <span style="color: #67c23a">{{ scope.row.real_award_fee }}</span>
        </template>
      </el-table-column>
       <el-table-column label="商户管理费/元" align="center" width="150">
        <template slot-scope="scope">
          <span style="color: #67c23a">{{ scope.row.merchant_manage_fee}}</span>
        </template>
      </el-table-column>
       <el-table-column label="商户总业绩/元" align="center" width="150">
        <template slot-scope="scope">
          <span style="color: #67c23a">{{ scope.row.merchant_total_achievement}}</span>
        </template>
      </el-table-column>
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
  </d2-container>
</template>

<script>
import { dateFmt, aes_encryptObject, getrq } from "@/api/tools";
export default {
  name: "cardrewardreview",
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        project_code: "",
        archive_number: "",
        first_brush_time: [
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
          // `${dateFmt(new Date(), "yyyy-MM-dd")}`,
        ],
        status: "",
        mobile: "",
      },
      ids: [],
      tableData: [],
      options: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "未审核",
          value: 0,
        },
        {
          label: "已审核",
          value: 1,
        },
      ],
      hasDataPermission: this.hasPermissions(["reportData_cardrewardreview_data"])
    };
  },
  mounted() {
    if (this.hasDataPermission) {
      this.getExamineList();
    } else {
      this.$message.info('您还没有该数据权限');
      return
    }   
  },
  methods: {
    getExamineList(page = 1) {
      this.currentPage = page;
      let myData = aes_encryptObject({
        project_code: this.formData.project_code,
        archive_number: this.formData.archive_number,
        first_brush_begin_time: this.formData.first_brush_time
          ? this.formData.first_brush_time[0]
          : "",
        first_brush_end_time: this.formData.first_brush_time
          ? this.formData.first_brush_time[1]
          : "",
        mobile: this.formData.mobile,
        status: this.formData.status,
        limit: this.pageSize,
        page: page,
      })
      this.$http
        .get(this.$configApi.applyCardExamineList, {params: myData})
        .then((res) => {
          if (res.code == 0) {
            this.total = res.count;
            this.tableData = res.data;
          }
        }).catch(e=>{
          console.log(e)
        });
    },
      exportExcel() {
      const columns = [
        {
          label: '序号',
          prop: 'id',
        },
        {
          label: '审核状态',
          prop: 'status',
        },
         {
          label: '项目来源码',
          prop: 'project_code',
        },
        {
          label: '存档号',
          prop: 'archive_number',
        },
        {
          label: '合作方人员编码',
          prop: 'partner_code',
        },
        {
          label: '门店代码',
          prop: 'store_code',
        },
            {
          label: '门店名称',
          prop: 'store_name',
        },
         {
          label: '子门店代码',
          prop: 'store_child_code',
        },
        {
          label: '子门店名称',
          prop: 'store_child_name',
        },
        {
          label: '手机号',
          prop: 'mobile',
        },
        {
          label: '首刷日期',
          prop: 'first_brush_date',
        },
        {
          label: '办卡奖励/元',
          prop: 'real_award_fee',
        },
          {
          label: '商户管理费',
          prop: 'merchant_manage_fee',
        },
        {
          label: '商户总业绩/元',
          prop: 'merchant_total_achievement',
        }
      ]
      let data = this.tableData
      if(data.length === 0){
          this.$message.info('没有可导出的数据！！！');
          return
      }else{
        data.map((item,index) => {
         return ( 
           item.status = item.status == '1' ? '开启':'关闭'
         )
        })
      }
      let aa = '奖励明细审核'+dateFmt(new Date(), "yyyyMMdd")
      this.$export.csv({
        columns,
        data,
        title: aa,
      })
    },
    Examine() {
      if (this.ids.length < 1) {
        this.$message({
          type: "warning",
          message: "请先勾选需要审核的数据",
        });
      } else {
        this.$confirm("请确认是否批量审核", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let idstr = this.ids.join(",");
            let myData = aes_encryptObject({
              ids: idstr,
            })
            this.$http
              .post(this.$configApi.applyCardExamine, myData)
              .then((res) => {
                if (res.code == 0) {
                  this.getExamineList(this.currentPage);
                  this.$message({
                    type: "success",
                    message: res.msg,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch(() => {
          });
      }
    },
    handleSelectionChange(val) {
      this.ids = [];
      val.map((v) => {
        this.ids.push(v.id);
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getExamineList();
    },
    handleCurrentChange(val) {
      this.getExamineList(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.demo-form-inline .el-form-item{
  margin-left: 20px;
}
</style>