<template>
    <div>
        <el-form :inline="true" :model="roleForm" class="demo-form-inline">
            <el-form-item label="角色名称：">
                <el-input v-model="roleForm.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select v-model="roleForm.status" placeholder="请选择" clearable>
                    <el-option label="全部" :value="0"></el-option>
                    <el-option label="启动" :value="1"></el-option>
                    <el-option label="禁用" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:role:add')">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="status" label="显示状态">
                <template slot-scope="{row}">
                    <el-tag v-if="row.status == 1" size="small" type="success">启用</el-tag>
                    <el-tag v-if="row.status == 2" size="small" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="modifier" label="操作人"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="handleUp(scope.row.id,1)" v-if="isAuth('web:role:disable')&&scope.row.status== 2">启用</el-button>
                    <el-button type="text" size="small" style="color: #909399" v-if="isAuth('web:role:disable')&&scope.row.status == 1" @click="handleUp(scope.row.id,2)">禁用</el-button>
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" style="color: #E6A23C" v-if="isAuth('web:role:edit')">编辑</el-button>
                    <el-button type="text" size="small" style="color: #F56C6C" @click="handleDel(scope.row.id)" v-if="isAuth('web:role:delete')">删除</el-button>
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
    export default {
        name: "roleManage",
        data(){
            return{
                roleForm:{
                    name:'',
                    status:0
                },
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                villageCode:'',
                memberId:''
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.villageCode = session_adminInfo.villageCode || '';
            this.memberId = session_adminInfo.memberId || 0;
            this.getDataList()
        },
        methods:{
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let data = {
                    pageNo:this.pageIndex,
                    pageSize:this.pageSize,
                    status:this.roleForm.status,
                    roleName:this.roleForm.name,
                }
                let res = await this.$http.getRolePageList(data)
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
                this.$router.push({name: 'addRole'})
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.roleForm.status = 0
                this.roleForm.name = ''
                this.getDataList()
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
                this.$router.push({ path: `/roleManage/moreRole/${id}`});
            },
            /*启用，禁用*/
            handleUp(id,status){
                let txt = ''
                let title = ''
                if(status == 1){
                    txt = '确定要启用色【内容管理员】么？'
                    title = '启用角色'
                }else{
                    txt = '禁用角色后，所有相关联的用户可能部分功能无法操作！确定要禁用么？'
                    title = '禁用角色'
                }
                this.$confirm(txt, title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                    let res = await this.$http.updateStatus({
                        id:id,
                        name:session_adminInfo.name,
                        status:status
                    })
                    if (res.code === '0') {
                        this.$message({
                            type: 'success',
                            message: res.msg
                        })
                        this.getDataList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }
                }).catch(() => {})
            },
            /*编辑*/
            handleSet(id){
                this.$router.push({ path: `/roleManage/editRole/${id}`});
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后，引用该分类的内容可能无法使用，请谨慎操作！`, '删除存折', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.deleteRole({
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
