<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="时间范围：">
        <el-date-picker v-model="searchForm.raiseTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="兑换人：">
        <el-input v-model="searchForm.convertor" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称：">
        <el-input v-model="searchForm.goodsName" placeholder="请输入商品名称进行查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="picUrl" label="商品图片" width="140">
        <template slot-scope="scope">
          <div style="width:100px;height:100px;overflow:hidden;text-alingn:center;margin:0 auto;line-height:100px">
            <img :src="scope.row.picUrl" alt width="100%" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="changePoint" label="兑换积分"></el-table-column>
      <el-table-column prop="name" label="兑换人"></el-table-column>
      <el-table-column prop="mobile" label="兑换人手机号"></el-table-column>
      <el-table-column prop="state" label="兑换状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state ==0" size="small" type="success">已兑换</el-tag>
          <el-tag v-else size="small" type="danger">取消兑换</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="操作员"></el-table-column>
      <el-table-column prop="createTime" label="操作时间"></el-table-column>
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
        raiseTime: "",
        convertor: "",
        goodsName: "",
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
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          villageCode: "",
          raiseTime: "",
          convertor: "",
          goodsName: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          raiseTime: "",
          convertor: "",
          goodsName: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
          raiseTime: "",
          convertor: "",
          goodsName: "",
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
      const res = await this.$http.getExGoodsRecords({
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
        queryTxt: this.searchForm.convertor,
        btime: this.searchForm.raiseTime ? this.searchForm.raiseTime[0] : "",
        etime: this.searchForm.raiseTime ? this.searchForm.raiseTime[1] : "",
        goodsName: this.searchForm.goodsName,
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
