<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="筛选日期：">
        <el-date-picker v-model="searchForm.queryDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="贡献者：">
        <el-input v-model="searchForm.searchName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="modifyTime" label="发生时间" width="180"></el-table-column>
      <el-table-column prop="memberName" label="贡献者"></el-table-column>
      <el-table-column prop="setName" label="积分明细"></el-table-column>
      <el-table-column prop="title" label="积分变化">
          <template slot-scope="scope">
          <span v-if="scope.row.scores">
            {{ scope.row.isAddPlus == 1 ? "+" : "-"
          }}{{ scope.row.scores }}
          </span>
          <span v-else>
            {{ scope.row.scores }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="记录员"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"  :page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    //这里存放数据
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      searchForm: {
        queryDate: "",
        searchName: "",
      },
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isReset: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.doorNum) {
      this.doorNum = this.$route.query.doorNum;
      this.getListData();
    }
  },
  //方法集合
  methods: {
    //查询
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //重置
    resetForm() {
      this.searchForm = {
        queryDate: "",
        searchName: "",
      };

      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },

    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.getIntegralFamilyDetail({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        ...this.searchForm,
        doorNum:this.doorNum
      });
      if (res && res.code == 0) {
        this.dataList = res.data.list;
        this.totalPage = res.data.total;
      } else {
        this.dataList = [];
        this.totalPage = 0;
      }
      this.dataListLoading = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getListData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getListData();
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
