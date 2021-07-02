
<template>
  <div class="policyView">
    <div class="viewItem">
      <span class="labeltext">商品名称：</span>
      <div class="content">{{details.goodsName}}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">商品价格：</span>
      <div class="content">{{details.price}}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">商品数量：</span>
      <div class="content">{{details.stock}}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">兑换值：</span>
      <div class="content">{{details.changePoint}}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">商品图片：</span>
      <div class="content">
        <div class="imgdiv">
          <el-image v-if="details.picUrl !== undefined" lazy :src="details.picUrl" :preview-src-list="[details.picUrl]">
          </el-image>
        </div>
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext"></span>
      <div class="content">
        <el-button type="primary" size="medium" @click="goExam(1)" ::disabled="isdisable">确认通过</el-button>
        <el-button style="margin-left:40px" size="medium" @click="goExam(2)" :disabled="isdisable">不通过</el-button>
      </div>
    </div>
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
      adminUserInfo: {},
      details: {},
      role_list: [],
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isdisable:false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.type = this.$route.query.type;
    }
    this.getListData();
  },
  //方法集合
  methods: {
    handleClose(done) {
      this.$refs["ruleForm"].resetFields();
      this.dialogFormVisible = false;
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.exGoodsInfo({
        goodsId: this.id || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 2) {
          this.details.state1 = "审核通过";
        } else {
          this.details.state1 = "审核不通过";
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    goExam(type) {
      //审核通过

      if (type == 1) {
        this.$confirm("确定要审核该商品么?", "审核确认", {
          confirmButtonText: "确定通过",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.exam(3);
            done();
          })
          .catch((_) => {});
      } else {
        this.$confirm("确定要审核该商品么?", "审核确认", {
          confirmButtonText: "不通过",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.exam(2);
            done();
          })
          .catch((_) => {});
      }
    },
    async exam(type) {
      this.isdisable=true;
      const res = await this.$http.updateExGoodsStatus({
        goodsId: this.id,
        type: 1,
        status: type,
      });
      if (res.code === "0") {
        this.$message({
          type: "success",
          message: res.msg,
        });
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
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
.textaresa {
  font-family: "微软雅黑";
  textarea {
    font-family: "微软雅黑";
  }
}
</style>