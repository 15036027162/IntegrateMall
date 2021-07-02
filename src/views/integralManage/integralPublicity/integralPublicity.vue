<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="积分类别：">
        <el-select v-model="searchForm.integralId" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in list" :key="item.id" :label="item.integralName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="searchForm.state" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="被投诉" value="3"></el-option>
          <el-option label="公示中" value="4"></el-option>
          <el-option label="已完成" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件名称：">
        <el-input v-model="searchForm.setName" placeholder="请输入事件名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button type="success" size="medium" @click="exportBtn" v-if="isAuth('web:publicity:export')">导出</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="memberName" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="setName" label="积分明细"></el-table-column>
      <el-table-column prop="honorPoint " label="积分">
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
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 1" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.state == 2" size="small" type="danger">已驳回</el-tag>
          <el-tag v-else-if="scope.row.state == 3" size="small" type="danger">被投诉</el-tag>
          <el-tag v-else-if="scope.row.state == 4" size="small" type="warning">公示中</el-tag>
          <el-tag v-else size="small" type="success">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleViews(scope.row, 1)">查看</el-button>

          <el-button type="text" size="small" @click="handleViews(scope.row, 2)" v-if="(scope.row.state == 3||scope.row.state == 4)&&isAuth('web:publicity:confirm')">修正</el-button>
          <!-- <el-button
              type="text"
              @click="handleViews(scope.row, 2)"
              v-if="scope.row.state == 5"
              disabled="disabled"
              >修正</el-button
            > -->

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
import provinces from "../../../components/public/provinces";
import { baseUrl } from "../../../config/env";
import { sign } from "../../../config/signApi";
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
        villageCode: "",
        areaCode: "",
        streetCode: "",
        setName: "",
        state: "",
        name: "",
        integralId: "",
      },

      adminUserInfo: {},
      memberId: "",
      honorSetId: "",
      issue: "",
      info: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isPower: false,
      role_list: [],

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
          setName: "",
          state: "",
          name: "",
          integralId: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          setName: "",
          state: "",
          name: "",
          integralId: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          setName: "",
          state: "",
          name: "",
          integralId: "",
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
        };
      }

      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },
    // 获取列表数据
    async getList() {
      const res = await this.$http.getIntegralList({});
      if (res.status === "success") {
        this.list = res.data;
      } else {
      }
    },
    //格式化手机号
    formatter4(row) {
      var reg = /^(\d{3})\d*(\d{4})$/;
      if (row.mobile) {
        return row.mobile.replace(reg, "$1****$2");
      }
    },

    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.getIntegralPublicityList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        integralId: this.searchForm.integralId ? this.searchForm.integralId : 0,
        searchName: this.searchForm.name,
        state: this.searchForm.state ? this.searchForm.state : 0,
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
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },

    handleViews(item, type) {
      this.$router.push({
        name: "integralPublicityView",
        query: {
          id: item.id,
          type: type,
          memberId: item.memberId,
        },
      });
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
      } else {
        this.searchForm.villageCode = "";
      }
    },
    formatter3(item) {
      if (item.state == 1) {
        return "待审核";
      } else if (item.state == 2) {
        return "已驳回";
      } else if (item.state == 3) {
        return "被投诉";
      } else if (item.state == 4) {
        return "公示中";
      } else if (item.state == 5) {
        return "已完成";
      }
    },

    exportBtn() {
      var state;
      if (!this.searchForm.state) {
        state = 0;
      } else {
        state = this.searchForm.state;
      }
      var integralId;
      if (!this.searchForm.integralId) {
        integralId = 0;
      } else {
        integralId = this.searchForm.integralId;
      }
      window.open(
        baseUrl +
          "jinshiintegrate/v1/w/publicity/exportIntegralPublicity?villageCode=" +
          this.searchForm.villageCode +
          "&areaCode=" +
          this.searchForm.areaCode +
          "&streetCode=" +
          this.searchForm.streetCode +
          "&state=" +
          state +
          "&integralId=" +
          integralId +
          "&searchName=" +
          this.searchForm.name +
          "&setName=" +
          this.searchForm.setName +
          "&NO_SIGN=N",
        "_blank",
        ""
      );
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
