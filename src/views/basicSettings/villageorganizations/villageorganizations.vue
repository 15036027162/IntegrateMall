<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" >
      <el-form-item label="区域选择：" v-show="deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch" v-show="deptLevel!=5">查询</el-button>
        <el-button type="success" size="medium" @click="handleAdd" v-if="isAuth('web:groupintroduce:add')&&deptLevel==5">新增</el-button>
        <el-button size="medium" @click="resetForm" v-show="this.deptLevel!=5">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="name" label="组织名称"></el-table-column>
      <el-table-column prop="picUrl" label="icon图片" width="140px">
        <template slot-scope="scope">
          <div style="width:100px;height:100px;overflow:hidden;text-align:center;margin:0 auto;line-height:100px">
            <img :src="scope.row.icon" alt width="100%" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
      <el-table-column prop="modifier" label="操作人"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)" style="color:#E6A23C" v-if="isAuth('web:groupintroduce:edit')&&deptLevel==5">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color:#F56C6C" v-if="isAuth('web:groupintroduce:delete')&&deptLevel==5">删除</el-button>
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
      searchForm: {
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
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
  },
  //方法集合
  methods: {
    //查询
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //添加
    handleAdd() {
      this.$router.push({
        name: "editVillageorganizations",
      });
    },
    //编辑
    handleEdit(item) {
      this.$router.push({
        name: "editVillageorganizations",
        query: {
          id: item.id,
        },
      });
    },
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          villageCode: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
        };
      }

      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
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
      const res = await this.$http.villageOrganizeList({
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
    //删除
    handleDelete(item) {
      this.$confirm("删除后不可恢复，您确定要继续吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (_) => {
          const res = await this.$http.villageOrganizeDelete({
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
    //查看
    handleView(item) {
      this.$router.push({
        name: "villageorganView",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
