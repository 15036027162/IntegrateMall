<template>
  <router-view></router-view>
</template>

<script>
export default {
  components: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  created() {
  },
  methods: {
    reload() {},
  }
};
</script>
<style lang="less">
@import "assets/less/reset";
@import "assets/less/common";
@import "assets/less/extend";
</style>
