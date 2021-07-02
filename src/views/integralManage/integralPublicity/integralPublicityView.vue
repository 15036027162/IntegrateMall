
<template>
  <div class="policyView">
    <div class="examstatus examstatus1">
      <div>公示状态：</div> <span>{{ details.state1 }}</span>
    </div>
    <div class="viewItem" v-if="details.state=='3'">
      <span class="labeltext" style="color:#F56C6C">投诉理由：</span>
      <div class="content" style="color:#F56C6C">{{details.complaintReason}}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">事件编号：</span>
      <div class="content">{{ details.id }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分存折：</span>
      <div class="content">{{ details.cardName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分类别：</span>
      <div class="content">{{ details.integralName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分明细：</span>
      <div class="content">{{ details.setName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分：</span>
      <div class="content">{{ details.rangeStart }}~{{ details.rangeEnd }}</div>
    </div>
    <div class="viewItem" v-if="details.remark">
      <span class="labeltext">申请说明：</span>
      <div class="content">{{ details.remark?details.remark:'--' }}</div>
    </div>
    <div class="viewItem" v-if="details.imageUrls&&details.imageUrls.length">
      <span class="labeltext">图片：</span>
      <div class="content" v-if="details.imageUrls.length">
        <div class="imgdiv" v-for="(item,index) in details.imageUrls" :key="index">
          <el-image :src="item" :preview-src-list="[item]" v-if="item!== undefined" lazy>
          </el-image>
        </div>
      </div>
      <div class="content" v-else>--</div>
    </div>
    <div class="viewItem" v-if="details.memberName">
      <span class="labeltext">发放对象：</span>
      <div class="content">{{ details.memberName }}</div>
    </div>

    <div class="viewItem">
      <span class="labeltext">申请时间：</span>
      <div class="content">{{ details.createTime }}</div>
    </div>
    <div class="viewItem" v-if="details.creator">
      <span class="labeltext">申请人：</span>
      <div class="content">{{ details.creator }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">手机号：</span>
      <div class="content">{{ details.mobile }}</div>
    </div>

    <div class="viewItem" v-if="type==2">
      <span class="labeltext">发放积分：</span>
      <div class="addbox content">
        <div class="addbox1">
          <el-radio-group v-model="dataForm.isAddPluss" size="medium" @change="changehonor">
            <el-radio-button :label="1">加分</el-radio-button>
            <el-radio-button :label="2">减分</el-radio-button>
          </el-radio-group>
        </div>
        <div class="addbox1">
          <el-input v-model="dataForm.honorPoint" ></el-input>
        </div>
        <!-- <div class="addbox1">
          <el-checkbox v-model="checked">不给分</el-checkbox>
        </div> -->
      </div>
      <!-- <div class="el-form-item__error" v-if="isInteger"></div> -->
    </div>
    <div class="viewItem" v-else>
      <span class="labeltext">发放积分：</span>
      <div class="content">{{details.isAddPlus==1?'+':'-'}}{{details.scores}}</div>
    </div>
    <div class="viewItem" v-show="type==2">
      <span class="labeltext"></span>
      <div class="content">
        <el-button type="primary" size="medium" @click="goExam()" :disabled="isdisable">修正处理</el-button>
        <el-button style="margin-left:40px" size="medium" @click="toBack">返回</el-button>
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
      checked: false,
      details: {},
      dataForm: {
        isAddPluss: 1,
        honorPoint: "",
      },
      id: "",
      type: "",
      list: [],
      adminUserInfo: {},
      isdisable: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.type = this.$route.query.type;

    this.memberId = this.$route.query.memberId;
    if (this.$route.query.type == 1) {
      this.$route.meta.title = "查看";
    } else {
      this.$route.meta.title = "修正";
    }
    this.getListData();
  },
  //方法集合
  methods: {
    changehonor(type) {
      this.dataForm.honorPoint = "";
    },
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getIntegralPublicityById({
        id: this.id || 1,
      });
      if (res.status === "success") {
        if (res.data.imageUrls) {
          res.data.imageUrls = res.data.imageUrls.split(",");
        }
        this.details = res.data;

        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 2) {
          this.details.state1 = "已驳回";
        } else if (this.details.state == 3) {
          this.details.state1 = "被投诉";
        } else if (this.details.state == 4) {
          this.details.state1 = "公示中";
        } else if (this.details.state == 5) {
          this.details.state1 = "已完成";
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    async goExam(type) {
      var obj = {
        id: this.id,
        isAddPlus: this.dataForm.isAddPluss,
        scores: Number(this.dataForm.honorPoint),
        name: this.adminUserInfo.name,
        memberId: this.memberId,
      };
      if (this.checked) {
        obj.isAddPlus = 0;
      }
      //有分
      if (obj.isAddPlus != 0) {
        if (this.dataForm.honorPoint == "") {
          this.$message({
            type: "error",
            message: "请输入发放积分",
          });
          return;
        } else {
          // const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
          const reg = /(^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;//大于等于0的数，且最多两位小数
          const rsCheck = reg.test(this.dataForm.honorPoint);
          if (!rsCheck) {
            this.$message({
              type: "error",
              message: "请输入最多保留两位小数的数值",
            });
            return;
          }  
          /**  
          if (obj.isAddPlus == 1) {
          if (
              this.dataForm.honorPoint < this.details.rangeStart ||
              this.dataForm.honorPoint > this.details.rangeEnd
            ) {
              this.$message({
                type: "error",
                message:
                  "请输入" +
                  this.details.rangeStart +
                  "~" +
                  this.details.rangeEnd +
                  "以内积分",
              });
              return;
            }
           
          }
          **/
        }
      } else {
        //不给分
        obj.scores = "";
      }

  
      this.isdisable = true;
      const res = await this.$http.publicityEdit(obj);
      if (res.status === "success") {
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
      this.isdisable = false;
    },
    // 返回
    toBack() {
      this.$router.go(-1);
    },
  
  
    
  },
};
</script>
<style lang='less'>
.addbox {
  .addbox1 {
    display: inline-block;
    margin: 0 !important;
    &:first-child {
      margin-left: 0 !important;
    }
    &:last-child {
      margin-left: 10px !important;
    }
    label {
      width: auto !important;
    }
    span {
      color: #909399;
      margin-left: 0 !important;
    }
    .el-radio-group {
      margin: 0 !important;
    }
    .el-input {
      margin-left: 10px !important;
    }
  }

  .el-button {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: 0;
  }
  .el-select {
    width: 247px;
  }
  .el-input {
    display: inline-block;
    width: 80px;

    .el-input__inner {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      // border-radius: 0;
    }
  }
  input {
    vertical-align: baseline;
  }
}
</style>