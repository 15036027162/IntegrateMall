<template>
    <div>
        <el-form :model="volunteerForm" label-width="120px" v-if="volunteerForm">
            <el-form-item label="积分存折：">
                <el-select v-model="volunteerForm.cardId" disabled>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in deposits" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="积分类别：">
                <el-select v-model="volunteerForm.integralId" disabled>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in integralList" :key="item.id" :label="item.integralName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动主题："><span>{{volunteerForm.activityName}}</span></el-form-item>
            <el-form-item label="活动时间："><span>{{volunteerForm.activityDate}}</span></el-form-item>
            <el-form-item label="积分范围：">
                <span>{{volunteerForm.integralFrom}}</span>
                <span> - {{volunteerForm.integralTo}}</span>
            </el-form-item>
            <el-form-item label="报名总人数："><span>{{volunteerForm.num}}</span></el-form-item>
            <el-form-item label="报名总人数：" v-if="tableData.length>0">
                <el-table
                        :data="tableData"
                        v-loading="dataListLoading"
                        style="width: 100%"
                        border>
                    <el-table-column prop="memberName" label="姓名"></el-table-column>
                    <el-table-column prop="mobile" label="手机号"></el-table-column>
                    <el-table-column prop="createTime" label="报名时间"></el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination
                        v-if="totalPage>0"
                        @size-change="sizeChangeHandle"
                        @current-change="currentChangeHandle"
                        :current-page="pageIndex"
                        :page-size="pageSize"
                        :total="totalPage"
                        layout="total, prev, pager, next, jumper">
                </el-pagination>
            </el-form-item>
            <el-form-item label="列表图片：">
                <img v-if="volunteerForm.imageUrl" :src="volunteerForm.imageUrl" style="height: 120px">
            </el-form-item>
            <el-form-item label="详细说明："><span>{{volunteerForm.introduce}}</span></el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "volunteerView",
        data(){
            return{
                volunteerForm:{},
                deposits:[],
                integralList:[],
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 5,
                totalPage: 0
            }
        },
        created() {
            this.getInfo()
            this.getRegister()
            this.getDeposite()
        },
        methods:{
            /*获取存折*/
            async getDeposite(){
                let res = await this.$http.getCardList();
                if (res.code === '0') {
                    this.deposits = res.data
                }
            },
            async changeDeposits(val){
                if(val){
                    /*id为cardId*/
                    let res = await this.$http.getIntegralListByCardId({id:val});
                    if (res.code === '0') {
                        this.integralList = res.data
                    }
                }
            },
            /*详情*/
            async getInfo(){
                let res = await this.$http.getVolunteerById({
                    id:this.$route.params.id
                })
                if(res.status==='success'){
                    this.volunteerForm = res.data
                    this.changeDeposits(this.volunteerForm.cardId)
                }
            },
            /*报名者*/
            async getRegister(){
                let res = await this.$http.getRegisterPageList({id:this.$route.params.id})
                if(res.status==='success'){
                    this.dataListLoading = false
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            },
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getRegister()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getRegister()
            },
        }
    }
</script>

<style scoped>

</style>
