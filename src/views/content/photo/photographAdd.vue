<template>
  <div>
    <el-form ref="photoForm" :model="photoForm" :rules="discloseRules" label-width="130px" style="width: 60%;min-width: 800px">
      <el-form-item label="影集分类：" prop="type">
       <el-select v-model="photoForm.type" placeholder clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in tablist" :key="item.id" :label="item.tabName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片：" ref="picListRef" prop="picListUrls">
        <el-checkbox-group v-model="photoForm.picListUrls" v-show="false"></el-checkbox-group>
        <el-upload list-type="picture-card" :action="upLoadApiUrl" :data="uploadImgData" accept="image/jpeg, image/jpg, image/gif, image/png" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">建议尺寸为640*384像素，大小小于 2 MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片描述：" class="editor-item-con" prop="details">
        <el-input type="text"  v-model="photoForm.details"  placeholder="请输入50字以内的图片描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="submitForm('photoForm')" :disabled="isdisable" style="width: 150px;">确定发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { baseUrl } from "../../../config/env";
export default {
  name: "photographAdd",
  data() {
    return {
      photoForm: {
        type: "",
        picListUrls: "",
        details: "",
      },
      discloseRules: {
        type: [
          { required: true, message: "请选择信息类型", trigger: "change" },
        ],
        picListUrls: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        details: [
          {
            required: true,
            message: "请输入50字以内的图片描述",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "图片描述长度不得超过 50 字符",
            trigger: "blur",
          },
        ],
      },
      upLoadApiUrl:
        baseUrl+"commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      uploadImgData: {
        file: "",
        type: "2",
      },
      limitUploadNum: 1, // 上传限制
      fileImgList: [],
      isdisable: false,
      tablist:[],
      id:'',
      adminUserInfo:{}
    };
  },
  created() {
           this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
      this.getList()
      if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getListData();  
      this.$route.meta.title = "编辑";
    }else{
       this.$route.meta.title = "发布";
    }
  },
  methods: {
    // 获取影集tab分类
    async getList() {
      const res = await this.$http.getTabListById({
        id: 3,
      });
      if (res.status === "success") {
        this.tablist = res.data;
      } else {
      }
    },
      // 获取列表数据
    getListData() {
      this.$http
        .villageAlbumInfo({
          id: this.id,
        })
        .then((res) => {
          if (res && res.code == 0) {
            var resData = res.data || {};
            this.photoForm.details = resData[0].name;
            this.photoForm.type=resData[0].type
            if (resData[0].picUrl) {
              this.photoForm.picListUrls = 1;
              this.fileImgList = [
                {
                  url: resData[0].picUrl,
                  name: "",
                },
              ];
            }
            if (resData[0].backUrl) {
              this.photoForm.picListUrls2 = 1;
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
      const isLt4M = file.size / 1024 / 1024 <2;
      if (!isJPG) {
        this.$message.warning("上传图片只能是 jpg/jpeg/png/gif 格式!");
      }
      if (!isLt4M) {
        this.$message.warning("上传单个图片大小不能超过 2 MB!");
      }
      return isJPG && isLt4M;
    },
    // 上传图片完成
    handleUpLoadImgSuccess(res, file, fileList) {
      const picStatus = res.status || "error",
        picLink = res.data[0] || "";
      if (picStatus === "success" && picLink.length > 0) {
        this.fileImgList.push({
          name: file.name || picLink,
          url: picLink,
        });
        this.photoForm.picListUrls = picLink;
        this.$refs.picListRef.clearValidate();
      } else {
        this.$message.error(res.msg);
      }
    },
    // 删除图片
    async handleRemoveImg(file, fileList) {
      let imgUid = file.uid || 999999;
      let imgLink = file.url || "";
      var index = this.fileImgList.findIndex((item) => {
        if (item.uid === imgUid) {
          return true;
        }
      });
      if (index >= 0 && imgLink.length > 0) {
        // 改变资源
        this.fileImgList.splice(index, 1);
        this.photoForm.picListUrls = "";
      }
    },
   //发布
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   this.$alert("确定要提交该数据吗?", "提示", {
        //     confirmButtonText: "确定",
        //     cancelButtonText: "取消",
        //     type: "warning",
        //   })
        //     .then(async () => {
              this.isdisable = true;        
              if (this.id) {
                this.$http
                  .villageAlbumUpdate({
                    id: this.id,
                      name: this.photoForm.details,
                    type:this.photoForm.type,
                    introduction: this.photoForm.content,
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
                  .villageAlbumSave({
                    name: this.photoForm.details,
                    type:this.photoForm.type,
                    introduction: this.photoForm.content,
                    picUrl: this.fileImgList[0].url
                      ? this.fileImgList[0].url
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
            // })
            // .catch((_) => {});
        }
      });
    },
  },
};
</script>

<style lang="less">
</style>

