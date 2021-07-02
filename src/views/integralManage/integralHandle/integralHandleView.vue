<!--  -->
<template>
  <div class="honorValueExamView">
    <div class="rightBtn">
      <!-- v-if="type==2" -->
      <el-button type="text" style="color:#F56C6C" @click="goExamines(3)" v-if="type == 2">驳回</el-button>
      <el-button type="text" @click="goExamines(2)" v-if="type == 2">通过</el-button>
    </div>
    <h3 style="text-align:center">积分发放申请单</h3>
    <div class="tabletit">
      <div class="pnumber">批次编号：{{ id }}</div>
      <div class="pnumber">
        审核状态：<span>{{ formatter2(details.state) }}</span>
      </div>
    </div>
    <table style="width:100%" class="table_content">
      <tr>
        <td>积分存折：{{ details.cardName }}</td>
        <td>积分类别：{{ details.integralName }}</td>
        <td>提交时间：{{ details.createTime }}</td>
      </tr>
      <tr>
        <td>积分明细</td>
        <td colspan="2">{{ details.setName }}</td>
      </tr>
      <!-- <tr>
        <td>参与人/户</td>
        <td colspan="2">{{ details.memberCount }}</td>
      </tr> -->
      <tr v-if="type == 1&&details.state==3">
        <td>驳回理由</td>
        <td colspan="2">{{ details.refuseReason }}</td>
      </tr>
    </table>

    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column prop="memberName" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="remark" label="发放荣誉值" style="width:20%">
        <template slot-scope="scope">
          <div>
            {{ scope.row.isAddPlus == 1 ? "+" : "-" }}{{ scope.row.scores }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"  :page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog class="addEdit" title="驳回操作" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="desc" class="textaresa">
          <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入20字以内驳回说明" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isdisable">确定驳回</el-button>
      </div>
    </el-dialog>
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
      dialogFormVisible: false,

      ruleForm: {
        desc: "",
      },

      rules: {
        desc: [
          {
            required: false,
            message: "请输入20字以内驳回说明",
            trigger: "blur",
            min: 1,
            max: 20,
          },
        ],
      },
      labelWidth: "90px",
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      adminUserInfo: {},
      honorSetId: "",
      issue: "",
      type: "",
      details: {},
      isdisable:false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    if (this.$route.query.type == 1) {
      this.$route.meta.title = "查看";
    } else {
      this.$route.meta.title = "审核";
    }
    this.getListData();
    this.getData();
  },
  watch: {},
  //方法集合
  methods: {
    goReject(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 获取列表数据
    async getData() {
      const res = await this.$http.getIntegralBatchById({
        id: this.id,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData;
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    }, // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.getIntegralBatchMemberList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        id: this.id,
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

    formatter4(scene) {
      var index = this.list.findIndex((val) => {
        return val.id == scene;
      });
      if (index != -1) {
        return this.list[index].name;
      }
    },
    formatter2(state) {
      if (state == 1) {
        return "待审核";
      } else if (state == 2) {
        return "审核通过";
      } else if (state == 3) {
        return "审核未通过";
      }
    },
    handleCurrentChange(val) {
      this.listMain.pageNo = val;
    },
    submitForm(formName) {
      this.rules.desc[0].required = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.exam(3);
        } else {
          this.$message.warning("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },

    goExamines(type) {
      //审核通过
      if (type == 2) {
        this.$confirm(
          "确定通过第" +
            this.details.id +
            "期" +
            this.details.creator +
            "提交的积分发放？",
          "通过操作",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then((_) => {
            this.exam(2);
          })
          .catch((_) => {});
      } else {
        //审核不通过
        this.dialogFormVisible = true;
      }
    },

    async exam(type) {
      this.isdisable=true;
      const res = await this.$http.batchOperate({
        name: this.adminUserInfo.name,
        id: this.id,
        operateType: type,
        refuseReason: this.ruleForm.desc,
      });

      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg,
        });
        setTimeout(() => {
          this.$router.go(-1);
          this.dialogFormVisible = false;
        }, 1500);
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
      this.isdisable=false;
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
.honorValueExamView {
  .table_content {
    width: 100%;
    color: #606266;
    font-size: 14px;
    border: 1px solid #dcdfe6;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .table_content td {
    padding: 14px 0;
    line-height: 24px;
    text-align: center;
    border: 1px solid #a4a4a9;
  }
}
</style>
