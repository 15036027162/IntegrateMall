<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="积分存折：">
        <el-select v-model="searchForm.cardId" placeholder="--请选择--" clearable @change="getIntegerList">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分类别：">
        <el-select v-model="searchForm.integralId" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralclassifyList" :key="item.id" :label="item.integralName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分明细：">
        <el-input v-model="searchForm.setName" placeholder="请输入积分明细" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button type="success" size="medium" @click="addSettings" v-if="isAuth('web:integralset:add')">新增</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="cardName" label="积分存折"></el-table-column>
      <el-table-column prop="integralName" label="积分类别"></el-table-column>
      <el-table-column prop="setName" label="积分明细"></el-table-column>
      <el-table-column prop="title" label="积分">
        <template slot-scope="scope">
          {{scope.row.rangeStart}}~{{scope.row.rangeEnd}}
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="handleEdit(scope.row,3)" v-if="isAuth('web:integralset:edit')">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row,1)" style="color:#F56C6C" v-if="isAuth('web:integralset:delete')">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper">
    </el-pagination>

  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      searchForm: {
        cardId: "",
        integralId: "",
        setName: "",
      },
      integralList: [],
      integralclassifyList: [],
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;

    this.getCardList();
    // this.getIntegerList();
    this.getListData();
  },
  //方法集合
  methods: {
    // 获取积分存折列表
    async getCardList() {
      const res = await this.$http.getCard({});
      if (res.status === "success") {
        this.integralList = res.data;
      } else {
      }
    },
    // 获取积分类别列表
    async getIntegerList() {
      const res = await this.$http.getInteger({
        cardId: this.searchForm.cardId,
      });
      if (res.status === "success") {
        this.integralclassifyList = res.data;
      } else {
      }
    },
    //查询
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //新增
    addSettings(item) {
      this.$router.push({
        name: "addIntegralset",
      });
    },
    //编辑
    handleEdit(item) {
      this.$router.push({
        name: "addIntegralset",
        query: {
          id: item.id,
        },
      });
    },
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          cardId: "",
          integralId: "",
          setName: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          cardId: "",
          integralId: "",
          setName: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          cardId: "",
          integralId: "",
          setName: "",
        };
      }
      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },

    //删除
    handleDelete(item) {
      this.$confirm("删除后不可恢复，您确定要继续吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (_) => {
          const res = await this.$http.integralSetDelete({
            id: item.id,
          });
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.msg,
            });
            this.getListData();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        })
        .catch((_) => {});
    },

    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.integralSetList({
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        ...this.searchForm,
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

    formatter(item) {
      if (item.state == 2) {
        return "待审核";
      } else if (item.state == 4) {
        return "审核通过";
      } else if (item.state == 4) {
        return "审核未通过";
      }
    },
    formatter1(item) {
      return this.$formatDateTime(item.createTime, "yyyy-MM-dd");
    },
    handleView(item, type) {
      if (type == 1) {
        this.$router.push({
          name: "integralRegisterView",
          query: {
            type: 1,
          },
        });
      } else if (type == 2) {
        this.$router.push({
          name: "integralRegisterView",
          query: {
            id: item.id,
            type: 2,
          },
        });
      } else {
        this.$router.push({
          name: "integralRegisterView",
          query: {
            id: item.id,
          },
        });
      }
    },
  },
};
</script>
<style lang='less'>
</style>
