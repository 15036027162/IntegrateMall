<template>
    <div>
        <el-form :inline="true" :model="wishForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="wishForm.status" placeholder="请选择" clearable>
                    <el-option label="--请选择--" :value="0"></el-option>
                    <el-option label="未领取" :value="1"></el-option>
                    <el-option label="已领取" :value="2"></el-option>
                    <el-option label="已完成" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="心愿内容：">
                <el-input v-model="wishForm.context" placeholder="输入关键字查询" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="context" label="心愿内容"></el-table-column>
            <el-table-column prop="memberName" label="发起者"></el-table-column>
            <el-table-column prop="createTime" label="发布时间" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="{row}">
                    <el-tag v-if="row.status == 1" size="small">未领取</el-tag>
                    <el-tag v-if="row.status == 2" size="small" type="success">已领取</el-tag>
                    <el-tag v-if="row.status == 3" size="small" type="danger">已完成</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="modifier" label="操作人">
                <template slot-scope="scope">
                    <span v-if="scope.row.modifier">{{scope.row.modifier}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="处理时间" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="handleSet(scope.row)" style="color: #E6A23C" v-if="isAuth('web:wish:handle')&&(scope.row.status == 1 || scope.row.status == 2)">处理</el-button>
                    <el-button type="text" size="small" @click="handleDel(scope.row.id)" style="color: #F56C6C" v-if="isAuth('web:wish:delete')&&scope.row.status == 3">删除</el-button>
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

        <!--处理-->
        <el-dialog
                title="心愿处理"
                :visible.sync="dialogVisible"
                width="500px"
                @close="handleReset">
            <el-form ref="statusForm" :model="statusForm" :rules="statusRules"  label-width="100px">
                <el-form-item label="心愿说明："><span>{{statusForm.context}}</span></el-form-item>
                <el-form-item label="发起人："><span>{{statusForm.memberName}}</span></el-form-item>
                <el-form-item label="领取人：" v-if="statusForm.status == 2"><span>{{statusForm.receiver}}</span></el-form-item>
                <el-form-item label="领取人：" v-else prop="receiver">
                    <el-input v-model="statusForm.receiver" placeholder="输入领取人姓名" clearable></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleReset">取 消</el-button>
                <el-button type="primary" @click="sureChange(2)" v-if="statusForm.status == 2">完 成</el-button>
                <el-button type="primary" @click="sureChange(1)" v-else>领 取</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import provinces from "@/components/public/provinces";
    export default {
        name: "wishManage",
        components:{ provinces },
        data(){
            return{
                isReset:false,  //重置地区
                wishForm:{
                    status:0,
                    context:''
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
                statusForm:{
                    receiver:'',
                    status:''
                },
                statusRules:{
                    receiver: [
                        {required: true, message: '输入领取人姓名', trigger: 'blur'},
                        {min: 1, max: 10, message: '姓名长度不得超过 10 字符', trigger: 'blur'}
                    ]
                },
                dialogVisible:false
            }
        },
        mounted() {
            this.getCode()
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
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let data = {
                    areaCode: this.areaCode,
                    streetCode: this.streetCode,
                    villageCode: this.villageCode,
                    context: this.wishForm.context,
                    status: this.wishForm.status,
                    pageNo:this.pageIndex,
                    pageSize:this.pageSize
                }
                let res = await this.$http.getWishPageList(data)
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
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                /*wishForm:{
                    status:0,
                    context:''
                },*/
                this.wishForm.status = 0
                this.wishForm.context = ''
                this.isReset = true
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
                this.$router.push({ path: `/wishManage/wishManageView/${id}`});
            },
            /*处理*/
            handleSet(item){
                this.dialogVisible = true
                this.statusForm = item
            },
            /*取消*/
            handleReset(){
                if(this.statusForm.status==1){
                    this.$refs['statusForm'].resetFields()
                    this.statusForm.receiver = ''
                }
                this.dialogVisible = false
            },
            /*确定*/
            async sureChange(val){
                this.$refs['statusForm'].validate(async (valid) => {
                    if (valid) {
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        let data = {}
                        if(val==1){
                            data = {
                                id:this.statusForm.id,
                                name:session_adminInfo.name,
                                receiver:this.statusForm.receiver
                            }
                        }else{
                            data = {
                                id:this.statusForm.id,
                                name:session_adminInfo.name,
                                status:'3'
                            }
                        }
                        let res = await this.$http.getWishUpdate(data)
                        if(res.status==='success'){
                            this.$message({
                                type: 'success',
                                message: res.msg,
                                duration: 1000,
                            });
                            this.dialogVisible = false
                            this.getDataList()
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                duration: 1000,
                            });
                        }
                    }
                })
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后，该条心愿记录将不存在，请谨慎操作！`,'删除操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.getWishDelete({
                        id: id
                    }).then((res) => {
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
