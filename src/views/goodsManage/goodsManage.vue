<!--  -->
<template>
  <div class>

    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="上架状态：">
        <el-select v-model="searchForm.status" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" :value="1"></el-option>
          <el-option label="审核未通过" :value="2"></el-option>
          <el-option label="可兑换" :value="3"></el-option>
          <el-option label="已下架" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model="searchForm.goodsName" placeholder="输入商品名称进行查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button type="success" size="medium" @click="handleAdd(1)" v-if="isAuth('web:goods:add')">新增</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column type="index" label="序号" width="100px"></el-table-column>
      <el-table-column prop="picUrl" label="商品图片" width="140px">
        <template slot-scope="scope">
          <div style="width:100px;height:100px;overflow:hidden;text-align:center;margin:0 auto;line-height:100px">
            <img :src="scope.row.picUrl" alt width="100%" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" show-overflow-tooltip width="180"></el-table-column>
      <el-table-column prop="price" label="价格">
        <template slot-scope="scope">
          ￥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存"></el-table-column>
      <el-table-column prop="changePoint" label="兑换值"></el-table-column>
      <el-table-column prop="state" label="商品状态" :formatter="formatter">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 1" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.state == 2" size="small" type="danger">审核未通过</el-tag>
          <el-tag v-else-if="scope.row.state == 3" size="small" type="success">可兑换</el-tag>
          <el-tag v-else size="small" type="danger">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="examView(scope.row)" v-if="scope.row.state == 1&&isAuth('web:goods:examine')" >审核</el-button>
          <el-button type="text" size="small" @click="handleAdd(2, scope.row)" v-if="scope.row.state == 2&&isAuth('web:goods:add')">编辑</el-button>
          <el-button type="text" size="small" @click="handleView(scope.row, 3)" v-if="scope.row.state == 4&&isAuth('web:goods:down')">上架</el-button>
          <el-button type="text" size="small" @click="handleView(scope.row, 4)" v-if="scope.row.state == 3&&isAuth('web:goods:down')">下架</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)&&isAuth('web:goods:delete')" style="color:#F56C6C">删除</el-button>
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

import provinces from "@/components/public/provinces";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { provinces },
  //   filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'info',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  data() {
    //这里存放数据
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      searchForm: {
        goodsName: "",
        status: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      adminUserInfo: "",
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
    this.searchForm1 = this.searchForm;
    this.obj = this.searchForm1;
    this.getListData();
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
          goodsName: "",
          status: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          goodsName: "",
          status: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          goodsName: "",
          status: "",
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
        };
      }

      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },
    formatter(item) {
      if (item.state == 1) {
        return "待审核";
      } else if (item.state == 2) {
        return "审核未通过";
      } else if (item.state == 3) {
        return "可兑换";
      } else {
        return "已下架";
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
      const res = await this.$http.exGoodsList({
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
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    handleView(item, type) {
      let str = "";
      if (type == 3) {
        str = "确定要上架该商品吗?";
        this.$confirm(str, "上架操作", {
          confirmButtonText: "确定上架",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.changeStatus(item, type);
          })
          .catch((_) => {});
      } else {
        str = "确定要下架该商品吗?";
        this.$confirm(str, "下架操作", {
          confirmButtonText: "确定下架",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.changeStatus(item, type);
          })
          .catch((_) => {});
      }
    },
    //详情添加
    handleAdd(type, item) {
      if (type == 2) {
        this.$router.push({
          name: "addGoods",
          query: {
            id: item.id,
          },
        });
      } else {
        this.$router.push({
          name: "addGoods",
        });
      }
    },
    examView(item) {
      this.$router.push({
        name: "examGoods",
        query: {
          id: item.id,
          // type: type
        },
      });
    },

    async changeStatus(item, type) {
      const res = await this.$http.updateExGoodsStatus({
        goodsId: item.id,
        status: type,
        type: 1,
        // member_id: this.adminUserInfo.memberId
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
    },
    //删除
    handleDelete(item) {
      this.$confirm("删除后不可恢复，您确定要继续吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (_) => {
          const res = await this.$http.updateExGoodsStatus({
            goodsId: item.id,
            status: 1,
            type: 0,
            // member_id: this.adminUserInfo.memberId
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
