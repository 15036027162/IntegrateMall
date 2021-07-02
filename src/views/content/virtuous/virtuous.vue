<template>
    <div>
        <el-form :inline="true" :model="virtuousForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="显示状态：">
                <el-select v-model="virtuousForm.status" placeholder="请选择" clearable>
                    <el-option label="全部" :value="''"></el-option>
                    <el-option label="禁用" :value="1"></el-option>
                    <el-option label="启用" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名：">
                <el-input v-model="virtuousForm.name" placeholder="输入姓名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:redblack:add')">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="memberIdRegion" label="所属村组"></el-table-column>
            <el-table-column prop="title" label="上榜理由"></el-table-column>
            <el-table-column prop="createTime" label="发布日期"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="{row}">
                    <el-tag v-if="row.status == 0" size="small" type="success">公示中</el-tag>
                    <el-tag v-if="row.status == 1" size="small" type="danger">已撤销</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="handleDel(scope.row.id)" style="color: #F56C6C" v-if="isAuth('web:redblack:cancel')&&scope.row.status==0">撤榜</el-button>
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
        name: "virtuous",
        components:{ provinces },
        data(){
            return{
                isReset:false,  //重置地区
                virtuousForm:{
                    status:'',
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
                let res = await this.$http.rankList({
                    areaCode:this.areaCode,
                    streetCode:this.streetCode,
                    villageCode:this.villageCode,
                    name:this.virtuousForm.name,
                    type:'',
                    status:this.virtuousForm.status,
                    pageNumber:this.pageIndex,
                    pageSize:this.pageSize,
                });
                if (res.code === '0') {
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
                this.$router.push({name: 'virtuousAdd'})
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.isReset = true
                this.virtuousForm.name = ''
                this.virtuousForm.status = ''
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
                this.$router.push({
                    path: `/virtuous/virtuousView/${id}`
                })
            },
            /*撤榜*/
            handleDel(id){
                this.$confirm(`你确定要撤销该用户的公示情况么？`,'撤榜操作', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.updateState({
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
            },
        }
    }
</script>

<style scoped>

</style>
