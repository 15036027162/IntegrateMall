<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:honorconfig:add')">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="name" label="荣誉表彰名称"></el-table-column>
            <el-table-column
                    prop="winUrl"
                    label="徽章图片">
                <template slot-scope="scope">
                    <img v-if="scope.row.winUrl" :src="scope.row.winUrl" width="50px" style="margin-right: 30px" />
                    <img v-if="scope.row.noWinUrl" :src="scope.row.noWinUrl" width="50px" />
                </template>
            </el-table-column>
            <el-table-column
                    prop="backUrl"
                    label="表彰证书背景">
                <template slot-scope="scope">
                    <img v-if="scope.row.backUrl" :src="scope.row.backUrl" width="50px" />
                </template>
            </el-table-column>
            <el-table-column prop="creatorName" label="操作人"></el-table-column>
            <el-table-column prop="modifyTime" label="更新时间" width="200"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" v-if="isAuth('web:honorconfig:edit')">编辑</el-button>
                    <el-button type="text" size="small" style="color: #F56C6C" @click="handleDel(scope.row.id)" v-if="isAuth('web:honorconfig:delete')">删除</el-button>
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
        name: "honorSetting",
        data(){
            return{
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0
            }
        },
        created() {
            this.getDataList()
        },
        methods:{
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let res = await this.$http.commendationSetList({
                    pageNumber:this.pageIndex,
                    pageSize:this.pageSize
                });
                if (res.code === '0') {
                    this.dataListLoading = false
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                }
            },
            /*新增*/
            addHandle(){
                this.$router.push({name: 'addHonor'})
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
            handleSet(id){
                this.$router.push({
                    path: `/honorSetting/editHonor/${id}`
                })
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后，影响已发布的表彰信息，请谨慎操作！`, '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.commendationSetDelete({
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
