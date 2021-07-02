<template>
    <div>
        <el-form :inline="true" :model="villageForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
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
            <el-table-column prop="villageName" label="乡村名称"></el-table-column>
            <el-table-column prop="areaName" label="所属县镇">
                <template slot-scope="scope">
                    <span v-if="scope.row.streetName">{{scope.row.streetName}}</span>
                    <span v-if="scope.row.villageName"> - {{scope.row.villageName}}</span>
                </template>
            </el-table-column>
            <!--<el-table-column prop="villageHeader" label="村管理员"></el-table-column>-->
            <el-table-column prop="isOpen" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isOpen == 0" size="small" type="success">已开通</el-tag>
                    <el-tag v-else-if="scope.row.isOpen == 1" size="small" type="danger">未开通</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="modifyTime" label="更新时间" width="200"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="120"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleSet(scope.row,0)" v-if="isAuth('web:villagemanage:open')&&scope.row.isOpen==1">开通</el-button>
                    <el-button type="text" size="small" style="color: #F56C6C" @click="handleSet(scope.row,1)" v-if="isAuth('web:villagemanage:close')&&scope.row.isOpen==0">关闭</el-button>
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
    import provinces from "../../components/public/provinces";
    export default {
        name: "village",
        components:{ provinces },
        data(){
            return{
                villageForm:{},
                isReset:false,  //重置地区
                /*列表*/
                tableData: [],
                dataListLoading:false,
                /*分页*/
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                areaCode:'',
                areaName:'',
                streetCode:'',
                streetName:'',
                villageCode:'',
                villageName:'',
                deptLevel:0
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
                    areaCode:this.areaCode,
                    streetCode:this.streetCode,
                    villageCode:this.villageCode,
                    pageNumber:this.pageIndex,
                    pageSize:this.pageSize
                }
                let res = await this.$http.villageOpenList(data)
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

            /*启动，关闭*/
            handleSet(item,isOpen){
                console.log(item);
                let txt = ''
                let title = ''
                if(isOpen == 0){
                    txt = '您确定要开通乡村么'
                    title = '开通乡村'
                }else{
                    txt = '你确定要关闭乡村么'
                    title = '关闭乡村'
                }
                this.$confirm(txt, title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.$http.villageOpen({
                        areaCode: item.areaCode,
                        areaName: item.areaName,
                        streetCode: item.streetCode,
                        streetName: item.streetName,
                        villageCode: item.villageCode,
                        villageName: item.villageName,
                        isOpen: isOpen
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
