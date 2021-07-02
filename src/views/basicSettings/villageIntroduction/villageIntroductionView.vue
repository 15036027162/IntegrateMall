
<template>
  <div class="integralRegisterView">
    <div class="viewItem">
      <span class="labeltext">背景图：</span>
      <div class="content">
        <div class="imgdiv">
          <el-image v-if="details.picUrl !== undefined" lazy :src="details.picUrl"  :preview-src-list="[details.picUrl]">
          </el-image>
        </div>
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">乡村介绍：</span>
      <div class="content">{{ details.introduction }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">乡村印象：</span>
      <div class="content" v-if="details.impresses&&details.impresses.length">
        <div class="imgdiv" v-for="(item,index) in details.impresses" :key="index">
          <video :src="item.picUrl" controls></video>
        </div>
      </div>
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
      dialogFormVisible: false,
      addname: "",
      honorNum: "",
      ruleForm: {
        desc: "",
      },
      rules: {
        desc: [
          {
            required: true,
            message: "请输入20字以内驳回说明",
            trigger: "blur",
            min: 1,
            max: 20,
          },
        ],
      },

      details: {},
      id: "",
      type: "",
      list: [],
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }

    this.getListData();
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.introduceDetail({
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
</style>