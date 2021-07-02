<!--  -->
<template>
  <div class="wrap">
    <top-header></top-header>
    <left-menu></left-menu>
    <div class="rightcontent" :class="{ hideSidebars: isCollapse }">
      <div class="contents">
        <bread-crumb v-show="$route.name!='home'"></bread-crumb>
        <el-main>
          <router-view />
        </el-main>
      </div>
    </div>
  </div>
</template>

<script>
import leftMenu from "../components/leftMenu";
import breadCrumb from "../components/breadcrum";
import topHeader from "../components/topHeader";
import { mapState, mapMutations } from "vuex";
export default {
  components: { leftMenu, breadCrumb, topHeader },
  data() {
    //这里存放数据
    return {};
  },
  created() {
    this.getMenu();
  },
  computed: {
    ...mapState([
      "leftMenu",
      "leftMenuActiveName",
      "keepPageTabs",
      "isCollapse",
      "keepAlive"
    ])
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        let meta = to.meta || {};
        let currentRouteName = to.name; // 当前路由 name
        let originRouteName = currentRouteName; // 顶级菜单路由名称
        //更新leftMenuActiveName
        if (meta.activeMenu) {
          this.updateleftMenuActiveName(meta.activeMenu);
        } else {
          this.updateleftMenuActiveName(originRouteName);
        }
        let matched = this.$route.matched.filter(
          item => item.meta && item.meta.title
        );
        var levelList = matched.filter(item => item.meta && item.meta.title);
        this.updateBreadcrumb(levelList); //面包屑
      }
    }
  },
  //方法集合
  methods: {
    ...mapMutations([
      "updateLeftMenu",
      "updateleftMenuActiveName",
      "updateKeepPageTabs",
      "updateBreadcrumb",
      "updateTopMenu",
      "updateAllMenuList",
      "updateTopMenuActiveName"
    ]),
    // 路由菜单
    async getMenu() {
      let menuList = [];
      // menuList = [
      //   {
      //     name: "首页",
      //     url: "home",
      //     icon: "system",
      //     children: []
      //   },
      //   {
      //     name: "积分管理",
      //     routeName: "integralRegister",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "积分登记",
      //         url: "integralRegister",
      //         icon: "system"
      //       },
      //       {
      //         name: "积分批量处理",
      //         url: "integralHandle",
      //         icon: "system"
      //       },
      //       {
      //         name: "积分公示列表",
      //         url: "integralPublicity",
      //         icon: "system"
      //       },
      //       {
      //         name: "个人积分",
      //         url: "personalIntegral",
      //         icon: "system"
      //       },
      //       {
      //         name: "家庭积分",
      //         url: "familyIntegral",
      //         icon: "system"
      //       },
      //       {
      //         name: "导出积分",
      //         url: "exportIntegral",
      //         icon: "system"
      //       },
      //       {
      //         name: "荣誉表彰",
      //         url: "honerRecognition",
      //         icon: "system"
      //       },
      //       {
      //         name: "乡贤榜",
      //         url: "virtuous",
      //         icon: "system"
      //       }
      //     ]
      //   },
      //   {
      //     name: "用户管理",
      //     routeName: "userList",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "用户列表",
      //         url: "userList",
      //         icon: "system"
      //       },
      //       {
      //         name: "家庭户管理",
      //         url: "familyManage",
      //         icon: "system"
      //       },
      //       {
      //         name: "乡村分组设置",
      //         url: "groupManage",
      //         icon: "system"
      //       }
      //     ]
      //   },
      //   {
      //     name: "乡村管理",
      //     routeName: "integralSettings",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "乡村介绍",
      //         url: "villageIntroduction",
      //         icon: "system"
      //       },
      //       {
      //         name: "乡村组织介绍",
      //         url: "villageorganizations",
      //         icon: "system"
      //       },
      //       {
      //         name: "走进乡村",
      //         url: "enterVillage",
      //         icon: "system"
      //       },
      //       {
      //         name: "村规民约",
      //         url: "villagerules",
      //         icon: "system"
      //       },
      //       {
      //         name: "乡村影集",
      //         url: "photograph",
      //         icon: "system"
      //       }
      //     ]
      //   },
      //   {
      //     name: "商品管理",
      //     routeName: "goodsManage",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "商品列表",
      //         url: "goodsManage",
      //         icon: "system"
      //       },
      //       {
      //         name: "兑换记录",
      //         url: "exchangeRecord",
      //         icon: "system"
      //       },
      //
      //     ]
      //   },
      //   /*xj的路由*/
      //   {
      //     name: "心愿管理",
      //     routeName: "wishManage",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "心愿列表",
      //         url: "wishManage",
      //         icon: "system"
      //       },
      //       {
      //         name: "志愿者招募",
      //         url: "volunteer",
      //         icon: "system"
      //       },
      //     ]
      //   },
      //   {
      //     name: "内容管理",
      //     routeName: "honerRecognition",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "信息公开",
      //         url: "disclose",
      //         icon: "system"
      //       },
      //       {
      //         name: "轮播图管理",
      //         url: "carousel",
      //         icon: "system"
      //       },
      //       {
      //         name: "乡村管理",
      //         url: "village",
      //         icon: "system"
      //       },
      //       {
      //         name: "tab设置",
      //         url: "tabSet",
      //         icon: "system"
      //       },
      //       {
      //         name: "存折设置",
      //         url: "depositSet",
      //         icon: "system"
      //       },
      //       {
      //         name: "积分类别设置",
      //         url: "integralCategory",
      //         icon: "system"
      //       },
      //       {
      //         name: "积分排名设置",
      //         url: "ranking",
      //         icon: "system"
      //       },
      //       {
      //         name: "等级设置",
      //         url: "levelSet",
      //         icon: "system"
      //       },
      //       {
      //         name: "荣誉表彰设置",
      //         url: "honorSetting",
      //         icon: "system"
      //       },
      //       {
      //         name: "积分设置",
      //         url: "integralSettings",
      //         icon: "system"
      //       },
      //       {
      //         name: "积分规则",
      //         url: "IntegralRule",
      //         icon: "system"
      //       }
      //     ]
      //   },
      //   {
      //     name: "系统设置",
      //     routeName: "village",
      //     icon: "system",
      //     children: [
      //       {
      //         name: "成员管理",
      //         url: "memberManage",
      //         icon: "system"
      //       },
      //       {
      //         name: "角色管理",
      //         url: "roleManage",
      //         icon: "system"
      //       },
      //       {
      //         name: "系统设置",
      //         url: "publicitySet",
      //         icon: "system"
      //       }
      //     ]
      //   }
      // ];
      // this.updateLeftMenu(menuList);

      let session_adminInfo = JSON.parse(this.$getStore("adminUserInfo")) || "";
      const res = await this.$http.getPersonalMenuList({
        memberId: session_adminInfo.memberId
      });
      if (res.status === "success") {
        menuList= res.data
        menuList.unshift( {
          name: "首页",
            url: "home",
            icon: "shouye",
            children: []
        },)
        this.updateLeftMenu(menuList);
      }
    }
  }
};
</script>
<style lang='less'>
</style>
