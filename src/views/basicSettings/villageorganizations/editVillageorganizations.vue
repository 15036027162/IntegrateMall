<!--  -->
<template>
  <div class='editVillageorganizations'>
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="140px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入3-5个字的名称" :maxlength="5" :minlength="3"></el-input>
      </el-form-item>
      <el-form-item label="组织icon图：" class="imgupload" prop="picListUrls">
        <el-checkbox v-model="editForm.picListUrls" v-show="false">备选项</el-checkbox>
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="组织背景图：" class="imgupload" prop="picListUrls2">
        <el-checkbox v-model="editForm.picListUrls2" v-show="false">备选项</el-checkbox>
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg2" :on-remove="handleRemoveImg2" :on-success="handleUpLoadImgSuccess2" :before-upload="beforeImgUpload2" :file-list="fileImgList2" :limit="limitUploadNum2" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="组织介绍：" prop="content">
        <el-input v-model="editForm.content" type="textarea" placeholder="请输入组织介绍" maxlength="500" autosize  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="组织结构图：" class="imgupload" prop="picListUrls3">
        <el-checkbox v-model="editForm.picListUrls3" v-show="false">备选项</el-checkbox>
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg3" :on-remove="handleRemoveImg3" :on-success="handleUpLoadImgSuccess3" :before-upload="beforeImgUpload3" :file-list="fileImgList3" :limit="limitUploadNum3" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
          </div>
        </el-upload>
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
import { baseUrl } from "../../../config/env";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      editForm: {
        name: "",
        picListUrls: "", //图片张数
        picListUrls2: "", //图片张数
        picListUrls3: "", //图片张数
        content: "",
      },
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      fileImgList: [], // 图片
      uploadImgData: {
        file: "",
        type: "2",
      },
      limitUploadNum: 1,
      limitMaxSize: 2, // 文件大小
      fileImgList: [],
      limitUploadNum2: 1,
      limitMaxSize2: 2, // 文件大小
      fileImgList2: [],
      limitUploadNum3: 1,
      limitMaxSize3: 2, // 文件大小
      fileImgList3: [],
      editRules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
            max: 5,
            min: 3,
          },
        ],
        picListUrls: [
          { required: true, message: "请上传组织icon图", trigger: "change" },
        ],
        picListUrls2: [
          { required: true, message: "请上传背景图", trigger: "change" },
        ],
        picListUrls3: [
          { required: true, message: "请上传组织结构图", trigger: "change" },
        ],

        content: [
          {
            required: true,
            message: "请输入组织介绍",
            trigger: "blur",
          },
        ],
      },
      isdisable: false, //防重复提交
      adminUserInfo: {},
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
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
    // 获取列表数据
    getListData() {
      this.$http
        .villageOrganizeInfo({
          id: this.id,
        })
        .then((res) => {
          if (res && res.code == 0) {
            var resData = res.data || {};
            this.editForm.name = resData[0].name;
            this.editForm.content = resData[0].introduction; //村规民约
            if (resData[0].icon) {
              this.fileImgList = [{ url: resData[0].icon, name: "" }]; //组织icon
              this.editForm.picListUrls = 1;
            }
            if (resData[0].picUrl) {
              this.fileImgList2 = [{ url: resData[0].picUrl, name: "" }]; //背景图
              this.editForm.picListUrls2 = 1;
            }
            if (resData[0].structeUrl) {
              this.fileImgList3 = [{ url: resData[0].structeUrl, name: "" }]; //组织结构图
              this.editForm.picListUrls3 = 1;
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isdisable = true;
          if (this.id) {
            this.$http
              .villageOrganizeUpdate({
                id: this.id,
                name: this.editForm.name,
                introduction: this.editForm.content,
                icon: this.fileImgList[0].url ? this.fileImgList[0].url : "",
                picUrl: this.fileImgList2[0].url
                  ? this.fileImgList2[0].url
                  : "",
                structeUrl: this.fileImgList3[0].url
                  ? this.fileImgList3[0].url
                  : "",
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
              .villageOrganizeSave({
                name: this.editForm.name,
                introduction: this.editForm.content,
                icon: this.fileImgList[0].url ? this.fileImgList[0].url : "",
                picUrl: this.fileImgList2[0].url
                  ? this.fileImgList2[0].url
                  : "",
                structeUrl: this.fileImgList3[0].url
                  ? this.fileImgList3[0].url
                  : "",
                areaCode: this.adminUserInfo.areaCode,
                areaName: this.adminUserInfo.areaName,
                streetCode: this.adminUserInfo.streetCode,
                streetName: this.adminUserInfo.streetName,
                villageCode: this.adminUserInfo.villageCode,
                villageName: this.adminUserInfo.villageName,
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
    // 文件超出个数限制时的钩子
    handleExceedImg(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum) {
        this.$message.warning(
          "最多只能上传" + this.limitUploadNum + "张组织icon图!"
        );
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
        this.$message.warning("上传组织icon图只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个组织icon图大小不能超过 " + this.limitMaxSize + "MB!"
        );
      }
      return isJPG && isLt4M;
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
    // 文件超出个数限制时的钩子
    handleExceedImg2(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum2) {
        this.$message.warning(
          "最多只能上传" + this.limitUploadNum2 + "张背景图!"
        );
      }
    },
    // 图片上传检测
    beforeImgUpload2(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize2;
      if (!isJPG) {
        this.$message.warning("上传背景图只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个背景图大小不能超过 " + this.limitMaxSize2 + "MB!"
        );
      }
      return isJPG && isLt4M;
    },
    // 上传图片完成
    handleUpLoadImgSuccess2(res, file, fileList) {
      if (res.status === "success" && res.data[0].length > 0) {
        this.fileImgList2.push({
          name: file.name || res.data[0],
          url: res.data[0],
        });
        this.editForm.picListUrls2 = this.fileImgList2.length;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片
    async handleRemoveImg2(file, fileList) {
      let imgLink = file.url || "";
      var index = this.fileImgList2.findIndex((item) => {
        if (item.uid === file.uid) {
          return true;
        }
      });
      if (index >= 0 && file.url.length > 0) {
        this.fileImgList2.splice(index, 1);
      }
      if (this.fileImgList2.length == 0) {
        this.editForm.picListUrls2 = "";
      }
    },

    // 文件超出个数限制时的钩子
    handleExceedImg3(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum3) {
        this.$message.warning(
          "最多只能上传" + this.limitUploadNum3 + "张组织结构图!"
        );
      }
    },
    // 图片上传检测
    beforeImgUpload3(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize3;
      if (!isJPG) {
        this.$message.warning("上传组织结构图只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个组织结构图大小不能超过 " + this.limitMaxSize3 + "MB!"
        );
      }
      return isJPG && isLt4M;
    },
    // 上传图片完成
    handleUpLoadImgSuccess3(res, file, fileList) {
      if (res.status === "success" && res.data[0].length > 0) {
        this.fileImgList3.push({
          name: file.name || res.data[0],
          url: res.data[0],
        });
        this.editForm.picListUrls3 = this.fileImgList3.length;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片
    async handleRemoveImg3(file, fileList) {
      let imgLink = file.url || "";
      var index = this.fileImgList3.findIndex((item) => {
        if (item.uid === file.uid) {
          return true;
        }
      });
      if (index >= 0 && file.url.length > 0) {
        this.fileImgList3.splice(index, 1);
      }
      if (this.fileImgList3.length == 0) {
        this.editForm.picListUrls3 = "";
      }
    },
  },
};
</script>
<style lang='less'>
.editVillageorganizations {
  
  width: 60%;
  min-width: 800px;
  .el-textarea textarea {
  min-height: 200px!important;
}
  .range {
    text-align: center;
    .el-select {
      display: block;
    }
  }
}
</style>
