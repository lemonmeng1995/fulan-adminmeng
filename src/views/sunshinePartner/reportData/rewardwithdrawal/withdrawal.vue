<template>
  <d2-container>
    <template slot="header">
      <el-form
        :inline="true"
        :model="formData"
        ref="formData"
        class="demo-form-inline"
      >
      <el-form-item>
                
      </el-form-item>
      </el-form> 
      </template
  ></d2-container>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
    };
  },
};
</script>

<style>
</style>