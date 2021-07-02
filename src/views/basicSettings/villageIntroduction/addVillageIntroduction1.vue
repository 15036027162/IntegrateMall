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
      <el-form-item label="组织icon图片：" class="imgupload" prop="picListUrls2">
        <el-checkbox v-model="editForm.picListUrls2" v-show="false">备选项</el-checkbox>
        <template v-if="fileImgList2.length">
          <div v-for="(item,index) in fileImgList2" :key="index" class="imgList">
            <div class="img">
              <img :src="item.url" alt="">
            </div>
            <el-input placeholder="输入3-5个字的名称" :maxlength="5" :minlength="3" v-model="item.title" @blur="goTitle(item)"></el-input>
            <div class="el-form-item__error1" v-show="item.isTitle">请输入3-5个字的名称</div>
          </div>
        </template>
        <el-upload class="uploadimg" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg2" :on-remove="handleRemoveImg2" :on-success="handleUpLoadImgSuccess2" :before-upload="beforeImgUpload2" :show-file-list="false" :limit="limitUploadNum2" :auto-upload="true">
          <i class="el-icon-plus"></i>
        </el-upload>

      </el-form-item>
      <el-form-item label="乡村介绍：" prop="villageintroduce">
        <el-input v-model="editForm.villageintroduce" type="textarea" placeholder="请输入乡村介绍" maxlength="200" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="村规民约：" class="editor-item-con" prop="villagerules" ref="contentRef">
        <el-input v-model="editForm.villagerules" v-show="false"></el-input>
        <!-- 编辑器　替换　-->
        <!-- 图片上传组件辅助-->
        <el-upload class="avatar-uploader" v-show="false" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError"></el-upload>
        <quill-editor v-model="editForm.villagerules" ref="myQuillEditor" :options="editorOption" @change="onEditorChange()"></quill-editor>
        <div class="editorWordNumber">{{ editorWordLength }}/1000</div>
      </el-form-item>
      <el-form-item label="乡村印象：" class="imgupload" prop="picListUrls3">
        <el-checkbox v-model="editForm.picListUrls3" v-show="false">备选项</el-checkbox>
        <template v-if="fileImgList3.length">
          <div v-for="(item,index) in fileImgList3" :key="index" class="videoDiv">
            <video :src="item.url" controls></video>
          </div>
        </template>
        <el-upload class="uploadimg" list-type="picture-card" :accept="'video/*'" :action="upLoadApiUrl" :data="uploadImgData2" :on-exceed="handleExceedImg3" :on-remove="handleRemoveImg3" :on-success="handleUpLoadImgSuccess3" :before-upload="beforeImgUpload3" :show-file-list="false" :limit="limitUploadNum3" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            请上传50M以内的乡村视频介绍，支持添加3个视频
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="走进乡村：" class="imgupload" prop="picListUrls4">
        <el-checkbox v-model="editForm.picListUrls4" v-show="false">备选项</el-checkbox>
        <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg4" :on-remove="handleRemoveImg4" :on-success="handleUpLoadImgSuccess4" :before-upload="beforeImgUpload2" :file-list="fileImgList4" :limit="limitUploadNum4" :auto-upload="true">
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="iconTitle" v-for="(item,index) in fileImgList4" :key="index">
          <el-input placeholder="输入3-5个字的名称" :maxlength="5" :minlength="3" v-model="item.title" @blur="goTitle(item)"></el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isdisable" size="medium" @click="submitForm('editForm')" style="margin-right:40px">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
export default {
  data() {
    var validatecontent = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入村规民约(最多1000字)"));
      } else {
        var contents = this.removeTAG(this.editForm.villagerules);
        if (contents.length > 5000) {
          callback(new Error("请输入村规民约(最多5000字)"));
        } else {
          callback();
        }
      }
    };
    return {
      editForm: {
        picListUrls: "", //背景图
        picListUrls2: "", //组织icon
        picListUrls3: "", //乡村印象
        picListUrls4: "", //走进乡村
        villagerules: "", //村规民约
        villageintroduce: "", //乡村介绍
      },
      type: 1,
      id: "",
      details: {},
      adminUserInfo: {},
      editRules: {
        picListUrls: [
          { required: true, message: "请上传背景图", trigger: "change" },
        ],
        picListUrls2: [
          { required: true, message: "请上传组织icon", trigger: "change" },
        ],
        picListUrls3: [
          { required: true, message: "请上传乡村印象视频", trigger: "change" },
        ],
        picListUrls4: [
          { required: true, message: "请上传乡村特色图片", trigger: "change" },
        ],
        villagerules: [
          { required: true, validator: validatecontent, trigger: "change" },
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
      fileImgList2: [], //组织icon
      limitUploadNum2: 9,
      limitMaxSize2: 2, // 文件大小
      fileImgList3: [], //乡村印象视频
      limitUploadNum3: 3,
      limitMaxSize3: 50, // 文件大小
      fileImgList4: [], //走进乡村特色图片
      limitUploadNum4: 9,
      limitMaxSize4: 2, // 文件大小
      editorOption: {
        placeholder: "请输入村规民约(最多1000字)",
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
              [{ list: "ordered" }, { list: "bullet" }], //列表
              [{ script: "sub" }, { script: "super" }], // 上下标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文本方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
              [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
              [{ font: [] }], //字体
              [{ align: [] }], //对齐方式
              ["image"],
              ["clean"], //清除字体样式
            ],
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              },
            },
          },
        },
      },

      deptLevel: "",
      editorWordLength: 0,
      isdisable: false,
      villageCode: "",
    };
  },
  created() {
    if (this.$route.query.villageCode) {
      this.villageCode = this.$route.query.villageCode;
      this.getListData();
    }
  },
  methods: {
    // 编辑器文字变化
    onEditorChange() {
      var validatecontent = (rule, value, callback) => {
        if (value == "") {
          callback(new Error("请输入村规民约(最多1000字)"));
        } else {
          var contents = this.removeTAG(this.editForm.villagerules);
          if (contents.length > 1000) {
            callback(new Error("请输入村规民约(最多1000字)"));
          } else {
            callback();
          }
        }
      };
      var editorWord = this.removeTAG(this.editForm.villagerules) || "";
      this.editorWordLength = editorWord.length;
      if (this.editorWordLength > 0) {
        this.$refs.contentRef.clearValidate();
      } else {
        this.$set(this.editRules, "villagerules", {
          required: true,
          message: "请输入村规民约(最多1000字)",
          trigger: "change",
          validator: validatecontent,
        });
      }
    },
    //去除富文本标签
    removeTAG(str) {
      return str.replace(/<[^>]+>/g, "");
    },
    // 获取列表数据
    getListData() {
      this.$http
        .introduceDetail({
          villageCode: this.villageCode,
        })
        .then((res) => {
          if (res && res.code == 0) {
            var resData = res.data || {};
            this.details = resData[0];
            this.editForm.title = resData[0].title;
            this.editForm.picListUrls = 1;
            this.editForm.villagerules = resData[0].rule.content; //村规民约
            if (resData[0].picUrl) {
              this.fileImgList = [{ url: resData[0].picUrl, name: "1" }]; //背景图
            }
            //组织icon
            if (resData[0].organs.length) {
              this.fileImgList2 = resData[0].organs.map((val) => {
                return {
                  name: "",
                  url: val.icon,
                  title: val.name,
                  id: val.id,
                };
              });
            }
            //乡村视频
            if (resData[0].impresses.length) {
              this.fileImgList3 = resData[0].impresses.map((val) => {
                return {
                  name: "",
                  url: val.picUrl,
                  id: val.id,
                };
              });
            }
            //走进乡村
            if (resData[0].enters.length) {
              this.fileImgList4 = resData[0].enters.map((val) => {
                return {
                  name: "",
                  url: val.picUrl,
                  id: val.id,
                  title: val.name,
                };
              });
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //验证3-5的名称
    goTitle(item) {
      if (item.title == "" || item.title.length < 3) {
        item.isTitle = true;
      } else {
        item.isTitle = false;
      }
      this.$forceUpdate();
    },
    //发布
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$alert("确定要提交该数据吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              this.isdisable = true;
              if (this.id) {
                this.$http
                  .beauCountryUpdate({
                    id: this.id,
                    type: this.type,
                    title: this.editForm.title,
                    content: this.editForm.content,
                    picUrl: this.fileImgList[0].url
                      ? this.fileImgList[0].url
                      : "",
                  })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.$message({
                        type: "success",
                        message: res.msg,
                      });
                      setTimeout(() => {
                        if (this.type == 1) {
                          this.$router.push({
                            path: "mlxc-fineFood",
                          });
                        } else if (this.type == 2) {
                          this.$router.push({
                            path: "mlxc-specialLocalProduct",
                          });
                        } else if (this.type == 3) {
                          this.$router.push({
                            path: "mlxc-villageBeauty",
                          });
                        } else if (this.type == 4) {
                          this.$router.push({
                            path: "mlxc-historicalCorridor",
                          });
                        } else if (this.type == 5) {
                          this.$router.push({
                            path: "mlxc-culturalHeritage",
                          });
                        }
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
                  .beauCountrySave({
                    type: this.type,
                    title: this.editForm.title,
                    content: this.editForm.content,
                    picUrl: this.fileImgList[0].url
                      ? this.fileImgList[0].url
                      : "",
                  })
                  .then((res) => {
                    if (res && res.code == 0) {
                      this.$message({
                        type: "success",
                        message: res.msg,
                      });
                      setTimeout(() => {
                        if (this.type == 1) {
                          this.$router.push({
                            path: "mlxc-fineFood",
                          });
                        } else if (this.type == 2) {
                          this.$router.push({
                            path: "mlxc-specialLocalProduct",
                          });
                        } else if (this.type == 3) {
                          this.$router.push({
                            path: "mlxc-villageBeauty",
                          });
                        } else if (this.type == 4) {
                          this.$router.push({
                            path: "mlxc-historicalCorridor",
                          });
                        } else if (this.type == 5) {
                          this.$router.push({
                            path: "mlxc-culturalHeritage",
                          });
                        }
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
            })
            .catch((_) => {});
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
    //组织icon
    // 文件超出个数限制时的钩子//组织icon
    handleExceedImg2(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum2) {
        this.$message.warning(
          "最多只能上传" + this.limitUploadNum2 + "张组织icon!"
        );
      }
    },
    // 图片上传检测//组织icon
    beforeImgUpload2(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize2;
      if (!isJPG) {
        this.$message.warning("上传组织icon只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个组织icon大小不能超过 " + this.limitMaxSize2 + "MB!"
        );
      }
      return isJPG && isLt4M;
    },

    // 上传图片完成//组织icon
    handleUpLoadImgSuccess2(res, file, fileList) {
      if (res.status === "success" && res.data[0].length > 0) {
        this.fileImgList2.push({
          name: file.name || res.data[0],
          url: res.data[0],
          title: "",
        });
        this.editForm.picListUrls2 = this.fileImgList2.length;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片//组织icon
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
      const isJPG = [
        "video/mp4",
        "video/ogg",
        "video/flv",
        "video/avi",
        "video/wmv",
        "video/rmvb",
      ].indexOf(file.type);
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize3;
      if (isJPG == -1) {
        this.$message.warning(
          "上传视频只能是 mp4、ogg、flv、avi、wmv、rmvb 格式!"
        );
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个视频大小不能超过 " + this.limitMaxSize3 + "MB!"
        );
      }
      return isJPG && isLt4M;
    },

    // 上传图片完成//乡村印象视频
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
    // 删除图片//乡村印象视频
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

    //走进乡村特色图片
    // 文件超出个数限制时的钩子//走进乡村特色图片
    handleExceedImg4(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum4) {
        this.$message.warning(
          "最多只能上传" + this.limitUploadNum4 + "张乡村特色图片!"
        );
      }
    },
    // 图片上传检测//走进乡村特色图片
    beforeImgUpload4(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize4;
      if (!isJPG) {
        this.$message.warning("上传乡村特色图片只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传单个乡村特色图片大小不能超过 " + this.limitMaxSize4 + "MB!"
        );
      }
      return isJPG && isLt4M;
    },

    // 上传图片完成//走进乡村特色图片
    handleUpLoadImgSuccess4(res, file, fileList) {
      if (res.status === "success" && res.data[0].length > 0) {
        this.fileImgList4.push({
          name: file.name || res.data[0],
          url: res.data[0],
          title: "",
        });
        this.editForm.picListUrls4 = this.fileImgList4.length;
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片//走进乡村特色图片
    async handleRemoveImg4(file, fileList) {
      let imgLink = file.url || "";
      var index = this.fileImgList4.findIndex((item) => {
        if (item.uid === file.uid) {
          return true;
        }
      });
      if (index >= 0 && file.url.length > 0) {
        this.fileImgList4.splice(index, 1);
      }
      if (this.fileImgList4.length == 0) {
        this.editForm.picListUrls4 = "";
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
    onBackConfirm() {
      if (this.type == 1) {
        this.$router.push({
          path: "mlxc-fineFood",
        });
      } else if (this.type == 2) {
        this.$router.push({
          path: "mlxc-specialLocalProduct",
        });
      } else if (this.type == 3) {
        this.$router.push({
          path: "mlxc-villageBeauty",
        });
      } else if (this.type == 4) {
        this.$router.push({
          path: "mlxc-historicalCorridor",
        });
      } else if (this.type == 5) {
        this.$router.push({
          path: "mlxc-culturalHeritage",
        });
      }
    },
  },
};
</script>

<style lang="less">
.imgupload {
  position: relative;
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
}
</style>
