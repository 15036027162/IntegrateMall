
<template>
  <div class="integralRegisterView">
    <div class="examstatus examstatus1">
      <div>加分申请：</div>
      <span>{{ details.state1 }}</span>
    </div>
    <div class="viewItem">
      <span class="labeltext">事件编号：</span>
      <div class="content">{{ details.id }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分存折：</span>
      <div class="content">{{ details.cardName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分类别：</span>
      <div class="content">{{ details.integralName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分明细：</span>
      <div class="content">{{ details.setName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">积分：</span>
      <div class="content">{{ details.rangeStart }}~{{ details.rangeEnd }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">申请说明：</span>
      <div class="content">{{ details.remark?details.remark:'--' }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">图片：</span>
      <div class="content" v-if="details.imageUrls&&details.imageUrls.length">
        <div class="imgdiv" v-for="(item,index) in details.imageUrls" :key="index">
          <el-image :src="item" :preview-src-list="[item]" v-if="item!== undefined" lazy>
          </el-image>
        </div>
      </div>
      <div class="content" v-else>--</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">申请时间：</span>
      <div class="content">{{ details.createTime }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">申请人：</span>
      <div class="content">{{ details.memberName }}</div>
    </div>
    <div class="viewItem">
      <span class="labeltext">手机号：</span>
      <div class="content">{{ details.mobile }}</div>
    </div>
    <div class="viewItem" v-show="details.state==2">
      <span class="labeltext">发放积分：</span>
      <div class="content">{{ details.scores }}</div>
    </div>
    <div class="viewItem" v-show="details.state==3">
      <span class="labeltext">驳回理由：</span>
      <div class="content">{{ details.refuseReason }}</div>
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
    }

    this.getListData();
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getIntegralRegisterById({
        id: this.id || 1,
      });
      if (res.status === "success") {
        if (res.data.imageUrls) {
          res.data.imageUrls = res.data.imageUrls.split(",");
        }
        this.details = res.data;
        if (this.details.state == 1) {
          this.details.state1 = "待审核";
        } else if (this.details.state == 2) {
          this.details.state1 = "审核通过";
        } else {
          this.details.state1 = "审核未通过";
        }
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