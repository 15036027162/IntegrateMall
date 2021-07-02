
<template>
  <div class="integralRegisterView">
    <div class="examstatus examstatus1">
      <div>加分申请：</div>
      <span>{{ details.state1 }}</span>
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
    <div class="viewItem">
      <span class="labeltext">申请人：</span>
      <div class="content">{{ details.creator }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">手机号：</span>
      <div class="content">{{ details.mobile }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext"></span>
      <div class="content">
        <el-button type="primary" size="medium" @click="goExam(4)" v-if="isAuth('web:register:examine')">通过</el-button>
        <el-button style="margin-left:40px" size="medium" @click="goExam(2)" v-if="isAuth('web:register:examine')">驳回</el-button>
      </div>
    </div>
    <!-- 驳回 -->
    <el-dialog title="驳回操作" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入20字以内驳回说明" maxlength="20" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isdisable">确定</el-button>
      </div>
    </el-dialog>
    <!-- 通过 -->
    <el-dialog title="通过操作" :visible.sync="dialogFormVisible2" width="500px">
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2">
        <el-form-item prop="integral">
          <el-input v-model="ruleForm2.integral" :placeholder="'请输入'+details.rangeStart+'~'+details.rangeEnd+'以内的积分'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goReject2('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm2('ruleForm2')" :disabled="isdisable">确定</el-button>
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
    //这里存放数据
    var start = (rule, value, callback) => {
      if (value == "" && value != 0) {
        callback(new Error("请输入积分"));
      } else {
        //  const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
        const reg = /(^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/; //大于等于0的数，且最多两位小数
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入最多保留两位小数的数值"));
        }
        if (
          Number(value) < Number(this.details.rangeStart) ||
          Number(value) > Number(this.details.rangeEnd)
        ) {
          callback(
            new Error(
              "请输入" +
                this.details.rangeStart +
                "~" +
                this.details.rangeEnd +
                "以内的积分"
            )
          );
        }
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      dialogFormVisible2: false,
      addname: "",
      honorNum: "",
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [
          {
            required: true,
            message: "请输入20字以内驳回说明",
            trigger: "blur",
            min: 1,
            max: 20,
          },
        ],
      },
      ruleForm2: {
        integral: "",
      },
      rules2: {
        integral: [
          {
            validator: start,
            trigger: "blur",
            required: true,
          },
        ],
      },

      details: {},
      honorCode: "",
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

    this.getListData();
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getIntegralRegisterById({
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
          this.details.state1 = "审核通过";
        } else {
          this.details.state1 = "审核未通过";
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
      if (type == 4) {
        this.dialogFormVisible2 = true;
      } else {
        //审核不通过
        this.dialogFormVisible = true;
      }
    },
    //驳回提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.exam(2);
        } else {
          this.$message.error("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    //通过提交
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var add = this.details.isAddPlus == 1 ? "+" : "-";
          this.$confirm(
            "确定通过将给申请者" + add + this.ruleForm2.integral + "分",
            "通过操作",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then((_) => {
              this.exam(4);
            })
            .catch((_) => {});
        } else {
          this.$message.error("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    //审核
    async exam(type) {
      this.isdisable = true;
      const res = await this.$http.registerEdit({
        name: this.adminUserInfo.name,
        id: this.id,
        state: type,
        refuseReason: this.ruleForm.desc,
        scores: this.ruleForm2.integral,
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
        if (type == 2) {
          this.dialogFormVisible = true;
        }
        if (type == 1) {
          this.dialogFormVisible2 = true;
        }
      }
      this.isdisable = false;
    },
    //取消
    goReject(formName) {
      this.dialogFormVisible = false;
    },
    //取消
    goReject2(formName) {
      this.dialogFormVisible2 = false;
    },
  },
};
</script>
<style lang='less'>
.inputwarp {
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    margin-left: 0 !important;
    width: 260px;
  }
  .el-select {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    margin-left: 0 !important;
    width: 260px;
  }
}
.imgwrap {
  overflow: hidden;
  img {
    height: 100px;
    width: 200px;
    float: left;
    margin-right: 10px;
  }
}
</style>