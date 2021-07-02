<!--  -->
<template>
  <div class="index_bg">
    <div class="rightBstns">
      <div class="left">首页</div>
      <provinces @changeTown="changeTown" class="right" v-show='this.deptLevel!=5'></provinces>
    </div>
    <ul class="topul">
      <li style="cursor: pointer;">
        <div class="divbox" @click="gouser">
          <div class="boxleft">
            <div>
              <countTo :startVal="0" :endVal="topData.registerCount?topData.registerCount:0" :duration="3000"></countTo>
            </div>
            <div>注册人数（人）</div>
          </div>
          <div class="boxright">
            <img src="../assets/img/zc.png" alt="" class="imgs0" />
          </div>
        </div>
      </li>
      <li>
        <div class="divbox divbox3">
          <div class="boxleft">
            <div>
              <countTo :startVal="0" :endVal="topData.realName?topData.realName:0" :duration="3000"></countTo>

            </div>
            <div>实名人数（人）</div>
          </div>
          <div class="boxright">
            <img src="../assets/img/ry.png" alt="" class="imgs2" />
          </div>
        </div>
      </li>
      <li>
        <div class="divbox divbox2">
          <div class="boxleft">
            <div>
              <countTo :startVal="0" :endVal="topData.activeDoorCount?topData.activeDoorCount:0" :duration="3000"></countTo>
            </div>
            <div>激活家庭（户）</div>
          </div>
          <div class="boxright">
            <img src="../assets/img/jh.png" alt="" class="imgs1" />
          </div>
        </div>
      </li>

      <li>
        <div class="divbox divbox4">
          <div class="boxleft">
            <div>
              <span style="font-size:16px">￥</span>
              <countTo :startVal="0" :endVal="topData.score?topData.score:0" :duration="3000"></countTo>
            </div>
            <div>积分总额</div>
          </div>
          <div class="boxright">
            <img src="../assets/img/du.png" alt="" class="imgs3" />
          </div>
        </div>
      </li>
    </ul>
    <!-- 基本情况 -->
    <div class="middel">
      <div class="middlewarp1">
        <div class="middlebox borderStyle">
          <div class="middletit">基本信息</div>
          <ul class="jbgk">
            <li>
              <div>
                <span>{{ baseData.totalWish }}</span>件
              </div>
              <div>心愿总数</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.finish }}</span>件
              </div>
              <div>已完成</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.receive }}</span>件
              </div>
              <div>已领取</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.unReceive }}</span>件
              </div>
              <div>未领取</div>
            </li>
          </ul>
          <ul class="jbgk">
            <li>
              <div>
                <span>{{ baseData.totalActivity }}</span>件
              </div>
              <div>志愿者活动</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.endActivity }}</span>件
              </div>
              <div>已结束</div>
            </li>
            <li>
              <div>

                <span>{{ baseData.progressActivity }}</span>件
              </div>
              <div>进行中</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.album }}</span>张
              </div>
              <div>乡村图集</div>
            </li>
          </ul>
          <ul class="jbgk">
            <li>
              <div>
                <span>{{ baseData.policy }}</span>件
              </div>
              <div>信息公开</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.dynamic }}</span>条
              </div>
              <div>圈子信息</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.redBlack }}</span>人
              </div>
              <div>乡贤榜名单</div>
            </li>
            <li>
              <div>
                <span>{{ baseData.honor }}</span>枚
              </div>
              <div>荣誉表彰</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="middlewarp2">
        <div class="middlebox borderStyle">
          <div class="middletit">待处理事件</div>
          <ul class="dcl">
            <li @click="gord">
              <div class="dclleft">
                <img src="../assets/img/sh.png" alt="" />
                <div>积分批量<span>待审核</span>事件</div>
              </div>
              <div class="dclright">
                {{ waitData.imports }}
              </div>
            </li>
            <li @click="gocm">
              <div class="dclleft">
                <img src="../assets/img/sh.png" alt="" />
                <div>积分<span>待审核</span>事件</div>
              </div>
              <div class="dclright">
                {{ waitData.integral }}
              </div>
            </li>
            <li @click="gory">
              <div class="dclleft">
                <img src="../assets/img/sh.png" alt="" />
                <div>积分公示<span>被投诉</span>事件</div>
              </div>
              <div class="dclright">
                {{ waitData.publicity }}
              </div>
            </li>
            <li @click="gosc">
              <div class="dclleft">
                <img src="../assets/img/sh.png" alt="" />
                <div>商城新增商品<span>待审核</span>事件</div>
              </div>
              <div class="dclright">
                {{ waitData.goods }}
              </div>
            </li>
            <li @click="gorz">
              <div class="dclleft">
                <img src="../assets/img/sh.png" alt="" />
                <div><span>微心愿</span>事件处理</div>
              </div>
              <div class="dclright">
                {{ waitData.wishes }}
              </div>
            </li>
            <li @click="gogk">
              <div class="dclleft">
                <img src="../assets/img/sh.png" alt="" />
                <div>信息公开<span>待审核</span>事件</div>
              </div>
              <div class="dclright">
                {{ waitData.policy }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 商品积分 goodsData-->
    <div class="goodsWrap borderStyle">
      <div class="middletit">商品积分<span>（1积分=￥{{goodsData.money}}）</span></div>
      <div class="goodsIntegralWrap">
        <ul class="jbgk goodsIntegral1">
          <li>
            <div>
              <span>{{ goodsData.total }}</span>件
            </div>
            <div>商品总数</div>
          </li>
          <li>
            <div>
              <span>{{ goodsData.prices }}</span>
            </div>
            <div>商品总价</div>
          </li>
          <li>
            <div>
              <span>{{ goodsData.used }}</span>件
            </div>
            <div>已兑商品</div>
          </li>
          <li>
            <div>
              <span>{{ goodsData.goods }}</span>件
            </div>
            <div>可兑商品</div>
          </li>
        </ul>
        <ul class="jbgk goodsIntegral2" style="margin-top:0">
          <li>
            <div>
              <span>{{ goodsData.goodsScore }}</span>
            </div>
            <div>商品总积分</div>
          </li>
          <li>
            <div>
              <span>{{ goodsData.userScore }}</span>
            </div>
            <div>用户可兑积分</div>
          </li>
        </ul>
      </div>

    </div>
    <div class="topDiv">
      <!-- 图表 -->
      <div class="chartdiv">
        <div class="chartleft">
          <div class="chartwrap borderStyle">
            <div class="middletit">积分排名
              <el-select v-model="rank" placeholder clearable @change="goSelect">
                <el-option label="--请选择--" value></el-option>
                <el-option v-for="item in integralList" :key="item.id" :label="item.rankName" :value="item.id">
                </el-option>
              </el-select>
            </div>
            <div class="chart" id="linechart"></div>
          </div>
        </div>
        <div class="chartleft">
          <div class="chartwrap borderStyle">
            <div class="middletit">积分存折占比</div>
            <div class="chart" id="piechart"></div>
            <div class="total">
              <div>{{ totalScore }}</div>
              <div>发放总额</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <p class="compayInfo">
      ️津市乡村积分通管理系统 由美丽乡村信息技术提供技术支持。欢迎访问：https://www.mlxcchina.com
    </p>
  </div>
</template>

<script>
import provinces from "../components/public/provinces";
import echarts from "echarts";
import countTo from "vue-count-to";
export default {
  components: {
    provinces,
    countTo,
  },
  name: "home",
  data() {
    return {
      searchForm: {
        areaCode: "",
        streetCode: "",
        villageCode: "",
      },

      rank: "",
      pieid: "",
      pieid2: "",
      lineid: "",
      homeData: "",
      typeList: [],

      topData: {},
      integralList: [],
      baseData: {},
      waitData: {},
      cardData: [],
      totalScore: 0,
      rankx: [],
      ranky: [],
      goodsData: {},
    };
  },
  computed: {
    top: function () {
      return -this.boxId * 50 + "px";
    },
  },
  created() {
    this.adminUserInfo = JSON.parse(this.$getStore("adminUserInfo"));
    this.deptLevel = this.adminUserInfo.deptLevel;
    this.searchForm.areaCode = this.adminUserInfo.areaCode;
    if (this.deptLevel == 4) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
    }
    if (this.deptLevel == 5) {
      this.searchForm.streetCode = this.adminUserInfo.streetCode;
      this.searchForm.villageCode = this.adminUserInfo.villageCode;
    }

    this.getHomeHeader();
    this.getHomeBaseCount();
    this.getHomeWaitCount();
    this.getHomeGoodsInfo();
  },
  mounted() {
    this.getCardList();
    this.getHomeTotalScore();

    window.onresize = () => {
      this.pieid.resize();
      this.lineid.resize();
    };
  },
  methods: {
    gouser() {
      this.$router.push({
        path: "/userManage/userList",
      });
    },
    //选择下拉
    goSelect(val) {
      this.getWebRankById();
    },
    // 获取积分存折列表
    async getCardList() {
      const res = await this.$http.getWebRankList({});
      if (res.status === "success") {
        if (res.data.length > 0) {
          this.integralList = res.data;
          this.rank = res.data[0].id;
          this.getWebRankById();
        }
      } else {
      }
    },
    //首页数量
    async getHomeHeader() {
      const res = await this.$http.getHomeHeader({
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
      });
      if (res.status === "success") {
        this.topData = res.data;
      } else {
      }
    },

    //基本信息
    async getHomeBaseCount() {
      const res = await this.$http.getHomeBaseCount({
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
      });
      if (res.status === "success") {
        this.baseData = res.data;
      } else {
      }
    },
    //商品信息
    async getHomeGoodsInfo() {
      const res = await this.$http.getHomeGoodsInfo({
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
      });
      if (res.status === "success") {
        this.goodsData = res.data;
      } else {
      }
    },
    //待处理数量
    async getHomeWaitCount() {
      const res = await this.$http.getHomeWaitCount({
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
      });
      if (res.status === "success") {
        this.waitData = res.data;
      } else {
      }
    },
    //积分存折占比
    async getHomeTotalScore() {
      const res = await this.$http.getHomeTotalScore({
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
      });
      if (res.status === "success") {
        this.totalScore = res.data.totalScore;
        if (res.data.cardList.length > 0) {
          this.cardData = res.data.cardList.map((val) => {
            return {
              name: val.cardName,
              value: val.score,
            };
          });
        } else {
          this.cardData = [];
        }
        this.piechart1();
      } else {
      }
    },

    //各类排行榜明细
    async getWebRankById() {
      const res = await this.$http.getWebRankById({
        areaCode: this.searchForm.areaCode,
        streetCode: this.searchForm.streetCode,
        villageCode: this.searchForm.villageCode,
        id: this.rank,
      });
      if (res.status === "success") {
        if (res.data.length > 0) {
          this.rankx = res.data.map((val) => {
            return val.name;
          });
          this.ranky = res.data.map((val) => {
            return val.totalScore;
          });
        } else {
          this.rankx = [];
          this.ranky = [];
        }
        this.linechart();
      } else {
      }
    },

    //
    gord() {
      //content:policy:view
      if (this.isAuth("web:batch:examine")) {
        this.$router.push({
          name: "integralHandle",
        });
      } else {
        this.$confirm("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning",
        });
      }
    },
    gocm() {
      if (this.isAuth("web:register:examine")) {
        this.$router.push({
          name: "integralRegister",
        });
      } else {
        this.$confirm("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning",
        });
      }
    },
    gory() {
      if (this.isAuth("web:publicity:confirm")) {
        this.$router.push({
          name: "integralPublicity",
        });
      } else {
        this.$confirm("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning",
        });
      }
    },
    gosc() {
      if (this.isAuth("web:goods:examine")) {
        this.$router.push({
          name: "goodsManage",
        });
      } else {
        this.$confirm("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning",
        });
      }
    },
    gorz() {
      if (this.isAuth("web:wish:handle")) {
        this.$router.push({
          name: "wishManage",
        });
      } else {
        this.$confirm("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning",
        });
      }
    },
    gogk() {
      if (this.isAuth("web:policy:examine")) {
        this.$router.push({
          name: "disclose",
        });
      } else {
        this.$confirm("你无该菜单的操作权限，请联系管理员开通！", "提示", {
          confirmButtonText: "知道了",
          cancelButtonText: "取消",
          type: "warning",
        });
      }
    },

    //占比
    piechart1() {
      this.pieid = echarts.init(document.getElementById("piechart"));
      this.pieid.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%",
        },
        color: [
          "#fbd437",
          "#f2637b",
          "#975fe5",
          "#5254cf",
          "#3aa1ff",
          "#36cbcb",
          "#4fcb74",
        ],
        legend: {
          orient: "horizontal",
          bottom: -4,
          center: "center",
          icon: "circle",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: true,
            labelLine: {
              normal: {
                length: 4,
              },
            },
            emphasis: {
              // label: {
              //   show: true,
              //   fontSize: "20",
              //   fontWeight: "bold"
              // }
            },
            label: {
              formatter: "{b}: {d}%",
              color: "#333",
            },

            data: this.cardData,
          },
        ],
      });
    },
    //排名

    linechart() {
      this.lineid = echarts.init(document.getElementById("linechart"));
      this.lineid.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        color: ["#4ecb73", "#0099ff"],
        // legend: {
        //   data: ["已兑商品", "剩余商品"],
        // },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.rankx,
            axisLabel: {
              rotate: 30,
              interval: 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            barWidth: 45, //柱图宽度
            name: "总分",
            type: "bar",
            stack: "",
            data: this.ranky,
          },
        ],
      });
    },
    changeTown(val) {
      this.searchForm.areaCode = val.cityCode;
      this.searchForm.streetCode = val.townCode;
      this.searchForm.villageCode = val.villageCode;
      this.getHomeHeader();
      this.getHomeBaseCount();
      this.getHomeWaitCount();
      this.getHomeGoodsInfo();
      this.getCardList();
      this.getHomeTotalScore();
    },
  },
};
</script>
<style lang='less'>
.index_bg {
  .rightBstns {
    margin-top: -20px;
    overflow: hidden;
    height: 60px;
    line-height: 60px;
    background: #fff;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f2;
    .left {
      float: left;
      color: #606266;
    }
    .right {
      float: right;
      margin-right: 0;
      .formItem {
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .btndiv {
    overflow: hidden;
    text-align: center;
    position: relative;
    width: 80%;
    margin: 0 auto;
  }
  .btndiv1 {
    margin-bottom: 4px;
  }
  .currenhonor {
    font-size: 14px;
    color: #606266;
    margin: 0 auto;
    width: 80%;
    img {
      height: 20px;
      width: 20px;
    }
    span {
      &:nth-child(1) {
        margin-right: 8px;
      }
      &:nth-child(2) {
        font-size: 28px;
        color: #ffa12a;
      }
      &:nth-child(4) {
        font-size: 32px;
        color: #666666;
      }
      //  &:nth-child(4) {
      //   font-size: 18px;
      //   color: #FF0000;
      // }
      &:nth-child(5) {
        font-size: 18px;
        color: #ff0000;
      }
      &:nth-child(6) {
        font-size: 28px;
        color: #ff0000;
      }
    }
  }
  .counts {
    width: 50%;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    float: left;
  }

  .leftbtn {
    width: 50%;
    height: 40px;
    line-height: 40px;
    background: #4ecb73;
    border-radius: 40px 0 0 40px;
    float: left;
    color: #fff;
    font-size: 14px;
  }

  .leftbtn1 {
    background: #0c77fb;
  }

  .rightbtn {
    width: 50%;
    height: 40px;
    line-height: 40px;
    background: #0099ff;
    border-radius: 0 40px 40px 0;
    float: left;
    color: #fff;
    font-size: 14px;
  }

  .rightbtn1 {
    background: #fb890c;
  }

  .headerss {
    width: 0px;
    height: 0px;
    border-color: #4ecb73 #0099ff #0099ff #4ecb73;
    border-width: 20px;
    border-style: solid;
    margin: 0px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .headerss1 {
    border-color: #0c77fb #fb890c #fb890c #0c77fb;
  }
  .topul {
    list-style: none;
    display: flex;
    li {
      width: 25%;
      box-sizing: border-box;
      margin-bottom: 20px;
      &:nth-child(1) {
        padding-right: 20px;
      }
      &:nth-child(2) {
        padding-right: 20px;
      }
      &:nth-child(3) {
        padding-right: 20px;
      }
      .divbox {
        width: 100%;
        height: 94px;
        padding: 0 20px;
        box-sizing: border-box;
        background: url("../assets/img/bg1@2x.png");
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        .boxleft {
          flex: 1;
          div {
            font-size: 24px;

            color: #fff;
            &:last-child {
              font-size: 16px;
              margin-top: 4px;
            }
          }
        }
        .boxright {
          // width: 52px;
          // height: 54px;
          .imgs0 {
            width: 52px;
            height: 54px;
          }
          .imgs1 {
            width: 60px;
            height: 54px;
          }
          .imgs2 {
            width: 52px;
            height: 56px;
          }
          .imgs3 {
            width: 72px;
            height: 54px;
          }
        }
      }
      .divbox2 {
        background: url("../assets/img/bg2@2x.png");
        background-size: 100% 100%;
      }
      .divbox3 {
        background: url("../assets/img/bg3@2x.png");
        background-size: 100% 100%;
      }
      .divbox4 {
        background: url("../assets/img/bg4@2x.png");
        background-size: 100% 100%;
      }
    }
  }
  .middletit {
    font-size: 16px;
    font-weight: bold;
    line-height: 50px;
    height: 50px;
    span {
      font-weight: normal;
    }
    .el-select {
      float: right;
    }
  }
  .middel {
    display: flex;
    margin-bottom: 20px;
    .middlewarp1 {
      width: 60%;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .middlewarp2 {
      width: 40%;
      box-sizing: border-box;
      .dcl {
        li {
          list-style: none;
          display: flex;
          line-height: 34px;
          justify-content: space-between;
          text-align: center;
          .dclleft {
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
              margin-right: 8px;
            }
            div {
              font-size: 14px;
              color: #606266;
              text-decoration: underline;
              span {
                color: #409eff;
              }
            }
          }
          .dclright {
            font-size: 14px;
            color: #f56c6c;
          }
        }
      }
    }

    .middlebox {
      height: 268px;
    }
  }
  .jbgk {
    list-style: none;
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin-bottom: 18px;
    &:last-child {
      margin-bottom: 0;
    }
    li {
      flex: 1;
      div {
        color: #909399;
        font-size: 14px;
        span {
          font-weight: bold;
          font-size: 20px;
          color: #f18f49;
        }
        &:last-child {
          padding-top: 4px;
          font-size: 16px;
          color: #606266;
        }
      }
    }
  }
  .goodsWrap {
    // height: 240px;
    margin-bottom: 20px;
    .goodsIntegralWrap {
      display: flex;
      .goodsIntegral1 {
        width: 66.66%;
      }
      .goodsIntegral2 {
        width: 33.33%;
        border: 1px dashed #ccc;
        height: 73px;
        border-radius: 72px;
      }
    }
  }

  .topTit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    height: 50px;
    .topTitleft {
      font-size: 16px;
      color: goldenrod;
      font-weight: bold;
      img {
        width: 30px;
        height: 30px;
        margin-right: 2px;
      }
    }
    .formItem {
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .topDiv {
    box-sizing: border-box;
    // padding: 0 10px;

    .chartdiv {
      width: 100%;
      display: flex;

      .chartleft {
        flex: 1;
        box-sizing: border-box;
        padding-right: 20px;
        &:last-child {
          padding-right: 0;
        }
        .chartwrap {
          width: 100%;
          position: relative;
          .total {
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            div {
              text-align: center;
              &:first-child {
                margin-top: 20px;
                margin-bottom: 2px;
                font-weight: bold;
              }
            }
          }
        }
        #piechart,
        #piechart2,
        #linechart,
        .wrapss {
          width: 100%;
          height: 240px;
        }
        .charttit {
          height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 50%;
          float: right;
          text-align: center;
          .charttit1 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .charttit2 {
            font-size: 30px;
            font-weight: bold;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            div {
              color: red;
              span {
                font-weight: normal;
                color: red;
                font-size: 20px;
              }
            }
          }
        }
      }
    }
  }
  .bottomdiv {
    margin-top: 10px;
    display: flex;
    .leftdiv {
      flex: 1;
      padding-right: 5px;
      .leftdivs {
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 0 10px;
        box-sizing: border-box;
      }
      &:last-child {
        padding-left: 5px;
        padding-right: 0px;
      }
    }

    .rankdiv {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 30px 0;
      .rankleft {
        width: 116px;
        height: 116px;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 6px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        .rankno {
          color: red;
          font-size: 16px;
          font-weight: bold;
        }
        .rankname {
          color: red;
          font-size: 18px;
        }
        img {
          width: 50px;
        }
      }
      .rankleft2 {
        transform: scale(1.2);
      }
    }
  }
  .ranklist {
    box-sizing: border-box;
    padding-bottom: 10px;
    .rankHeader {
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      background: #ccc;
      text-align: center;
      overflow: hidden;
      div {
        float: left;
        width: 50%;
        &:first-child {
          width: 30%;
          border-right: 1px solid #fff;
        }
        &:last-child {
          border-left: 1px solid #fff;
          width: 20%;
        }
      }
    }
    .rankwrap {
      position: relative;
      height: 250px;
      overflow: hidden;
      .rankbox {
        transition: top 0.7s;
        width: 100%;
        position: absolute;
        top: 0;
      }
    }
    .rankcon {
      list-style: none;

      // height: 300px;
      // overflow: hidden;
      li {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        text-align: center;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        div {
          float: left;
          width: 50%;
          &:first-child {
            width: 30%;
          }
          &:last-child {
            width: 20%;
          }
        }
        .ranknumber {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          text-align: center;
          background: red;
          color: #fff;
        }
      }
    }
  }
  .compayInfo {
    width: 100%;

    line-height: 40px;
    text-align: center;
    font-size: 12px;
  }
  .borderStyle {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    padding: 20px;
    padding-top: 0px;
    border-radius: 10px;
  }
}
</style>
