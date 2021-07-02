<template>
  <div class="addVillageIntroduction">
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="130px">
      <el-form-item label="背景图：" class="imgupload" prop="picListUrls">
        <el-checkbox v-model="editForm.picListUrls" v-show="false">备选项</el-checkbox>
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="乡村介绍：" prop="villageintroduce">
        <el-input v-model="editForm.villageintroduce" type="textarea" autosize placeholder="请输入乡村介绍" maxlength="200" show-word-limit></el-input>
      </el-form-item>

      <el-form-item label="乡村印象：" class="imgupload" prop="picListUrls3">
        <el-checkbox v-model="editForm.picListUrls3" v-show="false">备选项</el-checkbox>
        <template v-if="fileImgList3.length">
          <div v-for="(item,index) in fileImgList3" :key="index" class="videoDiv is-success">
            <video :src="item.picUrl"></video>
            <span class="uploaddiv1">
              <i class="el-icon-delete" @click="handleRemoveImg3(item,index)"></i>
            </span>
          </div>
        </template>
        <!-- :accept="'video/*'" -->
        <el-upload class="uploadimg" list-type="picture-card" :action="upLoadApiUrl" :data="uploadImgData2" :on-exceed="handleExceedImg3" :on-success="handleUpLoadImgSuccess3" :before-upload="beforeImgUpload3" :show-file-list="false" :limit="limitUploadNum3" :file-list="fileImgList3" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            请上传50M以内10分钟以内的乡村视频介绍，支持添加3个视频
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="isdisable" size="medium" @click="submitForm('editForm')" style="margin-right:40px;width:150px">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
export default {
  data() {
    return {
      editForm: {
        picListUrls: "", //背景图
        picListUrls3: "", //乡村印象
        villageintroduce: "", //乡村介绍
      },
      adminUserInfo: {},
      editRules: {
        picListUrls: [
          { required: true, message: "请上传背景图", trigger: "change" },
        ],

        picListUrls3: [
          { required: true, message: "请上传乡村印象视频", trigger: "change" },
        ],

        villageintroduce: [
          { required: true, message: "请输入乡村介绍", trigger: "blur" },
        ],
      },
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      uploadImgData: {
        file: "",
        type: "2",
      },
      uploadImgData2: {
        file: "",
        type: "4",
      },
      fileImgList: [], // 背景图
      limitUploadNum: 1,
      limitMaxSize: 2, // 文件大小

      fileImgList3: [], //乡村印象视频
      limitUploadNum3: 3,
      limitMaxSize3: 50, // 文件大小

      deptLevel: "",
      editorWordLength: 0,
      isdisable: false,
      villageCode: "",
      id: "",
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getListData();
    }
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.$http
        .introduceDetail({
          id: this.id,
        })
        .then((res) => {
          if (res && res.code == 0) {
            var resData = res.data || {};
            this.editForm.villageintroduce = resData[0].introduction; //村规民约
            if (resData[0].picUrl) {
              this.editForm.picListUrls = 1;
              this.fileImgList = [{ url: resData[0].picUrl, name: "" }]; //背景图
            }
            //乡村视频
            if (resData[0].impresses.length) {
              this.editForm.picListUrls3 = resData[0].impresses.length;
              this.fileImgList3 = resData[0].impresses;
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },

    //发布
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isdisable = true;
          if (this.id) {
            this.$http
              .introduceUpdate({
                id: this.id,
                introduction: this.editForm.villageintroduce,
                picUrl: this.fileImgList[0].url ? this.fileImgList[0].url : "",
                impresses: this.fileImgList3,
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
          "最多只能上传" + this.limitUploadNum + "张背景图!"
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
        this.$message.warning("上传背景图只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个背景图大小不能超过 " + this.limitMaxSize + "MB!"
        );
      }
      console.log(isJPG && isLt4M);
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
    //乡村印象视频
    // 文件超出个数限制时的钩子//乡村印象视频
    handleExceedImg3(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum3) {
        this.$message.warning(
          "最多只能上传" + this.limitUploadNum3 + "个视频!"
        );
      }
    },
    // 图片上传检测//乡村印象视频
    beforeImgUpload3(file) {
      const isJPG =
        ["mp4"].indexOf(
          file.name.split(".").pop()
        ) >= 0;

      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize3;
      if (!isJPG) {
        this.$message.warning(
          "上传视频只能是mp4格式!"
        );
        return false;
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个视频大小不能超过 " + this.limitMaxSize3 + "MB!"
        );
        return false;
      }

      let url = URL.createObjectURL(file);
      let audioElement = new Audio(url);
      var playTime;
      audioElement.addEventListener("loadedmetadata", (_event) => {
        playTime = audioElement.duration / 60 < 10;
        if (!playTime) {
          this.$message.warning("上传单个视频长度不能超过 " + 10 + "分钟!");
          return false;
        }
      });

      //return isJPG && isLt4M && playTime;
      //return isJPG && isLt4M;
    },

    // 上传图片完成//乡村印象视频
    handleUpLoadImgSuccess3(res, file, fileList) {
      if (res.status === "success" && res.data[0].length > 0) {
        this.fileImgList3.push({
          picUrl: res.data[0],
        });
        this.editForm.picListUrls3 = this.fileImgList3.length;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片//乡村印象视频
    async handleRemoveImg3(file, index) {
      //   let imgLink = file.url || "";
      //   var index = this.fileImgList3.findIndex((item) => {
      //     if (item.uid === file.uid) {
      //       return true;
      //     }
      //   });
      this.fileImgList3.splice(index, 1);
      //   if (index >= 0 && file.url.length > 0) {
      //     this.fileImgList3.splice(index, 1);
      //   }
      if (this.fileImgList3.length == 0) {
        this.editForm.picListUrls3 = "";
      }
    },

    //富文本图片上传成功
    uploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == "0") {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片
        quill.insertEmbed(length, "image", res.data[0]);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message("图片插入失败");
      }
    },
    // 富文本图片上传失败
    uploadError() {
      this.$message.error("图片插入失败");
    },
    // 返回
    onBackConfirm() {},
  },
};
</script>

<style lang="less">
.imgupload {
  position: relative;
}
.addVillageIntroduction {
  .el-textarea textarea {
    min-height: 200px !important;
  }
}

.infotype {
  .el-select {
    display: block;
  }
}
.ts {
  color: #909399;
  position: absolute;
  left: 178px;
  top: 39%;
  transform: translateY(-50%);
}
.editorWordNumber {
  position: absolute;
  bottom: -30px;
  right: 1px;
  width: auto;
  height: 24px;
  line-height: 24px;
  background: #fff;
  border-radius: 3px;
  padding: 0 1px;
  color: #666;
  font-size: 13px;
}
.editor-item-con {
  .ql-editor {
    min-height: 200px;
  }
}
.addFineFood {
  width: 60%;
  min-width: 800px;
  .el-select {
    display: block;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    display: block;
    width: 100%;
  }
}
.iconTitle {
  float: left;
  width: 146px;
  margin-right: 8px;
  position: relative;
}
.addVillageIntroduction {
  width: 60%;
  min-width: 800px;
  .el-upload-list--picture-card .el-upload-list__item {
    margin-bottom: 0;
  }
  .videoDiv {
    position: relative;
    float: left;
    width: 146px;
    height: 146px;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    overflow: hidden;
    margin-right: 8px;
    margin-bottom: 10px;
    video {
      width: 100%;
      height: 100%;
    }
  }
  .uploadimg {
    float: left;
  }
  .imgList {
    float: left;
    width: 146px;
    margin-right: 8px;
    .img {
      float: left;
      width: 146px;
      height: 146px;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      overflow: hidden;
      margin-right: 8px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .el-input {
      margin-bottom: 10px;
    }
  }
  .el-form-item__error1 {
    line-height: 15px;
    color: #fc3e0a !important;
    /* color: #F56C6C; */
    font-size: 12px;
    /* line-height: 1; */
    padding-top: 4px;
    position: absolute;
    top: 37px;
    left: 10px;
  }
  .uploaddiv1:hover {
    opacity: 1;
  }
  .uploaddiv1 {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    .el-icon-delete {
      font-size: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
  }
}
</style>
