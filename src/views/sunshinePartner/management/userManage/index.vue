<template>
  <d2-container>
    <template slot="header">
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="formInline.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select v-model="formInline.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="serch">查询</el-button>
          <el-button type="primary" @click="add">新建用户</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="tableData" style="width: 100%" border size="medium">
      <el-table-column label="序号" prop="merchant_id"></el-table-column>
      <el-table-column label="用户名" prop="name"></el-table-column>
      <el-table-column label="姓名" prop="merchant_id"></el-table-column>
      <el-table-column label="权限组" prop="name"></el-table-column>
      <el-table-column label="创建时间" prop="merchant_id"></el-table-column>
      <el-table-column label="上次登录时间" prop="name"></el-table-column>
      <el-table-column label="上次登录IP" prop="merchant_id"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeState(scope.row.id, scope.row.status)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)" size="small"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="ui-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dptotal"
      ></el-pagination>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: "managementUser",
  data() {
    return {
      formInline: {
        name: "",
        status: "",
      },
      tableData: [{}],
      dptotal: 1,
      pageSize: 10,
      currentPage: 1,
    };
  },
  methods: {
    serch() {
      // this.getData()
    },
    add() {
      this.$router.push("/management/addUserman");
    },
    edit(id) {
      this.$router.push({ path: "/management/addUserman", query: { id: "1" } });
    },
    changeState() {},
    handleSizeChange(val) {
      this.pageSize = val;
      //  this.lookDataList()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      //  this.lookDataList()
    },
  },
};
</script>
<style scoped lang="scss">
</style>