<template>
    <div>
        <el-form :inline="true" :model="memberForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="成员姓名：">
                <el-input v-model="memberForm.name" placeholder="搜索成员名或手机号" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:member:add')">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="name" label="成员姓名">
                <template slot-scope="scope">
                    <span v-if="scope.row.name">{{scope.row.name}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="sexName" label="性别"></el-table-column>
            <el-table-column prop="position" label="职务">
                <template slot-scope="scope">
                    <span v-if="scope.row.position">{{scope.row.position}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="typeName" label="角色">
                <template slot-scope="scope">
                    <span v-if="scope.row.typeName">{{scope.row.typeName}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间" width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
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
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" style="color: #E6A23C" v-if="isAuth('web:member:edit')">编辑</el-button>
                    <el-button type="text" size="small" @click="handleDel(scope.row.id)" style="color: #F56C6C" v-if="isAuth('web:member:delete')">删除</el-button>
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
        name: "memberManage",
        components:{ provinces },
        data(){
            return{
                isReset:false,  //重置地区
                memberForm:{
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
                deptLevel:0
            }
        },
        created() {
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
                let res = await this.$http.memberManageList({
                    areaCode:this.areaCode,
                    streetCode:this.streetCode,
                    villageCode:this.villageCode,
                    param:this.memberForm.name,
                    pageNumber:this.pageIndex,
                    pageSize:this.pageSize,
                });
                if (res.code === '0') {
                    this.dataListLoading = false
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                    if(this.tableData){
                        this.tableData.map(k=>{
                            // k.newMobile = this.phoneNumFilterLogin(k.mobile )
                            if(k.type==0){
                                k.typeName = '普通管理员'
                            }else if(k.type==1){
                                k.typeName = '系统管理员'
                            }
                            if(k.ssex==1){
                                k.sexName = '男'
                            }else if(k.ssex==0){
                                k.sexName = '女'
                            }else{
                                k.sexName = '-'
                            }
                        })
                    }
                }
            },
            /*查询*/
            searchManage(){
                this.pageIndex = 1
                this.getDataList()
            },
            /*新增*/
            addHandle(){
                this.$router.push({name: 'memberAdd'})
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.isReset = true
                this.memberForm.name = ''
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
                this.$router.push({path: `/memberManage/memberView/${id}`})
            },
            /*编辑*/
            handleSet(id){
                this.$router.push({path: `/memberManage/memberEdit/${id}`})
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后可能该用户某些功能将无法操作，确定要删除该成员么？`,'删除成员', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.memberManageDelete({id: id}).then((res) => {
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
            },
        }
    }
</script>

<style scoped>

</style>
