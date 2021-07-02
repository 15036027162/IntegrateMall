<template>
    <div>
        <el-form :inline="true" :model="wishForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="积分存折：">
                <el-select v-model="wishForm.cardId" clearable @change="changeDeposits">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option v-for="item in deposits" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="积分类别：" v-if="integralList.length>0">
                <el-select v-model="wishForm.integralId" clearable>
                    <el-option label="全部" :value="0"></el-option>
                    <el-option v-for="item in integralList" :key="item.id" :label="item.integralName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动主题：">
                <el-input v-model="wishForm.name" placeholder="输入活动主题" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:volunteer:add')&&deptLevel==5">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="activityName" label="活动主题（积分明细）"></el-table-column>
            <el-table-column prop="integralFrom" label="奖励积分">
                <template slot-scope="{row}">
                    <span>{{row.integralFrom}}</span>
                    <span> - {{row.integralTo}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="activityDate" label="活动时间" width="150"></el-table-column>
            <el-table-column prop="num" label="报名人数">
                <template slot-scope="{row}">
                    <span>{{row.num}}</span>
                    <span> / {{row.allNum}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="活动状态">
                <template slot-scope="{row}">
                    <el-tag v-if="row.status == 0 || row.status == 1 || row.status == 2" size="small">进行中</el-tag>
                    <el-tag v-if="row.status == 3" size="small" type="danger">已结束</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="modifier" label="操作人"></el-table-column>
            <el-table-column prop="createTime" label="发布时间" width="200"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" style="color: #E6A23C" v-if="isAuth('web:volunteer:edit')&&deptLevel==5">编辑</el-button>
                    <el-button type="text" size="small" @click="handleDel(scope.row.id)" style="color: #F56C6C" v-if="isAuth('web:volunteer:delete')&&deptLevel==5">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    import provinces from "@/components/public/provinces";
    export default {
        name: "volunteer",
        components:{ provinces },
        data(){
            return{
                isReset:false,  //重置地区
                wishForm:{
                    cardId:0,
                    integralId:0,
                    name:''
                },
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                areaCode:'',
                streetCode:'',
                villageCode:'',
                deptLevel:0,
                deposits:[],  //积分存折-查询
                integralList:[] //积分类型-查询
            }
        },
        mounted() {
            this.getCode()
            this.getDeposite()
            this.getDataList()
        },
        methods:{
            getCode(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                this.areaCode = session_adminInfo.areaCode
                this.deptLevel = session_adminInfo.deptLevel
                if(this.deptLevel==3){
                    this.villageCode = '';
                    this.streetCode = '';
                }else if(this.deptLevel==4){
                    this.villageCode = ''
                    this.streetCode = session_adminInfo.streetCode
                }else if(this.deptLevel==5){
                    this.villageCode = session_adminInfo.villageCode
                    this.streetCode = session_adminInfo.streetCode
                }
            },
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
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let data = {
                    areaCode: this.areaCode,
                    streetCode: this.streetCode,
                    villageCode: this.villageCode,
                    activityName: this.wishForm.name,
                    cardId: this.wishForm.cardId,
                    integralId: this.wishForm.integralId,
                    pageNo:this.pageIndex,
                    pageSize:this.pageSize
                }
                let res = await this.$http.getVolunteerPageList(data)
                if(res.status==='success'){
                    this.dataListLoading = false
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            },
            /*查询*/
            searchManage(){
                this.pageIndex = 1
                this.getDataList()
            },
            /*新增*/
            addHandle(){
                this.$router.push({name: 'volunteerAdd'})
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.isReset = true
                this.wishForm.name = ''
                this.wishForm.cardId = 0
                this.wishForm.integralId = 0
                this.integralList = []
                this.getCode()
                this.getDataList()
            },
            /*地区下拉*/
            changeTown(val){
                this.isReset = false
                this.areaCode = val.cityCode
                this.streetCode = val.townCode
                this.villageCode = val.villageCode
            },
            // 每页数
            sizeChangeHandle (val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getDataList()
            },
            /*查看*/
            handleView(id){
                this.$router.push({ path: `/volunteer/volunteerView/${id}`});
            },
            /*编辑*/
            handleSet(id){
                this.$router.push({ path: `/volunteer/volunteerEdit/${id}`});
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后，该条志愿者记录将不存在，请谨慎操作！`, '删除操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.volunteerDel({id: id}).then((res) => {
                        if (res && res.code === '0') {
                            this.$message({
                                message: res.msg,
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(res.msg)
                        }
                    })
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped>

</style>
