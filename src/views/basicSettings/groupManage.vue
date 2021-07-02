<template>
  <div>
    <div class="rightBtn">

    </div>
    <!--查询-->
    <el-form :inline="true" :model="groupForm" class="demo-form-inline" >
      <el-form-item label="区域选择：" v-if="deptLevel !=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="searchGroup" v-if="deptLevel !=5">查询</el-button>
        <el-button type="success" size="medium" @click="addDGroup" v-if="isAuth('web:group:add')">添加组</el-button>
        <el-button size="medium" @click="resetForm" v-if="deptLevel !=5">重置</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table :data="dataList" border v-loading="dataListLoading">
      <el-table-column prop="groupName" label="组"></el-table-column>
      <el-table-column prop="doorCount" label="家庭户"></el-table-column>
      <el-table-column prop="sort" label="显示顺序"></el-table-column>
      <el-table-column prop="modifyTime" label="更新时间"></el-table-column>
      <el-table-column prop="creator" label="操作人"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)" v-if="isAuth('web:group:edit')">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)" v-if="isAuth('web:group:delete')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"  :page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper">
    </el-pagination>

    <!--新增-->
    <addGroup v-if="addGroupModel"></addGroup>
    <!--编辑-->
    <editGroup v-if="editGroupModel" :data="groupEdit"></editGroup>
  </div>
</template>

<script>
import provinces from "@/components/public/provinces";
import addGroup from "@/components/public/group/addGroup";
import editGroup from "@/components/public/group/editGroup";
export default {
  components: { provinces, addGroup, editGroup },
  data() {
    return {
      groupForm: {},
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      addGroupModel: false, //新增
      editGroupModel: false, //编辑
      areaCode: "",
      streetCode: "",
      villageCode: "",
      deptLevel: "",
      searchInfoShow: false,
      groupEdit: {}, //编辑组
      memberId: "",
      isReset: false,
    };
  },
  inject: ["reload"],
  mounted() {
    let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
    this.memberId = session_adminInfo.memberId || 0;
    this.deptLevel = session_adminInfo.deptLevel;
    this.areaCode = session_adminInfo.areaCode;
    if (this.deptLevel == 3) {
      this.villageCode = "";
      this.streetCode = "";
    } else if (this.deptLevel == 4) {
      this.villageCode = "";
      this.streetCode = session_adminInfo.streetCode;
    } else if (this.deptLevel == 5) {
      this.villageCode = session_adminInfo.villageCode;
      this.streetCode = session_adminInfo.streetCode;
    }
    this.getInfo();
  },
  methods: {
    /*组列表*/
    async getInfo() {
      this.dataListLoading = true;
      const res = await this.$http.commonalityGroup({
        memberId: this.memberId,
        villageCode: this.villageCode,
        pageNumber: this.pageIndex,
        pageSize: this.pageSize,
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

    /*添加组*/
    addDGroup() {
      this.addGroupModel = true;
    },

    /*区域选择*/
    changeTown(val) {
      this.isReset = false;
      this.areaCode = val.cityCode;
      this.streetCode = val.townCode;
      this.villageCode = val.villageCode;
      // let _this = this
      // if(val.villageCode){
      //     _this.villageCode= val.villageCode
      // }else if(val.townCode){
      //     _this.villageCode= val.townCode
      // }else if(val.cityCode){
      //     _this.villageCode= val.cityCode
      // }
    },

    /*查询*/
    searchGroup() {
      this.pageIndex = 1;
      this.getInfo();
    },
    /*重置*/
    resetForm() {
      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      if (this.deptLevel == 3) {
        this.villageCode = "";
        this.streetCode = "";
      } else if (this.deptLevel == 4) {
        this.villageCode = "";
        this.streetCode = session_adminInfo.streetCode;
      }
      this.pageIndex = 1;
      this.isReset = true;
      this.searchInfoShow = false;
      this.getInfo();
    },

    /*编辑*/
    handleEdit(val) {
      if (val) {
        this.editGroupModel = true;
        this.groupEdit = val;
      }
    },

    /*删除*/
    async handleDelete(val) {
      this.$confirm(
        "删除组后，组下方的家庭关系将清空，且不可恢复，请谨慎操作！",
        "删除提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          let session_adminInfo =
            JSON.parse(this.$getStore("adminUserInfo")) || "";
          let memberId = session_adminInfo.memberId || 0;
          let memberName = session_adminInfo.name || "";
          const res = await this.$http.commonalityGroupDelete({
            memberId: memberId,
            memberName: memberName,
            id: val.id,
          });
          if (res.status === "success") {
            this.$message({
              type: "success",
              message: res.msg,
              duration: 1000,
            });
            this.pageSize = 1;
            this.getInfo();
            this.reload();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
              duration: 1000,
            });
          }
        })
        .catch(() => {});
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getInfo();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getInfo();
    },
  },
};
</script>
<style lang='less'>
</style>
