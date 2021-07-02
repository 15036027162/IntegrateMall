<template>
  <div class="editIntegralRule">
    <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="120px">
      <el-form-item label="村规民约：" class="editor-item-con" prop="content" ref="contentRef">
        <!-- 编辑器　替换　-->
        <!-- 图片上传组件辅助-->
        <el-input v-model="editForm.content" v-show="false"></el-input>
        <el-upload class="avatar-uploader" v-show="false" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError"></el-upload>
        <quill-editor v-model="editForm.content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange()"></quill-editor>
        <div class="editorWordNumber">{{ editorWordLength }}/1000</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isdisable" size="medium" @click="submitForm('editForm')" style="margin-right:40px;width:150px;">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
export default {
  data() {
    var validatecontent = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入正文(最多1000字)"));
      } else {
        var contents = this.editForm.content;
        contents = this.removeTAG(contents);
        if (contents.length > 1000) {
          callback(new Error("请输入正文(最多1000字)"));
        } else {
          callback();
        }
      }
    };
    return {
      editForm: {
        content: "",
      },
      id: "",
      adminUserInfo: {},
      editRules: {
        content: [
          { required: true, validator: validatecontent, trigger: "change" },
        ],
      },
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      uploadImgData: {
        file: "",
        type: "3",
      },
      limitMaxSize: 2,
      limitUploadNum: 3,
      fileList: [],
      editorOption: {
        placeholder: "请输入正文(最多1000字)",
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
      adminUserInfo: {},
    };
  },
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
  methods: {
    // 编辑器文字变化
    onEditorChange() {
      var validatecontent = (rule, value, callback) => {
        if (value == "") {
          callback(new Error("请输入正文(最多1000字)"));
        } else {
          var contents = this.removeTAG(this.editForm.content);
          if (contents.length > 1000) {
            callback(new Error("请输入正文(最多1000字)"));
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
          message: "请输入正文(最多1000字)",
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
        .villageRuleInfo({
          id: this.id,
        })
        .then((res) => {
          if (res && res.code == 0) {
            var resData = res.data || {};
            this.editForm.content = resData[0].content;
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
              .villageRuleUpdate({
                id: this.id,
                content: this.editForm.content,
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
              .villageRuleSave({
                content: this.editForm.content,
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

    //富文本图片上传成功
    uploadSuccess(res, file) {
      console.log("tttut");
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
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      const realNum = fileList.length || 0;
      if (realNum >= this.limitUploadNum) {
        this.$message.warning("最多只能上传" + this.limitUploadNum + "个附件!");
      }
    },

    // 返回
    onBackConfirm() {},
  },
};
</script>

<style lang="less">
.editIntegralRule {
  width: 60%;
  min-width: 800px;
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
      min-height: 400px;
    }
  }
}
</style>
