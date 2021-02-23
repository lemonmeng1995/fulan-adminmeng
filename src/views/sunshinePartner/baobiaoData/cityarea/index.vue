<template>
  <d2-container>
    <template>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="项目来源码：">
          <el-input
            v-model="formInline.project_code"
            placeholder=""
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="省">
          <el-input
            v-model="formInline.province"
            placeholder=""
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="地市">
          <el-input
            v-model="formInline.city"
            placeholder=""
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="首刷日期：">
          <el-date-picker
            v-model="first_brush_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="serch"
            icon="el-icon-search"
            v-permission="['baobiaoData_cityarea_search']"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="warning"
            @click="exportExcel"
            icon="el-icon-upload"
             v-permission="['baobiaoData_cityarea_export']"
            >导出</el-button
          ></el-form-item
        ></el-form
      >
    </template>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="序号" prop="id" align="center"></el-table-column>
      <el-table-column
        label="项目来源码"
        prop="project_code"
        align="center"
      ></el-table-column>
      <el-table-column
        label="项目名称"
        prop="project_name"
        align="center"
      ></el-table-column>
       <el-table-column
        label="省"
        prop="province"
        align="center"
      ></el-table-column>
      <el-table-column
        label="地市"
        prop="city"
        align="center"
      ></el-table-column>
       <el-table-column
        label="业绩"
        prop="achievement"
        align="center"
      ></el-table-column>
    </el-table>
    <div class="ui-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 50, 100, 500, 5000, 10000, 50000]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dptotal"
      ></el-pagination>
    </div>
  </d2-container>
</template>
<script>
import { dateFmt,getCurrentMonthFirst,getCurrentMonthLast } from "@/api/tools";
import { aes_encryptObject } from "@/api/tools";
export default {
  name: "baoCityarea",
  data() {
    return {
      dptotal: 1,
      limit: 10,
      page: 1,
      tableData: [],
      formInline: {
        project_code: "",
        province:'',
        city:'',
      },
      first_brush_time: [getCurrentMonthFirst(),getCurrentMonthLast()],
    };
  },
  created(){
    this.getData()
  },
  methods: {
    getData(data) {
      let first_brush ={
          first_brush_begin_time:this.first_brush_time[0],
          first_brush_end_time:this.first_brush_time[1],
      }
      if (data) {
        this.$http
          .get(this.$configApi.reportCity, {
            params: aes_encryptObject({
              ...this.formInline,
              limit: this.limit,
              page: this.page,
              ...first_brush
            }),
          })
          .then((res) => {
            if (res.code === "0") {
              this.tableData = res.data;
              this.dptotal = res.count;
            }
          });
      } else {
        this.$http
          .get(this.$configApi.reportCity, {
            params: aes_encryptObject({ limit: this.limit, page: this.page,...first_brush }),
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
          prop: 'project_code',
        },
        {
          label: '项目名称',
          prop: 'project_name',
        },
        {
          label: '省',
          prop: 'province',
        },
        {
          label: '地市',
          prop: 'city',
        },
        {
          label: '业绩',
          prop: 'achievement',
        },
      ]
      let data = this.tableData
      if(data.length === 0){
          this.$message.info('没有可导出的数据！！！');
          return
      }
      let aa = '业绩统计（地市）'+dateFmt(new Date(), "yyyyMMdd")
      this.$export.csv({
        columns,
        data,
        title: aa,
      })
    },
    serch() {
      this.getData(this.formInline);
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData({ ...this.formInline });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getData({ ...this.formInline });
    },
  },
};
</script>

<style lang="scss" scoped>
.row_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  span {
    color: #d9001b;
  }
}
.demo-form-inline .el-form-item {
  margin-left: 20px;
}
</style>