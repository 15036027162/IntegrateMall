<template>
    <div>
        <el-form :model="wishManageForm" label-width="120px" v-if="wishManageForm">
            <el-form-item label="状态：">
                <span style="color:#409EFF" v-if="wishManageForm.status==1">未领取</span>
                <span style="color:#F56C6C" v-if="wishManageForm.status==2">已领取</span>
                <span style="color:#67C23A" v-if="wishManageForm.status==3">已完成</span>
            </el-form-item>
            <el-form-item label="心愿内容："><span>{{wishManageForm.context || '--'}}</span></el-form-item>
            <el-form-item label="图片：" v-if="imageUrls.length>0">
                <img v-for="(item,index) in imageUrls" :key="index" :src="item" style="height: 120px;margin-right: 20px">
            </el-form-item>
            <el-form-item label="提交者："><span>{{wishManageForm.memberName || '--'}}</span></el-form-item>
            <el-form-item label="提交时间："><span>{{wishManageForm.createTime || '--'}}</span></el-form-item>
            <el-form-item label="领取人："><span>{{wishManageForm.receiver || '--'}}</span></el-form-item>
            <el-form-item label="操作人："><span>{{wishManageForm.modifier || '--'}}</span></el-form-item>
            <el-form-item label="更新时间："><span>{{wishManageForm.updateTime || '--'}}</span></el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "wishManageView",
        data(){
            return{
                wishManageForm:{},
                imageUrls:[]
            }
        },
        created() {
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let res = await this.$http.getWishById({
                    id:this.$route.params.id,
                })
                if(res.code === '0'){
                    this.wishManageForm = res.data
                    if(this.wishManageForm.imageUrls){
                        this.imageUrls = this.wishManageForm.imageUrls.split(',')
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>
