<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>

      <!-- <el-form-item label="村级组：">
        <el-select v-model="searchForm.groupCode" placeholder="村级组" clearable filterable>
          <el-option label="--请选择--" value=""></el-option>
          <el-option v-for="item in groupList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <br /> -->
      <el-form-item label="认证方式：">
        <el-select v-model="searchForm.identityWay" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="未认证" :value="0"></el-option>
          <el-option label="实名认证" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号状态：">
        <el-select v-model="searchForm.isEnable" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="正常" :value="0"></el-option>
          <el-option label="已禁用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名：">
        <el-input v-model="searchForm.param" placeholder="请输入用户名或手机号查询" clearable></el-input>
      </el-form-item>
      <el-form-item label="身份证号：">
        <el-input v-model="searchForm.identity" placeholder="通过身份证号查询" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="account" label="用户名"></el-table-column>
      <el-table-column prop="mobile" label="绑定手机"></el-table-column>
      <el-table-column prop="identityWay" label="实名状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.identityWay == 0" size="small"  type="danger">未实名</el-tag>
          <el-tag v-else size="small" type="success">已实名</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="identity" label="身份证号" ></el-table-column>
      <el-table-column prop="isEnable" label="账号状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isEnable == 0" size="small" type="success">正常</el-tag>
          <el-tag v-else size="small" type="danger">已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间"></el-table-column>

      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <!-- <el-button type="text" @click="lookView(scope.row)" v-if="isAuth('base:user:view')">查看</el-button>
            <el-button type="text" @click="handleDelete(scope.row, 1)" v-if="scope.row.isEnable == 0&&isAuth('base:user:able')">禁用</el-button>
            <el-button type="text" @click="handleDelete(scope.row, 0)" v-if="scope.row.isEnable == 1&&isAuth('base:user:able')">启用</el-button> -->
            <el-button type="text" size="small" @click="lookView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row, 1)" v-if="scope.row.isEnable == 0&&isAuth('web:user:disable')" style="color:#F56C6C">禁用</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row, 0)" v-if="scope.row.isEnable == 1&&isAuth('web:user:disable')" style="color:#67C23A">启用</el-button>
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
        groupCode: "",
        villageCode: "",
        identity: "",
        param: "",
        identityWay: "",
        isEnable: "",
      },
      adminUserInfo: {},
      groupList: [],
      deptLevel: "",
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
    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          groupCode: "",
          villageCode: "",
          identity: "",
          param: "",
          identityWay: "",
          isEnable: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          groupCode: "",
          villageCode: "",
          identity: "",
          param: "",
          identityWay: "",
          isEnable: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          groupCode: "",
          identity: "",
          param: "",
          identityWay: "",
          isEnable: "",
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
        };
      }

      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },
    //格式化手机号
    formatter4(row) {
      var reg = /^(\d{3})\d*(\d{2})$/;
      if (row.mobile) {
        return row.mobile.replace(reg, "$1******$2");
      }
    },
    formatter(row) {
      // var reg = /^(\d{4})\d*(\d{2})$/;
      // return row.identity.replace(reg, "$1************$2");
      var reg = /(?<=\d{4})\d+(?=[\dX]{2})/;
      return row.identity.replace(reg, "************");
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
    handleDelete(item, type) {
      if (type == 1) {
        this.$confirm(
          "禁用该用户不可继续使用App，您确定要禁用么？",
          "禁用成员操作",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then((_) => {
            this.goDelete(item, type);
          })
          .catch((_) => {});
      } else {
        this.$confirm(
          "确定要启用" + item.account + "用户么？",
          "启用成员操作",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then((_) => {
            this.goDelete(item, type);
          })
          .catch((_) => {});
      }
    },

    async goDelete(item, type) {
      const res = await this.$http.editMember({
        editMemberId: item.memberId,
        isEnable: type,
      });
      if (res.code === "0") {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.getListData();
        }, 1000);
      } else {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: res.msg,
          });
        }, 1000);
      }
    },

    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.memberList({
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
    //查询
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      if (val.villageCode) {
        this.searchForm.villageCode = val.villageCode;
        // this.groupByVillages();
      } else {
        this.searchForm.villageCode = "";
        //this.groupByVillages();
      }
    },
    //查看
    lookView(item) {
      this.$router.push({
        name: "userView",
        query: {
          editMemberId: item.memberId,
        },
      });
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
