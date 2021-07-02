
<template>
  <div class="villagerulesView">
    <div class="viewItem ql-container ql-snow">
      <span class="labeltext">村规民约：</span>
      <div class="content ql-editor" v-html="details.content"></div>
    </div>
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
      details: {},
      id: "",
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getListData();
    }
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.villageRuleInfo({
        id: this.id || 1,
      });
      if (res.status === "success") {
        var resData = res.data || {};
        this.details = resData[0];
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
  },
};
</script>
<style lang='less'>

.villagerulesView {
  .ql-container.ql-snow {
    border: none !important;
  }
}
</style>