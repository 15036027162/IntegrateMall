<!--  -->
<template>
  <div class='register'>

    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item label="积分存折：" prop="cardId">
        <el-select v-model="editForm.cardId" placeholder="--请选择--" @change="getIntegerList">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分类别：" prop="integralId">
        <el-select v-model="editForm.integralId" placeholder="--请选择--">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralclassifyList" :key="item.id" :label="item.integralName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分明细：" prop="setName">
        <el-input v-model="editForm.setName" placeholder="请输入100字以内的积分明细"></el-input>
      </el-form-item>
      <el-form-item label="积分范围：" class="range" required="required">
        <el-col :span="11">
          <el-form-item label="" prop="rangeStart">
            <el-input v-model="editForm.rangeStart" placeholder="请输入积分"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">至</el-col>
        <el-col :span="11">
          <el-form-item label="" prop="rangeEnd">
            <el-input v-model="editForm.rangeEnd" placeholder="请输入积分"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="个人申报：" prop="setDeclare">
        <el-radio-group v-model="editForm.setDeclare">
          <el-radio :label="0">支持</el-radio>
          <el-radio :label="1">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" :disabled="isdisable" @click="submitForm('editForm')" style="width:150px">保存
        </el-button>
      </el-form-item>
    </el-form>
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

    var start = (rule, value, callback) => {
      if (value == ""&&value!=0) {
        callback(new Error("请输入积分"));
      } else {
        // const reg = /^\+?[1-9][0-9]*$/;
        // const reg = /^(0|\+?[1-9][0-9]*)$/;
       const reg = /(^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;//大于等于0的数，且最多两位小数
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入最多保留两位小数的数值"));
        }
        if (this.editForm.rangeEnd !== "") {
          this.$refs.editForm.validateField("rangeEnd");
        }
        callback();
      }
    };

    var end = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入积分"));
      } else if (Number(value) <= Number(this.editForm.rangeStart)) {
        // const reg = /^\+?[1-9][0-9]*$/;
         const reg = /(^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;//大于等于0的数，且最多两位小数
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入最多保留两位小数的数值"));
        }
        callback(new Error("积分范围不对!"));
      } else {
        // const reg = /^\+?[1-9][0-9]*$/;
         const reg = /(^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;//大于等于0的数，且最多两位小数
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入最多保留两位小数的数值"));
        }
        callback();
      }

      callback();
    };
    //正整数
    var isNumber = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入商品数量"));
      } else {
        const reg = /^\+?[1-9][0-9]*$/;
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入数值"));
        } else {
          callback();
        }
        callback();
      }
    };
    return {
      editForm: {
        cardId: "",
        integralId: "",
        setName: "",
        rangeStart: "",
        rangeEnd: "",
        setDeclare: 0,
        id: "",
      },
      editRules: {
        cardId: [
          {
            required: true,
            message: "请选择积分存折",
            trigger: "change",
          },
        ],
        integralId: [
          {
            required: true,
            message: "请选择积分类别",
            trigger: "change",
          },
        ],
        setName: [
          {
            required: true,
            message: "请输入100字以内的积分明细",
            trigger: "blur",
            min: 1,
            max: 100,
          },
        ],
        rangeStart: [
          {
            trigger: "blur",
            validator: start,
            required: true,
          },
        ],
        rangeEnd: [
          {
            trigger: "blur",
            validator: end,
            required: true,
          },
        ],
        setDeclare: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
      isdisable: false, //防重复提交
      integralList: [],
      integralclassifyList: [],
      adminUserInfo: {},
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.getCardList();
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getListData();
      this.$route.meta.title = "编辑";
    } else {
      this.$route.meta.title = "新增";
    }
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
        cardId: this.editForm.cardId,
      });
      if (res.status === "success") {
        this.integralclassifyList = res.data;
      } else {
      }
    },
    // 获取数据
    async getListData() {
      const res = await this.$http.integralSetInfo({
        id: this.id,
      });
      if (res && res.code == 0) {
        var resData = res.data || {};
        this.editForm = {
          setName: resData[0].setName,
          setDeclare: resData[0].setDeclare,
          cardId: resData[0].cardId,
          integralId: resData[0].integralId,
          rangeStart: resData[0].rangeStart,
          rangeEnd: resData[0].rangeEnd,
        };
        this.getIntegerList();
      } else {
        this.$message.error(res.msg);
      }
    },
    //发布
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isdisable = true;
          if (this.id) {
            this.$http
              .integralSetUpdate({
                id: this.id,
                ...this.editForm,
              })
              .then((res) => {
                if (res && res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.msg,
                  });
                  setTimeout(() => {
                    this.$router.go(-1);
                    this.isdisable = false;
                  }, 1000);
                } else {
                  this.$message.error(res.msg);
                  setTimeout(() => {
                    this.isdisable = false;
                  }, 1000);
                }
              });
          } else {
            this.$http
              .integralSetSave({
                ...this.editForm,
              })
              .then((res) => {
                if (res && res.code == 0) {
                  this.$message({
                    type: "success",
                    message: res.msg,
                  });
                  setTimeout(() => {
                    this.$router.go(-1);
                    this.isdisable = false;
                  }, 1000);
                } else {
                  this.$message.error(res.msg);
                  setTimeout(() => {
                    this.isdisable = false;
                  }, 1000);
                }
              });
          }
        }
      });
    },
  },
};
</script>
<style lang='less'>
.register {
  width: 60%;
  min-width: 800px;
  .range {
    text-align: center;
    .el-select {
      display: block;
    }
  }
}
</style>
