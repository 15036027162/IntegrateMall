<!--  -->
<template>
  <div class>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="区域选择：" v-show="this.deptLevel!=5">
        <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
      </el-form-item>
      <el-form-item label="处理状态：">
        <el-select v-model="searchForm.state" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option label="待审核" :value=1></el-option>
          <el-option label="审核通过" :value=2></el-option>
          <el-option label="审核未通过" :value=3></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分存折：">
        <el-select v-model="searchForm.cardId" placeholder="--请选择--" clearable>
          <el-option label="--请选择--" value></el-option>
          <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="积分明细：">
        <el-input v-model="searchForm.setName" placeholder="请输入积分明细" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="goSearch">查询</el-button>
        <el-button type="success" size="medium" @click="batchImport" v-if="isAuth('web:batch:import')&&deptLevel==5">批量导入</el-button>
        <el-button size="medium" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table border v-loading="dataListLoading" :data="dataList" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardName" label="积分存折"></el-table-column>
      <el-table-column prop="setName" label="积分明细"></el-table-column>
      <el-table-column prop="num" label="数量(人)"></el-table-column>
      <el-table-column prop="title" label="处理状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state == 1" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.state == 2" size="small" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.state == 3" size="small" type="danger">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间"></el-table-column>
      <el-table-column prop="creator" label="提交人"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" @click="handleView(scope.row,1)">查看</el-button>
            <el-button type="text" size="small" @click="handleView(scope.row,2)" style="color:#E6A23C" v-if="scope.row.state==1&&isAuth('web:batch:examine')">审核</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color:#F56C6C" v-if="scope.row.state==3&&isAuth('web:batch:delete')">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-size="pageSize" :total="totalPage" layout="total, prev, pager, next, jumper">
    </el-pagination>
    <!-- 批量导入积分 -->
    <el-dialog title="批量导入积分" :visible.sync="dialogFormVisible" width="500px" :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="积分存折：" prop="cardId">
          <el-select v-model="ruleForm.cardId" placeholder="--请选择--" @change="getIntegerList">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in integralList" :key="item.id" :label="item.cardName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分类别：" prop="integralId">
          <el-select v-model="ruleForm.integralId" placeholder="--请选择--" @change="getIntegralSetList">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in integralclassifyList" :key="item.id" :label="item.integralName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="积分明细：" prop="setName">
          <el-select v-model="ruleForm.setName" placeholder="请输入积分明细">
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in setNameList" :key="item.id" :label="item.setName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导入文件：" prop="picListUrls">
          <el-checkbox v-model="ruleForm.picListUrls" v-show="false">备选项</el-checkbox>
          <el-upload class="upload-demo" action="#" accept=".xls,.xlsx" :auto-upload="false" :on-remove="handleRemoveImg" :on-change="changeUpload" :before-upload="beforeAvatarUpload" :limit="limitUploadNum" :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">可多文件上传，支持pdf格式文件，单个文件不能超过{{limitMaxSize}}Mb</div> -->
          </el-upload>
        </el-form-item>
        <div>
          <span style="color:#409EFF;margin-right:40px;cursor: pointer" @click="godown(1)">下载积分模板1</span>
          <span style="color:#409EFF;cursor: pointer" @click="godown(2)">下载积分模板2（空白）</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goCancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isdisable">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from "../../../config/env";
import provinces from "../../../components/public/provinces";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    provinces,
  },
  data() {
    //这里存放数据
    return {
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataList: [],
      dataListLoading: true,
      searchForm: {
        cardId: "",
        setName: "",
        state: "",
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },
      ruleForm: {
        cardId: "",
        integralId: "",
        setName: "",
        picListUrls: "",
      },
      adminUserInfo: {},
      deptLevel: "", //部门层级 1省 2市 3区县 4乡镇街道 5村社区
      isReset: false,
      dialogFormVisible: false,
      upLoadApiUrl: baseUrl + "commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
      uploadImgData2: {
        file: "",
        type: "3",
      },
      rules: {
        cardId: [{ required: true, message: "请选择", trigger: "change" }],
        integralId: [{ required: true, message: "请选择", trigger: "change" }],
        setName: [{ required: true, message: "请选择", trigger: "change" }],
        picListUrls: [
          { required: true, message: "请上传文件", trigger: "change" },
        ],
      },
      limitUploadNum: 1,
      limitMaxSize: 2, // 文件大小
      fileList: [],
      integralList: [],
      integralclassifyList: [],
      setNameList: [],
      fileURL: "",
      isdisable: false,
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.searchForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 4) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    } else if (this.deptLevel == 5) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }
    this.getListData();
    this.getCardList();
  },
  //方法集合
  methods: {
    //下载模板
    godown(id) {
      window.open(
        baseUrl +
          "jinshiintegrate/v1/w/import/downloadExcel/" +
          id +
          "?NO_SIGN=N",
        "_blank",
        ""
      );
    },
    //查询
    goSearch() {
      this.pageIndex = 1;
      this.getListData();
    },

    //重置
    resetForm() {
      if (this.deptLevel == 3) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: "",
          villageCode: "",
          cardId: "",
          setName: "",
          state: "",
        };
      } else if (this.deptLevel == 4) {
        this.searchForm = {
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: "",
          cardId: "",
          setName: "",
          state: "",
        };
      } else if (this.deptLevel == 5) {
        this.searchForm = {
          cardId: "",
          setName: "",
          state: "",
          areaCode: this.searchForm.areaCode,
          streetCode: this.searchForm.streetCode,
          villageCode: this.searchForm.villageCode,
        };
      }
      this.isReset = true;
      this.pageIndex = 1;
      this.getListData();
    },
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
        cardId: this.ruleForm.cardId,
      });
      if (res.status === "success") {
        this.integralclassifyList = res.data;
      } else {
      }
    },
    // 获取积分类明细列表
    async getIntegralSetList() {
      const res = await this.$http.getIntegralSetList({
        cardId: this.ruleForm.cardId,
        integralId: this.ruleForm.integralId,
      });
      if (res.status === "success") {
        this.setNameList = res.data;
      } else {
      }
    },
    //批量导入
    batchImport() {
      this.dialogFormVisible = true;
    },
    changeTown(val) {
      this.isReset = false;
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
    },
    //删除
    handleDelete(item) {
      this.$confirm("删除后不可恢复，您确定要继续吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async (_) => {
          const res = await this.$http.batchOperate({
            name: this.adminUserInfo.name,
            id: item.id,
            operateType: 1,
            refuseReason: "",
          });
          if (res.code === "0") {
            this.$message({
              type: "success",
              message: res.msg,
            });
            this.getListData();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        })
        .catch((_) => {});
    },
    // 获取列表数据
    async getListData() {
      this.dataListLoading = true;
      const res = await this.$http.getIntegralBatchList({
        pageNo: this.pageIndex,
        pageSize: this.pageSize,
        cardId: this.searchForm.cardId ? this.searchForm.cardId : 0,
        state: this.searchForm.state ? this.searchForm.state : 0,
        setName: this.searchForm.setName,
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
      });
      if (res && res.code == 0) {
        this.dataList = res.data.list;
        this.totalPage = res.data.total;
      } else {
        this.dataList = [];
        this.totalPage = 0;
      }
      this.dataListLoading = false;
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getListData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getListData();
    },

    formatter(item) {
      if (item.state == 2) {
        return "待审核";
      } else if (item.state == 4) {
        return "审核通过";
      } else if (item.state == 4) {
        return "审核未通过";
      }
    },
    formatter1(item) {
      return this.$formatDateTime(item.createTime, "yyyy-MM-dd");
    },
    handleView(item, type) {
      if (type == 1) {
        this.$router.push({
          name: "integralHandleView",
          query: {
            type: 1,
            id: item.id,
          },
        });
      } else if (type == 2) {
        this.$router.push({
          name: "integralHandleView",
          query: {
            id: item.id,
            type: 2,
          },
        });
      }
    },
    //上传文件状态改变
    changeUpload(file, fileList) {
      const isIMAGE =
        file.raw.type === "application/vnd.ms-excel" ||
        file.raw.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;

      if (!isIMAGE) {
        this.$message.warning("上传文件只能是xlsx,xls格式!");
        return false;
      }
      if (!isLt4M) {
        this.$message.warning(
          "上传文件大小不能超过 " + this.limitMaxSize + "MB!"
        );
        return false;
      }
      this.fileURL = file.raw;
      this.fileList = fileList;
      this.ruleForm.picListUrls = fileList.length;
    },
    //取消
    goCancel(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
      this.fileList = [];
      this.ruleForm.picListUrls = "";
    },
    handleClose() {
      this.ruleForm = {
        cardId: "",
        integralId: "",
        setName: "",
        picListUrls: "",
      };
      this.fileList = [];
      if (this.dialogFormVisible) {
        this.$refs["ruleForm"].resetFields();
        this.dialogFormVisible = false;
      }
    },
    //确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this;
          this.isdisable = true;
          var data = new FormData();
          data.append("file", this.fileURL);
          data.append("name", this.adminUserInfo.name);
          data.append("cardId", this.ruleForm.cardId);
          data.append("integralId", this.ruleForm.integralId);
          data.append("integralSetId", this.ruleForm.setName);
          data.append("villageCode", this.adminUserInfo.villageCode);
          data.append("areaCode", this.adminUserInfo.areaCode);
          data.append("streetCode", this.adminUserInfo.streetCode);

          var request = new XMLHttpRequest();
          request.onreadystatechange = function () {
            if (request.readyState == 4) {
              try {
                var resp = JSON.parse(request.response); //判断结果
                console.log(resp);
                _this.isdisable = false;
                if (resp.code == "0") {
                  _this.$message({
                    type: "success",
                    message: resp.msg,
                  });
                  _this.dialogFormVisible = false;
                  _this.ruleForm.picListUrls = "";
                  _this.fileList = [];
                  // if (resp.data.length > 0) {
                  //   _this.gqfhlist = resp.data;
                  // }
                  _this.pageIndex = 1;
                  _this.getListData();
                } else {
                  _this.$message({
                    type: "error",
                    message: resp.msg,
                  });
                }
              } catch (e) {
                var resp = {
                  status: "error",
                  data: "Unknown error occurred: [" + request.message + "]",
                };
              }
            }
          };

          request.open("POST", baseUrl + "jinshiintegrate/v1/w/import/upload");
          request.send(data);
        } else {
          this.$message.warning("请修改表单提示区域内容后重新提交！");
          return false;
        }
      });
    },
    // 文件上传检测
    beforeAvatarUpload(file) {
      return;
      console.log("fffffff");
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls" || testmsg === "xlsx";
      // const extension2 = testmsg === "xlsx";
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning",
        });
      }
      const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
      console.log(this.limitMaxSize);
      if (!isLt4M) {
        this.$message.warning(
          "上传文件大小不能超过 " + this.limitMaxSize + "MB!"
        );
      }
      return extension && isLt4M;
    },

    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      const realNum = fileList.length || 0;
      console.log(realNum);
      if (realNum >= this.limitUploadNum) {
        this.$message.warning("最多只能上传" + this.limitUploadNum + "个文件!");
      }
    },
    // 删除图片
    async handleRemoveImg(file, fileList) {
      let imgLink = file.url || "";
      var index = this.fileList.findIndex((item) => {
        if (item.uid === file.uid) {
          return true;
        }
      });
      if (index >= 0) {
        this.fileList.splice(index, 1);
      }
      if (this.fileList.length == 0) {
        this.ruleForm.picListUrls = "";
      }
    },
  },
};
</script>
<style lang='less'>
</style>
