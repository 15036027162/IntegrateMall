<!--  -->
<template>
  <div class='register'>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <!-- <el-form-item label="发放对象：">
        <el-input v-model="searchForm.provideObj" placeholder="请输入发放对象" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="手机号：">
        <el-input v-model="searchForm.idCard" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="personalInfo" v-if="JSON.stringify(personalInfo)!='{}'">
      <img :src="personalInfo.avatar" alt="" class="headImg" v-if="personalInfo.avatar">
      <img src="../../../assets/img/u6.png" alt="" class="headImg" v-else>
      <div class="baseInfo">
        <div><span>姓名：</span>{{personalInfo.name}}</div>
        <div><span>手机号：</span>{{personalInfo.mobile}}</div>
        <div><span>身份证号：</span>{{personalInfo.identity}}</div>
        <div><span>个人排名：</span>第{{personalInfo.rank}}名</div>
      </div>
      <div class="baseInfo">
        <div v-if="cardList.length"><span>总额：</span>{{personalInfo.totalScore}}</div>
        <div v-if="cardList.length">
          <div v-for="(item,index) in cardList" :key="index"><span>{{item.cardName}}：</span>{{item.cardScore}}</div>
        </div>
        <!-- <div><span>蓝色积分：</span>jddd</div>
        <div><span>爱心积分：</span>jddd</div>
        <div><span>健康积分：</span>jddd</div> -->
      </div>
    </div>
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item label="积分存折：" class="provinceSelect" required="required">
        <el-form-item label="" prop="cardId">
          <el-select v-model="editForm.cardId" placeholder="--请选择--" @change="getIntegerList">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分类别：" prop="integralId">
          <el-select v-model="editForm.integralId" placeholder="--请选择--" @change="getIntegralSetList">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in integralclassifyList" :key="item.id" :label="item.integralName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="积分明细：" prop="setName">
        <el-select v-model="editForm.setName" placeholder="--请选择--" @change="goselect">
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in setNameList" :key="item.id" :label="item.setName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分：" prop="integral">
        <el-input v-model="editForm.integral" :disabled="!editForm.setName" :placeholder="'请输入'+rangeStart+'~'+rangeEnd+'以内的积分'" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" :disabled="isdisable" @click="submitForm('editForm')" style="width:150px">提交
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
        //  const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
          const reg = /(^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;//大于等于0的数，且最多两位小数
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入最多保留两位小数的数值"));
        }
        if (
          Number(value) < Number(this.rangeStart) ||
          Number(value) > Number(this.rangeEnd)
        ) {
          callback(
            new Error(
              "请输入" + this.rangeStart + "~" + this.rangeEnd + "以内的积分"
            )
          );
        }
        callback();
      }
    };
    return {
      searchForm: {
        provideObj: "",
        idCard: "",
      },
      editForm: {
        cardId: "",
        integralId: "",
        setName: "",
        integral: "",
      },
      rangeStart: "",
      rangeEnd: "",
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
            message: "请选择积分明细",
            trigger: "change",
          },
        ],
        integral: [
          {
             required: true,
            validator: start,
            trigger: "blur",
          },
        ],
      },

      isdisable: false, //防重复提交
      integralList: [],
      integralclassifyList: [],
      setNameList: [],
      personalInfo: {},
      adminUserInfo: {},
      cardList: [],
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCardList();
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
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
      this.editForm.integralId = "";
      this.editForm.setName = "";
      const res = await this.$http.getInteger({
        cardId: this.editForm.cardId,
      });
      if (res.status === "success") {
        this.integralclassifyList = res.data;
      } else {
      }
    },
    // 获取积分类明细列表
    async getIntegralSetList() {
      this.editForm.setName = "";
      const res = await this.$http.getIntegralSetList({
        cardId: this.editForm.cardId,
        integralId: this.editForm.integralId,
      });
      if (res.status === "success") {
        this.setNameList = res.data;
      } else {
      }
    },
    //
    goselect(val) {
      var index = this.setNameList.findIndex((ele) => {
        return val == ele.id;
      });
      if (index != -1) {
        this.rangeStart = this.setNameList[index].rangeStart;
        this.rangeEnd = this.setNameList[index].rangeEnd;
      }
    },

    //查询
    goSearch() {
      this.$http
        .getMemberIntegralInfo({
          // name: this.searchForm.provideObj,
          mobile: this.searchForm.idCard,
        })
        .then((res) => {
          if (res && res.code == 0) {
            this.personalInfo = res.data;
            if (res.data.cardList && res.data.cardList.length) {
              this.cardList = res.data.cardList;
            } else {
              this.cardList = [];
            }

            if (JSON.stringify(res.data) == "{}") {
              this.$message.error(res.msg);
            }
          } else {
            this.personalInfo = {};
            this.cardList = [];
            this.$message.error(res.msg);
          }
        });
    },
    //重置
    resetForm() {
      this.searchForm = {
        provideObj: "",
        idCard: "",
      };
    },
    //提交

    //发布
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isdisable = true;

          this.$http
            .registerAdd({
              name: this.adminUserInfo.name,
              integralId: this.editForm.integralId,
              cardId: this.editForm.cardId,
              integralSetId: this.editForm.setName,
              scores: this.editForm.integral,
              doorNum: this.personalInfo.doorNum,
              memberId: this.personalInfo.memberId,
              memberName: this.personalInfo.name,
              areaCode: this.personalInfo.areaCode,
              areaName: this.personalInfo.areaName,
              streetCode: this.personalInfo.streetCode,
              streetName: this.personalInfo.streetName,
              villageCode: this.personalInfo.villageCode,
              villageName: this.personalInfo.villageName,
              loginVillageCode:this.adminUserInfo.villageCode
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
      });
    },
  },
};
</script>
<style lang='less'>
.register {
  width: 60%;
  min-width: 800px;
  .personalInfo {
    display: flex;
    align-items: center;
    margin: 20px 0;
    .headImg {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .baseInfo {
      margin-right: 100px;
      div {
        padding: 5px 0;
      }
    }
  }
  .provinceSelect {
    .el-form-item {
      float: left;
    }
  }
}
</style>
