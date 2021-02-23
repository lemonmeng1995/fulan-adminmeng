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
          ></el-input></el-form-item
        ><el-form-item label="特殊资源">
          <el-radio-group v-model="formData.dateType">
            <el-radio :label="1">按天</el-radio>
            <el-radio :label="2">按周</el-radio>
            <el-radio :label="3">按月</el-radio>
          </el-radio-group> </el-form-item
        ><el-form-item label="首刷日期：">
          <el-date-picker
            v-model="formData.first_brush_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="applyCardList()" icon="el-icon-search" v-permission="['reportData_carddatareport_search']">查询</el-button>
        </el-form-item></el-form
      >
    </template>
    <div class="row_btn">
      <div style="color: #606266">当前查询结果的办卡合计汇总：首刷成功 <span>100</span></div>
      <el-button type="warning" @click="applyCardList(currentPage, 1)" icon="el-icon-upload" v-permission="['reportData_carddatareport_export']"
        >导出</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column label="序号" prop="id" align="center"></el-table-column>
      <el-table-column label="导入日期" prop="created" align="center"></el-table-column>
      <el-table-column label="项目来源码" prop="project_code" align="center"></el-table-column>
      <el-table-column label="存档号" prop="archive_number" align="center"></el-table-column>
    </el-table>
  </d2-container>
</template>
<script>
import { dateFmt } from "@/api/tools";
export default {
  data() {
    return {
      formData: {
        project_code: "",
        dateType: 1,
        first_brush_time: [
          `${dateFmt(new Date(), "yyyy-MM-dd")}`,
          `${dateFmt(new Date(), "yyyy-MM-dd")}`,
        ],
        tableData: [],
      },
      hasDataPermission: this.hasPermissions(["reportData_carddatareport_data"])
    };
  },
};
</script>

<style lang="scss" scoped>
.row_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  span{
       color:#D9001B;
  }
}
.demo-form-inline .el-form-item{
  margin-left: 20px;
}
</style>