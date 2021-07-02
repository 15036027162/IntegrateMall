
<template>
  <div class="enterVillageView">
    <div class="viewItem">
      <span class="labeltext">名称：</span>
      <div class="content">{{ details.name }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">特色icon图：</span>
      <div class="content">
        <div class="imgdiv">
          <el-image  :src="details.picUrl" v-if="details.picUrl !== undefined" lazy :preview-src-list="[details.picUrl]">
          </el-image>
        </div>
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">背景图：</span>
      <div class="content">
        <div class="imgdiv">
          <el-image :src="details.backUrl" v-if="details.backUrl !== undefined" lazy :preview-src-list="[details.backUrl]">
          </el-image>
        </div>
      </div>
    </div>
    <div class="viewItem ql-container ql-snow">
      <span class="labeltext">特色介绍：</span>
      <div class="content ql-editor" v-html="details.introduction"></div>
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
      const res = await this.$http.villageEnterInfo({
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
.inputwarp {
  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    margin-left: 0 !important;
    width: 260px;
  }
  .el-select {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    margin-left: 0 !important;
    width: 260px;
  }
}
.imgwrap {
  overflow: hidden;
  img {
    height: 100px;
    width: 200px;
    float: left;
    margin-right: 10px;
  }
}
.enterVillageView {
  .ql-container.ql-snow {
    border: none !important;
  }
}
</style>