<template>
    <div class="policyView">
        <div class="viewItem">
            <label>商业名称：</label>
            <div>{{ details.title }}</div>
        </div>
        <div class="viewItem">
            <label>上传图片：</label>
            <div>
                <img :src="details.picUrl" alt />
            </div>
        </div>
        <div class="viewItem">
            <label>跳转方式：</label>
            <div>{{ getformat(details.style) }}</div>
        </div>
        <div class="viewItem">
            <label>链接：</label>
            <div v-if="details.url">
                <a :href="details.url" target="_blank" style="color:#409EFF;text-decoration:underline;">{{ details.url }}</a>
            </div>
            <div v-else>--</div>
        </div>
        <div class="viewItem">
            <label>发布时间：</label>
            <div>{{ details.createTime }}</div>
        </div>
        <div class="viewItem">
            <label>发布者：</label>
            <div>{{ details.creator }}</div>
        </div>
        <div class="viewItem">
            <label>所属区划：</label>
            <div>{{ details.areaName }}{{ details.streetName }}{{details.villageName}}</div>
        </div>
        <div class="viewItem">
            <label>上架状态：</label>
            <div>{{ details.state == 2 ? "上架" : "下架" }}</div>
        </div>
        <div class="viewItem" v-show=" details.state==2">
            <label>上架时间：</label>
            <div>{{details.passTime}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'carouselView',
        data() {
            return {
                details: {}
            };
        },
        created() {
            this.getListData();
        },
        methods: {
            async getListData() {
                const res = await this.$http.advDetail({
                    id: this.$route.params.id
                });
                if (res.status === "success") {
                    var resData = res.data || {};
                    this.details = resData[0];
                    if (this.details.state == 1) {
                        this.details.state1 = "待审核";
                    } else if (this.details.state == 2) {
                        this.details.state1 = "审核通过";
                    } else {
                        this.details.state1 = "审核不通过";
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            },
            getformat(style) {
                var day = "";
                switch (Number(style)) {
                    case 1:
                        day = "外部URL";
                        break;
                    case 2:
                        day = "内部链接";
                        break;
                    case 0:
                        day = "不跳转";
                    default:
                        day = "不跳转";
                }
                return day;
            }
        }
    };
</script>
<style lang='less'>
    .policyView {
        .viewItem {
            overflow: hidden;
            padding: 20px;
            padding-left: 60px;
            label {
                float: left;
                float: left;
                width: 124px;
                text-align: right;
            }
            div {
                margin-left: 156px;
                img {
                    height: 200px;
                }
                span {
                    color: #909399;
                    margin-left: 30px;
                }
            }
        }
        .examstatus {
            font-size: 16px;
            padding-left: 60px;
            img {
                float: right;
                width: 200px;
                margin-right: 150px;
            }
        }
    }
    .userView {
        .viewItem {
            overflow: hidden;
            padding: 20px;
            padding-left: 0;
        }
    }
</style>
