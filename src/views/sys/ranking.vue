<template>
    <div>
        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="rankName" label="排名类型"></el-table-column>
            <el-table-column prop="isShow" label="APP显示">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isShow == 1" size="small" type="success">显示</el-tag>
                    <el-tag v-else-if="scope.row.isShow == 0" size="small" type="danger">不显示</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="num" label="排名榜位数"></el-table-column>
            <el-table-column prop="isBase" label="是否包含基础分">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isBase == 1" size="small" type="success">包含</el-tag>
                    <el-tag v-else-if="scope.row.isBase == 0" size="small" type="danger">不包含</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="modifier" label="操作人"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="120"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" v-if="isAuth('web:rank:edit')">编辑</el-button>
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

        <!--编辑内容-->
        <el-dialog
                title="编辑"
                :visible.sync="dialogVisible"
                @close="handleReset"
                width="450px">
            <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="130px" >
                <el-form-item label="排名榜位数：" prop="num">
                    <el-input type="number" v-model="addForm.num" placeholder="请输入排名榜位数" :precision="1" clearable></el-input>
                </el-form-item>
                <el-form-item label="APP显示：" required>
                    <el-radio-group v-model="addForm.isShow">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">不显示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="基础分：" required>
                    <el-radio-group v-model="addForm.isBase">
                        <el-radio :label="1">包含</el-radio>
                        <el-radio :label="0">不包含</el-radio>
                    </el-radio-group>
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
        name: "ranking",
        data(){
            return{
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                id:'',
                dialogVisible:false,
                addForm:{
                    isShow:1,
                    num:0,
                    isBase:1,
                },
                addRules:{
                    num:[
                        { required: true, message: '请输入排名榜位数', trigger: 'blur' },
                        { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1})?$)/, message: '显示顺序必须为数字值,可保留一位小数' }
                    ]
                }
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
                    pageSize:this.pageSize
                }
                let res = await this.$http.getRankPageList(data)
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
                this.getDataList()
            },
            // 当前页
            currentChangeHandle (val) {
                this.pageIndex = val
                this.getDataList()
            },
            /*编辑*/
            async handleSet(id){
                this.dialogVisible = true
                this.id = id
                await this.$http.getRankById({id:id}).then(res => {
                    if (res.code === '0') {
                        this.addForm.isShow = res.data.isShow
                        this.addForm.num = res.data.num
                        this.addForm.isBase = res.data.isBase
                    }
                })
            },
            /*取消*/
            handleReset(){
                this.$refs['addForm'].resetFields()
                this.dialogVisible = false
            },
            /*确定*/
            handleDepart(){
                this.$refs['addForm'].validate(async (valid) => {
                    if (valid) {
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        let data = {
                            id: this.id,
                            name: session_adminInfo.name,
                            isShow: this.addForm.isShow,
                            num: this.addForm.num,
                            isBase: this.addForm.isBase
                        }
                        await this.$http.getRankPageUpdate(data).then(res => {
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
                })
            },
        }
    }
</script>

<style scoped>

</style>
