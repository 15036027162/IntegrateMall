<template>
  <div class="addEnterVillage">
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="150px">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入3-5个字的名称" :maxlength="5" :minlength="3"></el-input>
      </el-form-item>
      <el-form-item label="乡村特色icon图片："  prop="picListUrls">
        <el-checkbox v-model="editForm.picListUrls" v-show="false">备选项</el-checkbox>
        <el-upload  list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景图："  prop="picListUrls2">
        <el-checkbox v-model="editForm.picListUrls2" v-show="false">备选项</el-checkbox>
        <el-upload  list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg2" :on-remove="handleRemoveImg2" :on-success="handleUpLoadImgSuccess2" :before-upload="beforeImgUpload2" :file-list="fileImgList2" :limit="limitUploadNum2" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="特色介绍：" class="editor-item-con" prop="content" ref="contentRef">
        <el-input v-model="editForm.content" v-show="false"></el-input>
        <!-- 编辑器　替换　-->
        <!-- 图片上传组件辅助-->
        <el-upload class="avatar-uploader" v-show="false" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError"></el-upload>
        <quill-editor v-model="editForm.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange()"></quill-editor>
        <div class="editorWordNumber">{{ editorWordLength }}/5000</div>
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
    var validatecontent = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入特色介绍(最多5000字)"));
      } else {
        var contents = this.removeTAG(this.editForm.content);
        if (contents.length > 5000) {
          callback(new Error("请输入特色介绍(最多5000字)"));
        } else {
          callback();
        }
      }
    };
    return {
      editForm: {
        name: "",
        picListUrls: "",
        picListUrls2: "",
        content: "",
      },
      type: 1,
      id: "",
      details: {},
      adminUserInfo: {},
      editRules: {
        picListUrls: [
          { required: true, message: "请上传乡村特色icon", trigger: "change" },
        ],
        picListUrls2: [
          { required: true, message: "请上传背景图", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入图片", trigger: "blur" }],
        content: [
          { required: true, validator: validatecontent, trigger: "change" },
        ],
      },
      upLoadApiUrl:
       baseUrl+"commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口

      uploadImgData: {
        file: "",
        type: "2",
      },
      fileImgList: [], // 乡村特色icon图
      limitUploadNum: 1, //乡村特色icon图
      limitMaxSize: 2, // 乡村特色icon图
      fileImgList2: [], // 背景图
      limitUploadNum2: 1, //背景图
      limitMaxSize2: 2, // 背景图
      editorOption: {
        placeholder: "请输入特色介绍(最多5000字)",
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
      adminUserInfo:{}
    };
  },
  created() {
     this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getListData();  
      this.$route.meta.title = "编辑";
    }else{
       this.$route.meta.title = "新增";
    }
   
  },
  methods: {
    // 编辑器文字变化
    onEditorChange() {
      var validatecontent = (rule, value, callback) => {
        if (value == "") {
          callback(new Error("请输入特色介绍(最多5000字)"));
        } else {
          var contents = this.removeTAG(this.editForm.content);
          if (contents.length > 5000) {
            callback(new Error("请输入特色介绍(最多5000字)"));
          } else {
            callback();
          }
        }
      };
      var editorWord = this.removeTAG(this.editForm.content) || "";
      this.editorWordLength = editorWord.length;
      if (this.editorWordLength > 0) {
        this.$refs.contentRef.clearValidate();
      } else {
        this.$set(this.editRules, "content", {
          required: true,
          message: "请输入特色介绍(最多5000字)",
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
        .villageEnterInfo({
          id: this.id,
        })
        .then((res) => {
          if (res && res.code == 0) { 
            var resData = res.data || {};
            this.editForm.name = resData[0].name;
            this.editForm.content = resData[0].introduction;
            if (resData[0].picUrl) {
              this.editForm.picListUrls = 1;
              this.fileImgList = [
                {
                  url: resData[0].picUrl,
                  name: "",
                },
              ];
            }
            if (resData[0].backUrl) {
              this.editForm.picListUrls2 = 1;
              this.fileImgList2 = [
                {
                  url: resData[0].backUrl,
                  name: "",
                },
              ];
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
                  .villageEnterUpdate({
                    id: this.id,
                    name: this.editForm.name,
                    introduction: this.editForm.content,
                    picUrl: this.fileImgList[0].url
                      ? this.fileImgList[0].url
                      : "",
                    backUrl: this.fileImgList2[0].url
                      ? this.fileImgList2[0].url
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
                  .villageEnterSave({
                    name: this.editForm.name,
                    introduction: this.editForm.content,
                    picUrl: this.fileImgList[0].url
                      ? this.fileImgList[0].url
                      : "",
                    backUrl: this.fileImgList2[0].url
                      ? this.fileImgList2[0].url
                      : "",
                       areaCode:this.adminUserInfo.areaCode,
                      areaName:this.adminUserInfo.areaName,
                      streetCode:this.adminUserInfo.streetCode,
                      streetName:this.adminUserInfo.streetName,
                      villageCode:this.adminUserInfo.villageCode,
                      villageName:this.adminUserInfo.villageName,
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
      
    },
  },
};
</script>

<style lang="less">
.addEnterVillage{
.editor-item-con {
  .ql-editor {
    min-height: 300px;
  }
}
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

.addEnterVillage {
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
</style>
