<!--  -->
<template>
  <div class="menu" :class="{hideSidebar:isCollapse}">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="leftMenuActiveName"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
         :collapse-transition="false"
        :unique-opened="true">
        <div v-for="(item,index) in leftMenu" :key="index">
          <el-menu-item :index="item.url" @click="goRouter(item)" v-if="!item.children.length">
            <svg-icon :icon-class="item.icon" class-name="card-panel-icon"></svg-icon>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
          <el-submenu :index="index.toString()" v-else>
            <template slot="title">
              <svg-icon :icon-class="item.icon" class-name="card-panel-icon"></svg-icon>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="items.url"
                v-for="(items,index) in item.children"
                @click="goRouter(items)"
                :key="index">
                <svg-icon :icon-class="items.icon" class-name="card-panel-icon"></svg-icon>
                <span>{{items.name}}</span>
                </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  //import引入的组件需要注入到对象中才能使用
  data() {
    //这里存放数据
    return {
      showLogo: false,
      leftMenuActiveNames:''
    };
  },
  computed: {
    ...mapState(["leftMenu", "leftMenuActiveName","isCollapse","keepAlive"])
  },
  created() {
    // console.log(this.leftMenu);
  },
  //方法集合
  methods: {
    ...mapMutations(["updateLeftMenu", "updateleftMenuActiveName"]),
    goRouter(item) {
      this.$router.push({ name: item.url });
    }
  },
  watch:{
    leftMenuActiveName(){
      return this.leftMenuActiveName
    }
  }
};
</script>
<style lang='less'>
</style>
