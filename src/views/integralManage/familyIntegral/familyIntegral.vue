<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="村级组：">
        <el-select v-model="searchForm.groupCode" placeholder="--请选择--" clearable filterable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="item in groupList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="积分存折：">
        <el-select v-model="searchForm.cardId" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="户主姓名：">
        <el-input v-model="searchForm.name" placeholder="请输入户主姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="门牌号：">
        <el-input v-model="searchForm.houseNumber" placeholder="请输入门牌号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="houseNumber" label="门牌号"></el-table-column>
      <el-table-column prop="name" label="户主姓名"></el-table-column>
      <el-table-column prop="groupName" label="所属组"></el-table-column>
      <el-table-column prop="familyNum" label="家庭人数"></el-table-column>
      <el-table-column prop="totalScore" label="家庭总分"></el-table-column>
      <el-table-column prop="ableScore" label="可用积分"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleDetailed(scope.row)" style="color:#E6A23C">积分明细</el-button>
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
        groupCode: "",
        name: "",
        houseNumber: "",
        cardId: "",
      },
      groupList: "",
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isReset: false,
      integralList: [],
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
    this.groupByVillages()
    this.getListData();
    this.getCardList();
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
          groupCode: "",
          name: "",
          houseNumber: "",
          cardId: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          groupCode: "",
          name: "",
          houseNumber: "",
          cardId: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          groupCode: "",
          name: "",
          houseNumber: "",
          cardId: "",
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
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
        this.groupByVillages();
      } else {
        this.searchForm.villageCode = "";
        this.groupByVillages();
      }
    },
    // 获取组
    async groupByVillages() {
      const res = await this.$http.groupByVillage({
        villageCode: this.searchForm.villageCode || "",
      });
      if (res.status === "success") {
        this.groupList = res.data;
      } else {
      }
    },
    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.getIntegralFamilyList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        groupCode: this.searchForm.groupCode,
        searchName: this.searchForm.name,
        cardId: this.searchForm.cardId ? this.searchForm.cardId : 0,
        houseNumber: this.searchForm.houseNumber,
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
        name: "familyIntegralView",
        query: {
          doorNum: item.doorNum,
        },
      });
    },
    //明细
    handleDetailed(item) {
      this.$router.push({
        name: "familyDetailed",
        query: {
          doorNum:item.doorNum,
        },
      });
    },
  },
};
</script>
<style lang='less'>
</style>
