<template>
    <div>
        <el-form :inline="true" :model="tabSetForm" class="demo-form-inline">
            <el-form-item label="类别用途：">
                <el-select v-model="tabSetForm.category" placeholder="请选择" clearable>
                    <el-option label="--请选择--" :value="0"></el-option>
                    <el-option label="信息公开tab" :value="1"></el-option>
                    <el-option label="积分说明tab" :value="2"></el-option>
                    <el-option label="乡村影集tab" :value="3"></el-option>
                    <el-option label="圈子tab" :value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:tab:add')">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="tabName" label="Tab名称"></el-table-column>
            <el-table-column prop="category" label="类别用途">
                <template slot-scope="{row}">
                    <span v-if="row.category == 1">信息公开tab</span>
                    <span v-if="row.category == 2">积分说明tab</span>
                    <span v-if="row.category == 3">乡村影集tab</span>
                    <span v-if="row.category == 4">圈子tab</span>
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
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" v-if="isAuth('web:tab:edit')">编辑</el-button>
                    <el-button type="text" size="small" style="color: #F56C6C" @click="handleDel(scope.row.id)" v-if="isAuth('web:tab:delete')">删除</el-button>
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

        <!--新增内容-->
        <el-dialog
                :title="changeTitle"
                :visible.sync="dialogVisible"
                @close="handleReset"
                width="350px">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="100px" >
                <el-form-item label="类别用途：" prop="category" v-if="formType==1">
                    <el-select v-model="addForm.category" placeholder="请选择" clearable>
                        <el-option label="--请选择--"></el-option>
                        <el-option label="信息公开tab" :value="1"></el-option>
                        <el-option label="积分说明tab" :value="2"></el-option>
                        <el-option label="乡村影集tab" :value="3"></el-option>
                        <el-option label="圈子tab" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别用途：" prop="category" v-if="formType==2">
                    <el-select v-model="addForm.category" disabled>
                        <el-option label="--请选择--"></el-option>
                        <el-option label="信息公开tab" :value="1"></el-option>
                        <el-option label="积分说明tab" :value="2"></el-option>
                        <el-option label="乡村影集tab" :value="3"></el-option>
                        <el-option label="圈子tab" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类别名称：" prop="name">
                    <el-input v-model="addForm.name" placeholder="请输入8字以内的名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleReset">取 消</el-button>
                <el-button type="primary" @click="handleDepart">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "tabSet",
        data(){
            return{
                tabSetForm:{
                    category: 0
                },
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                changeTitle:'',
                dialogVisible:false,
                addForm:{
                    id:'',
                    category:'',
                    name:''
                },
                addRules:{
                    category: [
                        {required: true, message: '请选择积分存折', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入8字以内的名称', trigger: 'blur'},
                        {min: 1, max: 8, message: '标题长度不得超过 8 字符', trigger: 'blur'}
                    ]
                },
                formType:0  //新增||编辑
            }
        },
        created() {
            this.getDataList()
        },
        methods:{
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let data = {
                    pageNo:this.pageIndex,
                    pageSize:this.pageSize,
                    category:this.tabSetForm.category,
                }
                let res = await this.$http.getTabPageList(data);
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
                this.changeTitle = '添加类别'
                this.dialogVisible = true
                this.formType = 1
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.tabSetForm.category = 0
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
            /*编辑*/
            async handleSet(id){
                this.changeTitle = '编辑类别'
                this.dialogVisible = true
                this.formType = 2
                await this.$http.tabGetTabById({id:id}).then(res => {
                    if (res.code === '0') {
                        this.addForm.category = res.data.category
                        this.addForm.name = res.data.tabName
                        this.addForm.id = res.data.id
                    }
                })
            },
            /*取消*/
            handleReset(){
                this.$refs['addForm'].resetFields()
                this.addForm.category = ''
                this.addForm.name = ''
                this.dialogVisible = false
            },
            /*确定*/
            handleDepart(){
                this.$refs['addForm'].validate(async (valid) => {
                    if (valid) {
                        let data = {}
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        if(this.formType==1){
                            data = {
                                name:session_adminInfo.name,
                                tabName:this.addForm.name,
                                category: parseInt(this.addForm.category)
                            }
                            await this.$http.tabPageListAdd(data).then(res => {
                                if (res.code === '0') {
                                    this.$message({
                                        message: res.msg,
                                        type: 'success',
                                        duration: 1000
                                    })
                                    this.dialogVisible = false
                                    this.getDataList()
                                } else {
                                    this.$message.error(res.msg)
                                }
                            })
                        }else if(this.formType==2){
                            data = {
                                id:this.addForm.id,
                                name:session_adminInfo.name,
                                category: parseInt(this.addForm.category),
                                tabName:this.addForm.name
                            }
                            await this.$http.tabPageListUpdate(data).then(res => {
                                if (res.code === '0') {
                                    this.$message({
                                        message: res.msg,
                                        type: 'success',
                                        duration: 1000
                                    })
                                    this.dialogVisible = false
                                    this.getDataList()
                                } else {
                                    this.$message.error(res.msg)
                                }
                            })
                        }
                    }
                })
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后，引用该分类的内容可能无法使用，请谨慎操作！`, '删除存折', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.tabGetTabDelete({
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
