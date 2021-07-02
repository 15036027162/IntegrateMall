<!--  -->
<template>
  <div class='exportIntegral'>

    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item class="provinceSelect" label="区域选择：">
        <el-form-item class="exports">
          <provinces @changeTown="changeTown"></provinces>
          <div class="el-form-item__error" v-show="isStreet">请选择到镇</div>
        </el-form-item>
        <el-form-item label="村级组：" class="exports" label-width="80px">
          <el-select v-model="editForm.groupCode" placeholder="--请选择--">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in groupList" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="个人/家庭：" prop="exportType">
        <el-switch v-model="editForm.exportType" active-text="个人" inactive-text="家庭" active-color="#13ce66" inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item class="provinceSelect" label="积分存折：">
        <el-form-item>
          <el-select v-model="editForm.cardId" placeholder="--请选择--" @change="getIntegerList">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分类别：">
          <el-select v-model="editForm.integralId" placeholder="--请选择--">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in integralclassifyList" :key="item.id" :label="item.integralName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item class="provinceSelect" label="导出方式：" required>
        <el-form-item prop="timeType">
          <el-select v-model="editForm.timeType" placeholder="--请选择--" @change="seleectExport">
            <el-option label="--请选择--" value></el-option>
            <el-option label="月报" :value=1></el-option>
            <el-option label="季报" :value=2></el-option>
            <el-option label="年报" :value=3></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月份：" prop="num" v-if="editForm.timeType==1">
          <el-date-picker v-model="editForm.num" type="month" value-format="yyyy-MM" placeholder="--选择--">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="季度：" v-if="editForm.timeType==2" prop="num">
          <el-select v-model="editForm.num" placeholder="--请选择--">
            <el-option label="--请选择--" value></el-option>
            <el-option label="第一季度" :value=1></el-option>
            <el-option label="第二季度" :value=2></el-option>
            <el-option label="第三季度" :value=3></el-option>
            <el-option label="第四季度" :value=4></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年度：" v-if="editForm.timeType==3" prop="num">
          <el-date-picker v-model="editForm.num" type="year" placeholder="--选择--" value-format="yyyy">
          </el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" :disabled="isdisable" @click="submitForm('editForm')" style="width:150px">导出
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import provinces from "../../components/public/provinces";
import { baseUrl } from "../../config/env";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
  },
  data() {
    //这里存放数据
    return {
      editForm: {
        cardId: "",
        integralId: "",
        groupCode: "",
        exportType: false,
        timeType: 1,
        // month: new Date(),
        // quarter: "",
        // year: new Date(),
        // month: "",
        // quarter: "",
        // year: "",
        num: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      editRules: {
        cardId: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        integralId: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        timeType: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        num: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        quarter: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        year: [
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
      groupList: [],
      adminUserInfo: {},
      deptLevel: {},
      isStreet:false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.editForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 4) {
      this.editForm.streetCode = this.adminUserInfo.streetCode;
    } else if (this.deptLevel == 5) {
      this.editForm.streetCode = this.adminUserInfo.streetCode;
      this.editForm.villageCode = this.adminUserInfo.villageCode;
    }
    this.getCardList();
    this.groupByVillages();
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
    // 获取组
    async groupByVillages() {
      const res = await this.$http.groupByVillage({
        villageCode: this.editForm.villageCode || "",
      });
      if (res.status === "success") {
        this.groupList = res.data;
      } else {
      }
    },
    //提交
    submitForm(formName) {
      // console.log(
      //   baseUrl +
      //     "jinshiintegrate/v1/w/person/getIntegralPersonList?villageCode=" +
      //     this.editForm.villageCode +
      //     "&areaCode=" +
      //     this.editForm.areaCode +
      //     "&streetCode=" +
      //     this.editForm.streetCode +
      //     "&exportType=" +
      //     this.editForm.exportType +
      //     "&cardId=" +
      //     this.editForm.cardId +
      //     "&integralId=" +
      //     this.editForm.integralId +
      //     "&timeType=" +
      //     this.editForm.timeType +
      //     "&num=" +
      //     this.editForm.num +
      //     "&NO_SIGN=N"
      // );
      // return;
      if (!this.editForm.streetCode) {
        this.isStreet = true;
      } else {
        this.isStreet = false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.editForm.streetCode) {
            this.isStreet = true;
            return false;
          } else {
            this.isStreet = false;
          }
          var exportType = 1;
          if (this.editForm.exportType) {
            exportType = 1;
          } else {
            exportType = 2;
          }
          window.open(
            baseUrl +
              "jinshiintegrate/v1/w/export/export?villageCode=" +
              this.editForm.villageCode +
              "&areaCode=" +
              this.editForm.areaCode +
              "&streetCode=" +
              this.editForm.streetCode +
              "&groupCode=" +
              this.editForm.groupCode +
              "&exportType=" +
              exportType +
              "&cardId=" +
              this.editForm.cardId +
              "&integralId=" +
              this.editForm.integralId +
              "&timeType=" +
              this.editForm.timeType +
              "&num=" +
              this.editForm.num +
              "&NO_SIGN=N",
            "_blank",
            ""
          );
        } else {
          this.$message.error("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    changeTown(val) {
      // this.isReset = false;
      this.editForm.areaCode = val.cityCode;
      this.editForm.streetCode = val.townCode;
      this.editForm.villageCode = val.villageCode;
      if (!this.editForm.streetCode) {
        this.isStreet = true;
      } else {
        this.isStreet = false;
      }
      this.groupByVillages();
    },
    //选择导出方式
    seleectExport(val) {
      this.editForm.num = "";
      //   if (val == 1) {
      //   } else if (val == 2) {
      //   } else if (val == 3) {
      //   }
      //   this.editForm.year=''
      //   this.editForm.quarter=''
      //   this.editForm.month=''
    },
    exportBtn() {
      window.open(
        baseUrl +
          "integratemall/v2/w/integral/exportPublic?villageCode=" +
          this.searchForm.villageCode +
          "&areaCode=" +
          this.searchForm.areaCode +
          "&streetCode=" +
          this.searchForm.streetCode +
          "&scene=" +
          this.searchForm.scene +
          "&sceneName=" +
          this.searchForm.sceneName +
          "&state=" +
          this.searchForm.state +
          "&name=" +
          this.searchForm.name +
          "&NO_SIGN=N",
        "_blank",
        ""
      );
    },
  },
};
</script>
<style lang='less'>
.exportIntegral {
  width: 60%;
  min-width: 800px;
  .provinceSelect {
    .el-form-item {
      float: left;
    }
    .el-select {
      width: 220px;
      display: inline-block;
    }
    .exports {
      .el-select {
        width: 120px;
        display: inline-block;
      }
    }
  }
}
</style>
