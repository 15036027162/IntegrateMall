<template>
    <ul class="moreRecognitionList">
        <li><span>表彰名称：</span>{{moreRecognitionInfo.title}}</li>
        <li>
            <span>所属村组：</span>
            <i v-if="moreRecognitionInfo.areaName">{{moreRecognitionInfo.areaName}}</i>
            <i v-if="moreRecognitionInfo.streetName"> - {{moreRecognitionInfo.streetName}}</i>
            <i v-if="moreRecognitionInfo.villageName"> - {{moreRecognitionInfo.villageName}}</i>
        </li>
        <li>
            <span>表彰说明：</span>
            <div style="display: inline-block" v-html="moreRecognitionInfo.content"></div>
        </li>
        <li><span>发布时间：</span>{{moreRecognitionInfo.createTime}}</li>
        <li>
            <span>标题图片：</span>
            <img :src="moreRecognitionInfo.picUrl" style="height: 200px">
        </li>
    </ul>
</template>

<script>
    export default {
        name: "moreRecognition",
        data(){
            return{
                moreRecognitionInfo:{}
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            /*获取列表*/
            async getInfo(){
                let res = await this.$http.monthlyAwardInfo({
                    id:this.$route.params.id,
                })
                if(res.status==='success'){
                    this.moreRecognitionInfo = res.data[0]
                }
            },
        }
    }
</script>

<style scoped>
    .moreRecognitionList li{
        font-size: 14px;
        margin-bottom: 20px;
    }
    .moreRecognitionList li span{
        width: 120px;
        display: inline-block;
        text-align: right;
        margin-right: 10px;
    }
</style>
