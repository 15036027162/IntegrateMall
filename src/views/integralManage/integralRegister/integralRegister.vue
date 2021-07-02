<!--  -->
<template>
  <div class>

    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="积分存折：">
        <el-select v-model="searchForm.cardId" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态：">
        <el-select v-model="searchForm.state" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" :value=1></el-option>
          <el-option label="审核通过" :value=2></el-option>
          <el-option label="审核未通过" :value=3></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分明细：">
        <el-input v-model="searchForm.setName" placeholder="请输入积分明细" clearable></el-input>
      </el-form-item>
      <el-form-item label="发放对象：">
        <el-input v-model="searchForm.name" placeholder="请输入发放对象" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button type="success" size="medium" @click="goRegister" v-if="isAuth('web:register:register')&&deptLevel==5">登记</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="cardName" label="积分存折"></el-table-column>
      <el-table-column prop="integralName" label="积分类别"></el-table-column>
      <el-table-column prop="setName" label="积分明细"></el-table-column>
      <el-table-column prop="title" label="处理状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 1" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.state == 2" size="small" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.state == 3" size="small" type="danger">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="发放对象" width="140"></el-table-column>
      <el-table-column prop="createTime" label="提交时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleExam(scope.row)" style="color:#E6A23C" v-if="scope.row.state==1&&isAuth('web:register:examine')">审核</el-button>
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
        cardId: "",
        setName: "",
        state: "",
        name: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isReset: false,
      integralList: [],
      integralclassifyList: [],
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
    this.getCardList();
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
    //登记
    goRegister() {
      this.$router.push({
        name: "register",
      });
    },
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          villageCode: "",
          cardId: "",
          setName: "",
          state: "",
          name: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          cardId: "",
          setName: "",
          state: "",
          name: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          cardId: "",
          setName: "",
          state: "",
          name: "",
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
      const res = await this.$http.getIntegralRegisterList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        cardId: this.searchForm.cardId ? this.searchForm.cardId : 0,
        state: this.searchForm.state ? this.searchForm.state : 0,
        searchName: this.searchForm.name,
        setName: this.searchForm.setName,
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
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
    //查看
    handleView(item) {
      this.$router.push({
        name: "integralRegisterView",
        query: {
          id: item.id,
        },
      });
    },
    //审核
    handleExam(item) {
      this.$router.push({
        name: "examIntegralRegister",
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
