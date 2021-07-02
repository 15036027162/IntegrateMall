<!--  -->
<template>
  <div class="userView">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="账号信息" name="first">
        <div class="viewItem">
          <span class="labeltext">用户头像：</span>
           <div class="content">
            <img v-if="familyInfo.avatar" :src="familyInfo.avatar" alt style="height:100px"/>
            <img v-else src="../../../assets/img/u6.png" alt style="height:100px"/>
          </div>
        </div>
        <div class="viewItem">
          <span class="labeltext">用户名：</span>
           <div class="content">{{ familyInfo.account }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">绑定手机：</span>
           <!-- <div class="content">{{ formatter4(familyInfo)?formatter4(familyInfo):'--' }}</div> -->
            <div class="content">{{ familyInfo.mobile?familyInfo.mobile:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">实名状态：</span>
           <div class="content">{{ familyInfo.identityWay == '1' ? "已实名" : "未实名" }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">姓名：</span>
           <div class="content">{{ formatter5(familyInfo)?formatter5(familyInfo):'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">身份证号：</span>
           <div class="content">{{familyInfo.identity?familyInfo.identity:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">注册渠道：</span>
           <div class="content">
            {{ familyInfo.registerPlatform == '5' ? "后台注册" : "App注册" }}
          </div>
        </div>
        <div class="viewItem">
          <span class="labeltext">注册时间：</span>
           <div class="content">{{ familyInfo.createTime?familyInfo.createTime:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">最后登录时间：</span>
           <div class="content">{{ familyInfo.loginTime?familyInfo.loginTime:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">账号状态：</span>
           <div class="content">{{ familyInfo.inEnable == '1' ? "已禁用" : "正常" }}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="个人信息" name="second">
        <div class="viewItem">
          <span class="labeltext">用户名：</span>
           <div class="content">{{ familyInfo.account }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">性别：</span>
           <div class="content">{{ familyInfo.ssex == '1' ? "男" : "女" }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">出生日期：</span>
           <div class="content">{{ familyInfo.birth?familyInfo.birth:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">政治面貌：</span>
           <div class="content">{{ formatter3(familyInfo)?formatter3(familyInfo):'--'  }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">文化程度：</span>
           <div class="content">{{ formatter6(familyInfo)?formatter6(familyInfo):'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">婚姻状态：</span>
           <div class="content">{{ formatter1(familyInfo)?formatter1(familyInfo):'--' }}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="组织信息" name="third">
        <div class="viewItem">
          <span class="labeltext">用户名：</span>
           <div class="content">{{ familyInfo.account }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">所在村社：</span>
           <div class="content">
            {{ familyInfo.areaName }}-{{ familyInfo.streetName }}-{{familyInfo.villageName }}
          </div>
        </div>
        <div class="viewItem">
          <span class="labeltext">所在分组：</span>
           <div class="content">{{ familyInfo.groupName?familyInfo.groupName:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">所属家庭：</span>
           <div class="content">{{ familyInfo.houseNumber?familyInfo.houseNumber+'号':'--' }}
            <template v-if="familyInfo.doorName">
              ({{familyInfo.doorName?familyInfo.doorName+'家':'--' }})
            </template>
          </div>
        </div>
        <div class="viewItem">
          <span class="labeltext">与户主关系：</span>
           <div class="content">{{ formatter2(familyInfo)?formatter2(familyInfo):'--'  }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">区划组织：</span>
           <div class="content">{{ familyInfo.district?familyInfo.district:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">部门职位：</span>
           <div class="content">{{familyInfo.position?familyInfo.position:'--' }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">联系电话：</span>
           <div class="content">{{ familyInfo.linkMobile?familyInfo.linkMobile:'--'  }}</div>
        </div>
        <div class="viewItem">
          <span class="labeltext">操作角色：</span>
           <div class="content">{{ list }}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      activeName: "first",
      editMemberId: "",
      familyInfo: {},
      marriageList: [
        {
          name: "已婚",
          code: 1,
        },
        {
          name: "未婚",
          code: 2,
        },
        {
          name: "离异",
          code: 3,
        },
        {
          name: "离异后与前任住在一起",
          code: 4,
        },
        {
          name: "丧偶",
          code: 5,
        },
        {
          name: "--",
          code: 6,
        },
      ],
      genderList: [
        {
          name: "男",
          code: "1",
          disabled: false,
        },
        {
          name: "女",
          code: "0",
          disabled: false,
        },
      ],
      eduList: [
        {
          name: "小学及以下",
          code: 1,
          disabled: false,
        },
        {
          name: "初中",
          code: 2,
          disabled: false,
        },
        {
          name: "高中",
          code: 3,
          disabled: false,
        },
        {
          name: "大学专科",
          code: 4,
          disabled: false,
        },
        {
          name: "研究生",
          code: 5,
          disabled: false,
        },
        {
          name: "博士及以上",
          code: 6,
          disabled: false,
        },
      ],
      politicsFaceList: [
        {
          name: "党员",
          code: 1,
          disabled: false,
        },
        {
          name: "预备党员",
          code: 2,
          disabled: false,
        },
        {
          name: "共青团员",
          code: 3,
          disabled: false,
        },
        {
          name: "无党派人士",
          code: 4,
          disabled: false,
        },
        {
          name: "港澳同胞",
          code: 5,
          disabled: false,
        },
        {
          name: "群众",
          code: 6,
          disabled: false,
        },
        {
          name: "其他",
          code: 7,
          disabled: false
        }
      ],
      list: "",
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.editMemberId) {
      this.editMemberId = this.$route.query.editMemberId;
      this.getListData();
    }
  },
  //方法集合
  methods: {
    handleClick(tab, event) {},
    //格式化手机号
    formatter4(row) {
      var reg = /^(\d{3})\d*(\d{4})$/;
      if (row.mobile) {
        return row.mobile.replace(reg, "$1****$2");
      }
    },
    //身份证号码
    formatter(row) {
      var reg = /^(.{4})(?:\d+)(.{2})$/;
      if (row.identity) {
        return row.identity.replace(reg, "$1************$2");
      }
    },
    //婚姻
    formatter1(row) {
      var index = this.marriageList.findIndex((val) => {
        return val.code == row.marriage;
      });
      if (index != -1) {
        return this.marriageList[index].name;
      }
    },
    //党员
    formatter3(row) {
      var index = this.politicsFaceList.findIndex((val) => {
        return val.code == row.politicsFace;
      });
      if (index != -1) {
        return this.politicsFaceList[index].name;
      }
    },
    //姓名
    formatter5(row) {
      if (row.name) {
        return row.name.substr(0, 1) + new Array(row.name.length).join("*");
      }
    },
    //文化程度
    formatter6(row) {
      if (row.eduBackground) {
        var index = this.eduList.findIndex((val) => {
          return val.code == row.eduBackground;
        });
        if (index != -1) {
          return this.eduList[index].name;
        }
      }
    },

    // 获取列表数据
    async getListData() {
      const res = await this.$http.membergetById({
        editMemberId: this.editMemberId,
      });
      if (res.status === "success") {
        this.familyInfo = res.data[0];
        if (res.data[0].list.length > 0) {
          var arr = res.data[0].list.map((val) => {
            return val.roleName;
          });
          this.list = arr.join(",");
        } else {
          this.list = "--";
        }
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    formatter2(row) {
      var day = "";
      switch (row.isHousehold) {
        case "1":
          day = "户主";
          break;
        case "2":
          day = "配偶";
          break;
        case "3":
          day = "子女";
          break;
        case "4":
          day = "父母";
          break;
        case "5":
          day = "孙子孙女";
          break;
        case "6":
          day = "祖父母";
          break;
        case "7":
          day = "兄弟姐妹";
          break;
        case "8":
          day = "女婿儿媳";
          break;
        case "9":
          day = "--";
          break;
        default:
          day = "--";
      }
      return day;
    },
  },
};
</script>
<style lang='less'>
//@import url(); 引入公共css类
</style>
