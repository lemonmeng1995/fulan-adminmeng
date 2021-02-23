<template>
  <d2-container>
    <template slot="header">
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
        <el-form-item label="项目名称：">
          <el-input
            v-model="formData.project_code"
            placeholder=""
            maxlength="50"
          ></el-input
        ></el-form-item>
        <el-form-item>
          <el-select v-model="formData.value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      size="medium"
      height="500"
    >
      <el-table-column label="序号" prop="id" align="center"></el-table-column>
      <el-table-column label="项目来源码" prop="project_code" align="center"></el-table-column>
      <el-table-column label="项目名称" prop="archive_number" align="center"></el-table-column>
      <el-table-column label="状态" prop="geek_status" align="center"></el-table-column>
      <el-table-column label="操作" prop="geek_status" align="center">
        <template slot-scope="scope" align="center">
          <el-button type="primary" @click="linkPage(scope.row,'reward')" size="small"
            >奖励/提现记录</el-button
          >
          <el-button type="primary" @click="linkPage(scope.row,'withdrawal')" size="small"
            >员工奖励报表</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="ui-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </d2-container>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        project_code: "",
        value: "",
      },
      options: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "1",
          label: "正常",
        },
        {
          value: "2",
          label: "禁用",
        },
      ],
      tableData: [],
    };
  },
  methods:{
    linkPage(row,str){

    }
  }
};
</script>

<style lang="scss" scoped>
.demo-form-inline .el-form-item{
  margin-left: 20px;
}
</style>