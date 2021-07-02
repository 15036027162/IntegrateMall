
<template>
  <div class="integralRegisterView">
    <div class="viewItem">
      <span class="labeltext">用户头像：</span>
      <div class="content">
        <img :src="details.avatar" alt="" width="100px" class="headimgs" v-if="details.avatar">
        <img src="../../../assets/img/u6.png" alt="" width="100px" class="headimgs" v-else>
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">用户名：</span>
      <div class="content">
        {{details.nickName}}
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">绑定手机：</span>
      <div class="content">
        {{details.mobile}}
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">姓名：</span>
      <div class="content">
        {{details.name}}
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">个人排名：</span>
      <div class="content">
        第{{details.rank}}名
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">用户等级：</span>
      <div class="content">
        {{details.gradeTag}}
      </div>
    </div>
    <div class="viewItem">
      <span class="labeltext">等级称号：</span>
      <div class="content">
        {{details.gradeName}}
      </div>
    </div>
    <div class="viewItem" style="font-weight:bold">
      <span class="labeltext">总积分：</span>
      <div class="content">
        {{details.totalScore}}
      </div>
    </div>
    <div v-if="cardList.length">
      <div class="viewItem" v-for="(item,index) in cardList" :key="index">
        <span class="labeltext">{{item.cardName}}：</span>
        <div class="content">
          {{item.cardScore}}
          <!-- (已扣除基础分120分) -->
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
      details: {},
      memberId: "",
      cardList: [],
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    if (this.$route.query.memberId) {
      this.memberId = this.$route.query.memberId;
      this.getListData();
    }
  },
  //方法集合
  methods: {
    // 获取列表数据
    async getListData() {
      const res = await this.$http.getIntegralByMemberId({
        id: this.memberId || 1,
      });
      if (res.status === "success") {
        this.details = res.data;
        this.cardList = res.data.cardList;
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
.headimgs {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>