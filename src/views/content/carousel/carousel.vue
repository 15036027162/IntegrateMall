<template>
    <div>
        <el-form :inline="true" :model="carouselForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="显示状态：">
                <el-select v-model="carouselForm.status" placeholder="请选择" clearable>
                    <el-option label="--请选择--" value></el-option>
                    <el-option label="上架" value="2"></el-option>
                    <el-option label="下架" value="4"></el-option>
                    <!--<el-option label="待审核" value="1"></el-option>
                    <el-option label="审核通过" value="2"></el-option>
                    <el-option label="审核不通过" value="3"></el-option>
                    <el-option label="已下架" value="4"></el-option>-->
                </el-select>
            </el-form-item>
            <el-form-item label="主题名称：">
                <el-input v-model="carouselForm.advName" placeholder="输入发布的主题名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle(1,1)" v-if="isAuth('web:carousel:add')">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="picUrl" label="图片">
                <template slot-scope="scope">
                    <img v-if="scope.row.picUrl" :src="scope.row.picUrl" alt height="50px" />
                </template>
            </el-table-column>
            <el-table-column prop="title" label="主题名称" width="300px" show-overflow-tooltip></el-table-column>
            <el-table-column prop="url" label="URL链接">
                <template slot-scope="scope">
                    <a :href="scope.row.url" target="_blank" style="color:#409EFF;text-decoration:underline">{{scope.row.url}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state == 2" size="small">上架</el-tag>
                    <el-tag v-if="scope.row.state == 4" size="small" type="danger">下架</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="addHandle(scope.row,2)" style="color: #E6A23C" v-if="scope.row.state==4&&isAuth('web:carousel:edit')">编辑</el-button>
                    <el-button type="text" size="small" @click="handleCheck(scope.row,2)" v-if="scope.row.state==4&&isAuth('web:carousel:down')&&deptLevel==3">上架</el-button>
                    <el-button type="text" size="small" @click="handleCheck(scope.row,4)" v-if="scope.row.state==2&&isAuth('web:carousel:down')&&deptLevel==3">下架</el-button>
                    <el-button type="text" size="small" @click="handleCheck(scope.row,3)" style="color: #F56C6C" v-if="isAuth('web:carousel:delete')">删除</el-button>
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
        name: "carousel",
        components:{ provinces },
        data(){
            return{
                isReset:false,  //重置地区
                carouselForm:{
                    status:'',
                    advName:''
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
                    advName:this.carouselForm.advName,
                    status:this.carouselForm.status,
                    areaCode: this.areaCode,
                    streetCode: this.streetCode,
                    villageCode: this.villageCode,
                    pageNumber:this.pageIndex,
                    pageSize:this.pageSize
                }
                let res = await this.$http.advList(data)
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
            /*新增/编辑*/
            addHandle(item,type){
                if (type == 1) {
                    this.$router.push({
                        name: "carouselAdd",
                        query: {
                            type: 1,
                        },
                    });
                } else if (type == 2) {
                    this.$router.push({
                        name: "carouselAdd",
                        query: {
                            id: item.id,
                            type: 2,
                        },
                    });
                }
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.carouselForm.advName = ''
                this.carouselForm.status = ''
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
            formatter(item) {
                if (item.state == 1) {
                    return "待审核";
                } else if (item.state == 2) {
                    return "审核通过";
                } else if (item.state == 3) {
                    return "审核不通过";
                } else if (item.state == 4) {
                    return "未上架";
                }
            },
            /*查看*/
            handleView(id){
                this.$router.push({ path: `/carousel/carouselView/${id}`});
            },
            /*上下架/删除*/
            handleCheck(item,type){
                if (type == 2) {
                    this.$confirm("您确定要上架该商业信息吗?", "上架操作", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(() => {
                            this.exam(item, type);
                        }).catch(() => {});
                } else if (type == 4) {
                    this.$confirm("您确定要下架该商业信息吗?", "下架操作", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.exam(item, type);
                        }).catch(() => {});
                } else if (type == 3) {
                    this.$confirm("删除后将不在app展示，确定要删除么?", "删除商业信息", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.exam(item, type);
                        }).catch(() => {});
                }
            },
            async exam(item, type) {
                const res = await this.$http.advUpdateState({
                    id: item.id,
                    type: type
                });
                if (res.code === "0") {
                    this.$message({
                        type: "success",
                        message: res.msg,
                    });
                    this.getDataList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg,
                    });
                }
            },
        }
    }
</script>

<style scoped>

</style>
