<template>
    <div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:card:add')">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="orderNum" label="序号"></el-table-column>
            <el-table-column prop="cardName" label="积分存折"></el-table-column>
            <el-table-column
                    prop="icon"
                    label="图标">
                <template slot-scope="scope">
                    <img v-if="scope.row.icon" :src="scope.row.icon" alt width="50px" />
                </template>
            </el-table-column>
            <el-table-column
                    prop="background"
                    label="背景底图">
                <template slot-scope="scope">
                    <img v-if="scope.row.background" :src="scope.row.background" alt width="80px" />
                </template>
            </el-table-column>
            <el-table-column prop="isBase" label="是否包含基础分">
                <template slot-scope="{row}">
                    <el-tag v-if="row.isBase == 0" size="small" type="danger">否</el-tag>
                    <el-tag v-if="row.isBase == 1" size="small" type="success">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="isDonate" label="是否可以捐赠">
                <template slot-scope="{row}">
                    <el-tag v-if="row.isDonate == 0" size="small" type="danger">否</el-tag>
                    <el-tag v-if="row.isDonate == 1" size="small" type="success">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="modifier" label="操作人"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" v-if="isAuth('web:card:edit')">编辑</el-button>
                    <el-button type="text" size="small" style="color: #F56C6C" @click="handleDel(scope.row.id)" v-if="isAuth('web:card:delete')">删除</el-button>
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
        name: "depositSet",
        data(){
            return{
                depositForm:{
                    id: 0
                },
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0
            }
        },
        mounted() {
            this.getDataList()
        },
        methods:{
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let res = await this.$http.getCardList();
                if (res.code === '0') {
                    this.dataListLoading = false
                    this.tableData = res.data
                    this.totalPage = parseInt(res.total)
                }
            },
            /*新增*/
            addHandle(){
                this.$router.push({name: 'depositAdd'})
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
                this.$router.push({ path: `/depositSet/depositEdit/${id}`});
            },
            /*删除*/
            handleDel(id){
                this.$confirm(`删除后，引用该分类的内容可能无法使用，请谨慎操作！`,'删除存折', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.cardDelete({id: id}).then((res) => {
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
