<template>
  <div class="addgoods">
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
      <el-form-item label="区域选择：" required v-if="!id">
        <provinces @changeTown="changeTown" :isadd="true"></provinces>
        <br />
        <div v-if="showVill" style="color: #F56C6C;font-size: 12px">请选择到村</div>
      </el-form-item>
      <el-form-item label="区域选择：" required v-if="id && provinces">
        <provinces :provinces="provinces" :disableselect="true" :isadd="false"></provinces>
      </el-form-item>
      <el-form-item label="商品名称：" prop="goodsName">
        <el-input v-model="editForm.goodsName" placeholder="请输入10字以内的商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品价格：" prop="price">
        <el-input v-model="editForm.price" placeholder="请输入商品价格" @blur="countIntegral"></el-input>
      </el-form-item>
      <el-form-item label="商品数量：" prop="stock">
        <el-input v-model="editForm.stock" type="text" placeholder="请输入商品数量"></el-input>
      </el-form-item>
      <el-form-item label="兑换积分：" prop="changePoint">
        <el-input class="jfdh" v-model="editForm.changePoint" placeholder="请输入兑换积分" readonly="readonly"></el-input>
        <span class="ts" v-show="editForm.price">1积分={{unitMoney}}元</span>
      </el-form-item>
      <el-form-item label="商品图片：" prop="picListUrls">
        <el-checkbox v-model="editForm.picListUrls" v-show="false">备选项</el-checkbox>
        <el-upload list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" :disabled="isdisable" @click="submitForm('editForm')" style="width:150px">提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import provinces from "@/components/public/provinces1";
import { baseUrl } from "../../config/env";
import { validateUploadFileNum } from "../../config/validate";
import moment from "moment";
export default {
  components: { provinces },
  data() {
    //正整数
    var isNumber = (rule, value, callback) => {
      if (value == ""|| value == 0) {
        callback(new Error("请输入商品数量"));
      } else {
        const reg = /^\+?[1-9][0-9]*$/;//大于0的整数
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入整数"));
        }else{
          callback();
        }
        callback();
      }
    };
    //
    //正实数
    var isNumber2 = (rule, value, callback) => {
      if (value == "" ||value == 0) {
        callback(new Error("请输入商品价格"));
      } else {
         const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;//大于0的数，且最多两位小数
        // const reg = /^\d+(\.\d+)?$/;
        const rsCheck = reg.test(value);
        if (!rsCheck) {
          callback(new Error("请输入最多保留两位小数的数值"));
        }else{
          callback();
        }
        callback();
      }
    };
    return {
      editForm: {
        goodsName: "",
        price: "",
        stock: "",
        changePoint: "",
        picListUrls: "",
      },
      type: 1,
      id: "",
      details: {},
      editRules: {
        goodsName: [
          {
            required: true,
            min: 0,
            max: 10,
            message: "请输入10字以内的商品名称",
            trigger: "blur",
          },
        ],
        price: [
          {
            // required: true,
            // message: "请输入商品价格",
            validator: isNumber2,
            trigger: "blur",
             required: true,
          },
        ],
        stock: [
          {
            // required: true,
            // message: "请输入商品数量",
            validator: isNumber,
            trigger: "blur",
             required: true,
          },
        ],
        changePoint: [
          {
            required: true,
            message: "请输入兑换积分",
            trigger: "blur",
          },
        ],
        picListUrls: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
      },
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      fileImgList: [], // 图片
      uploadImgData: {
        file: "",
        type: "2",
      },
      removeImgAndFileIds: [], // 删除图片和附件资源ID
      limitUploadNum: 1,
      limitMaxSize: 4, // 文件大小
      fileDataList: [], // 附件
      uploadFileData: {
        file: "",
        type: "3",
      },
      limitFileUploadNum: 6,
      limitFileMaxSize: 50, // 文件大小
      pickerOptionsLimit: {
        disabledDate: (time) => {
          return time.getTime() > Date.now();
        },
      },
      editorWordLength: 0,
      isdisable: false,
      isPower: false,
      showVill: false,
      role_list: [],
      areaCode: "",
      streetCode: "",
      villageCode: "",
      areaName: "",
      streetName: "",
      villageName: "",
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      provinces: {},
      unitMoney: 0,
    };
  },
  watch: {
    // "villageCode"(val) {
    //   if (val) {
    //     this.showVill = false;
    //   } else {
    //     this.showVill = true;
    //   }
    // }
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.role_list = this.adminUserInfo.role_list;
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.areaCode = this.adminUserInfo.areaCode;
    this.areaName = this.adminUserInfo.areaName;
    if (this.deptLevel == 4) {
      this.streetCode = this.adminUserInfo.streetCode;
      this.streetName = this.adminUserInfo.streetName;
    } else if (this.deptLevel == 5) {
      this.streetCode = this.adminUserInfo.streetCode;
      this.streetName = this.adminUserInfo.streetName;
      this.villageCode = this.adminUserInfo.villageCode;
      this.villageName = this.adminUserInfo.villageName;
    }

    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.$route.meta.title = "编辑";
      this.getListData();
    } else {
      this.$route.meta.title = "新增";
    }
  },
  mounted() {},
  methods: {
    changeTown(val) {
      let _this = this;
      _this.areaCode = val.cityCode;
      _this.streetCode = val.townCode;
      _this.villageCode = val.villageCode;
      _this.areaName = val.cityName;
      _this.streetName = val.townName;
      _this.villageName = val.villageName;
      if (val.villageCode) {
        this.showVill = false;
      }
    },
    //积分和元的换算
    async countIntegral(val) {
      const res = await this.$http.calcExGoods({
        price: this.editForm.price || "",
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.editForm.changePoint = resData[0].changePoint;
        this.unitMoney = resData[0].unitMoney;
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    //跳转方式
    goway(val) {},
    // 获取列表数据
    async getListData() {
      const res = await this.$http.exGoodsInfo({
        goodsId: this.id || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.editForm.goodsName = resData[0].goodsName;
        this.editForm.price = resData[0].price;
        this.editForm.stock = resData[0].stock;
        this.editForm.changePoint = resData[0].changePoint;
        this.editForm.goodsName = resData[0].goodsName;

        this.editForm.picListUrls = 1;
        this.provinces = {
          areaCode: resData[0].areaCode,
          areaName: resData[0].areaName,
          streetCode: resData[0].streetCode,
          streetName: resData[0].streetName,
          villageCode: resData[0].villageCode,
          villageName: resData[0].villageName,
        };
        this.areaCode = resData[0].areaCode;
        this.streetCode = resData[0].streetCode;
        this.villageCode = resData[0].villageCode;
        this.areaName = resData[0].areaName;
        this.streetName = resData[0].streetName;
        this.villageName = resData[0].villageName;

        this.fileImgList = [
          {
            url: resData[0].picUrl,
            name: "1",
          },
        ];
        this.countIntegral();
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    //发布
    async submitForm(formName) {
      if (!this.villageCode) {
        this.showVill = true;
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.villageCode) {
            this.showVill = true;
            return false;
          } else {
            this.showVill = false;
            var obj;
            delete this.editForm.picListUrls;
            if (!this.id) {
              obj = {
                type: 1,
                picUrl: this.fileImgList[0].url,
                areaCode: this.areaCode,
                streetCode: this.streetCode,
                villageCode: this.villageCode,
                areaName: this.areaName,
                streetName: this.streetName,
                villageName: this.villageName,
                ...this.editForm,
              };
            } else {
              obj = {
                type: 0,
                goodsId: this.id,
                picUrl: this.fileImgList[0].url,
                 areaCode: this.areaCode,
                streetCode: this.streetCode,
                villageCode: this.villageCode,
                areaName: this.areaName,
                streetName: this.streetName,
                villageName: this.villageName,
                ...this.editForm,
              };
            }
            this.isdisable = true;
            const res = await this.$http.saveExGoods(obj);
            if (res.status === "success") {
              this.$message({
                type: "success",
                message: res.msg,
              });
              setTimeout(() => {
                this.$router.go(-1);
                this.isdisable = false;
              }, 1000);
            } else {
              this.$message({
                type: "error",
                message: res.msg,
              });
              setTimeout(() => {
                this.isdisable = false;
              }, 1000);
            }
          }
        } else {
          return false;
        }
      });
    },

    // 文件超出个数限制时的钩子
    handleExceedImg(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum) {
        this.$message.warning("最多只能上传" + this.limitUploadNum + "张图片!");
      }
    },
    // 图片上传检测
    beforeImgUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      if (!isJPG) {
        this.$message.warning("上传图片只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个图片大小不能超过 " + this.limitMaxSize + "MB!"
        );
      }
      return isJPG && isLt4M;
      return isJPG;
    },

    // 上传图片完成
    handleUpLoadImgSuccess(res, file, fileList) {
      if (res.status === "success" && res.data[0].length > 0) {
        this.fileImgList.push({
          name: file.name || res.data[0],
          url: res.data[0],
        });
        this.editForm.picListUrls = this.fileImgList.length;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片
    async handleRemoveImg(file, fileList) {
      let imgLink = file.url || "";
      var index = this.fileImgList.findIndex((item) => {
        if (item.uid === file.uid) {
          return true;
        }
      });
      if (index >= 0 && file.url.length > 0) {
        this.fileImgList.splice(index, 1);
      }
      if (this.fileImgList.length == 0) {
        this.editForm.picListUrls = "";
      }
    
    },

    // 返回
    onBackConfirm() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.addgoods {
  width: 60%;
  min-width: 800px;
  .ts {
    font-size: 12px;
    color: #606266;
  }
  .jfdh {
    display: inline-block;
    width: 80%;
    margin-right: 10px;
  }
}
</style>
