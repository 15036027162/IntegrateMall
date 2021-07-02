<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="信息分类：">
        <el-select v-model="searchForm.dicId" placeholder clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.tabName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.status" placeholder clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核通过" :value="2"></el-option>
          <el-option label="审核未通过" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题名称：">
        <el-input v-model="searchForm.policyName" placeholder="请输入主题名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button type="success" size="medium" @click="handleView(1, 1)" v-if="isAuth('web:policy:add')">发布</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="title" label="主题名称" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dicName" label="信息分类"></el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 1" size="small" type="">待审核</el-tag>
          <el-tag v-if="scope.row.state == 2" size="small" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.state ==3" size="small" type="danger">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="申请人"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="handleView(scope.row, 3)" >查看</el-button>
            <el-button type="text" size="small" @click="handleView(scope.row, 2)" v-if="scope.row.state!=1&&isAuth('web:policy:edit')" style="color:#E6A23C">编辑</el-button>
            <el-button type="text" size="small" @click="handleView(scope.row, 4)" v-if="scope.row.state==1&&isAuth('web:policy:examine')&&deptLevel==3" style="color:#E6A23C">审核</el-button>
            <el-button type="text" size="small"  @click="handleDelete(scope.row)" v-if="isAuth('web:policy:delete')" style="color:#F56C6C">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"  :page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import provinces from "../../../components/public/provinces";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
  },
  data() {
    //这里存放数据
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      adminUserInfo: {},
      tableListData: [],
      searchForm: {
        policyName: "",
        status: "",
        dicId: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      deptLevel: "",
      list: [],
      isReset: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;

    this.searchForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 4) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    } else if (this.deptLevel == 5) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }
    this.getListData();
    this.getList();
  },
  //方法集合
  methods: {
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          villageCode: "",
          policyName: "",
          status: "",
          dicId: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          policyName: "",
          status: "",
          dicId: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          policyName: "",
          status: "",
          dicId: "",
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
        };
      }
      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },
    // 获取信息公开tab分类
    async getList() {
      const res = await this.$http.getTabListById({
        id: 1,
      });
      if (res.status === "success") {
        this.list = res.data;
      } else {
      }
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
    },

    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.policyList({
        pageNumber: this.pageIndex,
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
    //查询
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },

    formatter1(item) {
      return this.$formatDateTime(item.createTime, "yyyy-MM-dd HH:mm");
    },

    handleView(item, type) {
      if (type == 1) {
        this.$router.push({
          name: "discloseAdd",
          query: {
            type: 1,
          },
        });
      } else if (type == 2) {
        this.$router.push({
          name: "discloseAdd",
          query: {
            id: item.id,
            type: 2,
          },
        });
      } else {
        this.$router.push({
          name: "discloseView",
          query: {
            id: item.id,
            type: type,
          },
        });
      }
    },
    handleDelete(item) {
      this.$confirm("删除后不可恢复，您确定要继续吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (_) => {
          const res = await this.$http.policyUpdateState({
            id: item.id,
            type: 3,
            // member_id: this.adminUserInfo.memberId,
            reason: "",
          });
          if (res.code === "0") {
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
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
