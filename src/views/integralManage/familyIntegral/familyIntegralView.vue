<!--  -->
<template>
  <div class="honorValuePonitView">
    <div class="formdiv">
      <div class="leftHeadImg div">
        <img src="../../../assets/img/u5451.png" alt />
      </div>
      <div class="div">
        <div class="formItems">户主姓名：{{ details.name || "无" }}</div>
        <div class="formItems">户主手机号：{{ details.mobile || "无" }}</div>

        <div class="formItems">户主身份证号：{{details.identity||"无"}}</div>

        <div class="formItems">
          家庭地址：{{ details.doorAddress||'无' }}
        </div>
        <div class="formItems" style="font-weight:bold;font-size:16px">
          家庭总分：{{ details.totalScore }}
          <span style="margin-left:60px">
             可用积分：{{ details.ableScore }}
          </span>
          <span style="margin-left:60px">
             已用积分：{{ details.usedScore }}
          </span>
        </div>
      </div>
      <!-- <div class="honorValue ">
        <div class="honorCon">{{ details.totalScore }}</div>
        <div>家庭总分</div>
      </div>
      <div class="honorValue div">
        <div class="honorCon">{{ details.ableScore }}</div>
        <div>可用积分</div>
      </div>
      <div class="honorValue div">
        <div class="honorCon">{{ details.usedScore }}</div>
        <div>已用积分</div>
      </div> -->
    </div>
    <el-table border :data="tableListData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="mobile" label="绑定手机号" ></el-table-column>
      <el-table-column prop="ssex" label="性别">
        <template slot-scope="scope">{{ scope.row.ssex == 1 ? "男" : "女"
          }}</template>
      </el-table-column>
      <el-table-column prop="isHousehold" label="与户主关系" :formatter="formatter2"></el-table-column>
      <el-table-column prop="joinTime" label="加入时间"></el-table-column>
      <el-table-column prop="totalScore" label="积分贡献"></el-table-column>
    </el-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
export default {
  //import引入的组件需要注入到对象中才能使用
  data() {
    //这里存放数据
    return {
      dialogFormVisible: false,
      htmlTitle: "页面导出PDF文件名",
      forms: {
        start: "",
        end: "",
      },
      form: {
        honorValue: "",
        ponits: "",
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      labelWidth: "90px",
      tableListData: [],
      listMain: {
        pageNo: 1,
        totalPage: 1,
        pageSize: 10,
        total: 0,
      },
      rules: {
        start: [
          {
            type: "date",
            required: true,
            message: "请选择开始日期",
            trigger: "change",
          },
        ],
        end: [
          {
            type: "date",
            required: true,
            message: "请选择结束日期",
            trigger: "change",
          },
        ],
      },
      doorMemberId: "",
      adminUserInfo: {},
      details: {},
      villageCode: "",
      doorNum: "",
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));

    if (this.$route.query.doorNum) {
      this.doorNum = this.$route.query.doorNum;
      this.getListData();
    }
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getIntegralFamilyInfo({
        doorNum: this.doorNum,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData;
        this.tableListData = resData.memberList || [];
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    //格式化身份证
    formatter(row) {
      if (row.identity) {
        var reg = /^(.{4})(?:\d+)(.{2})$/;
        return row.identity.replace(reg, "$1************$2");
      } else {
        return "无";
      }
    },
    formatter2(row) {
      var day = "";
      switch (Number(row.isHousehold)) {
        case 1:
          day = "户主";
          break;
        case 2:
          day = "配偶";
          break;
        case 3:
          day = "子女";
          break;
        case 4:
          day = "父母";
          break;
        case 5:
          day = "孙子孙女";
          break;
        case 6:
          day = "祖父母";
          break;
        case 7:
          day = "兄弟姐妹";
          break;
        case 8:
          day = "女婿儿媳";
          break;
        case 9:
          day = "其他";
          break;
      }
      return day;
    },
    formatter3(row) {
      var reg = /^(\d{3})\d*(\d{2})$/;
      if (row.mobile) {
        return row.mobile.replace(reg, "$1******$2");
      }
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
.honorValuePonitView {
  .formdiv {
    overflow: hidden;
    margin-bottom: 20px;
    .div {
      float: left;
      margin-right: 40px;
    }
  }
  .formItems {
    margin-bottom: 0;
    line-height: 30px;
  }
  .leftHeadImg {
    width: 160px;
    height: 160px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #ccc;
    }
    div {
      width: 128px;
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      background: #1cc2ac;
      border-radius: 4px;
      color: #fff;
      text-align: center;
      position: absolute;
      bottom: -10px;
      transform: translateX(-50%);
      left: 50%;
    }
  }
  .honorValue {
    font-size: 16px;
    text-align: center;
    font-weight: bold;

    div {
      margin: 0 auto;
    }
    .honorCon {
      width: 100px;
      height: 100px;

      margin-bottom: 10px;
      line-height: 100px;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: auto;
  }
}
</style>