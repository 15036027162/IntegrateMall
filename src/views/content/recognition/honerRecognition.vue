<template>
    <div>
        <el-form :inline="true" :model="honerForm" class="demo-form-inline">
            <el-form-item label="区域选择：">
                <provinces @changeTown="changeTown" :isReset="isReset"></provinces>
            </el-form-item>
            <el-form-item label="显示状态：">
                <el-select v-model="honerForm.state" placeholder="请选择" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option label="置顶显示" :value="1"></el-option>
                    <el-option label="显示" :value="2"></el-option>
                    <el-option label="隐藏" :value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="表彰名称：">
                <el-input v-model="honerForm.title" placeholder="输入发布的表彰名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="searchManage">查询</el-button>
                <el-button type="success" size="medium" @click="addHandle" v-if="isAuth('web:honor:add')">新增</el-button>
                <el-button size="medium" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="title" label="表彰名称"></el-table-column>
            <el-table-column prop="publishRegion" label="所属村组">
                <template slot-scope="{row}">
                    <span v-if="row.areaName">{{row.areaName}}</span>
                    <span v-if="row.streetName"> - {{row.streetName}}</span>
                    <span v-if="row.villageName"> - {{row.villageName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发布日期"></el-table-column>
            <el-table-column prop="status" label="月评季奖状态">
                <template slot-scope="{row}">
                    <el-tag v-if="row.status == 1" size="small" type="success">置顶显示</el-tag>
                    <el-tag v-if="row.status == 2" size="small">显示</el-tag>
                    <el-tag v-if="row.status == 3" size="small" type="danger">隐藏</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="180"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
                    <el-button type="text" size="small" @click="handleUpdate(scope.row.id)" v-if="isAuth('web:honor:edit')" style="color:#E6A23C">编辑</el-button>
                    <el-button type="text" size="small" @click="handleSet(scope.row)" v-if="isAuth('web:honor:config')">显示设置</el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.row)" style="color:#F56C6C" v-if="isAuth('web:honor:delete')">删除</el-button>
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

        <!--显示选择-->
        <el-dialog
                title="月评季奖状态"
                :visible.sync="dialogVisible"
                width="350px">
            <el-form ref="statusForm" :model="statusForm">
                <el-form-item>
                    <el-radio-group v-model="statusForm.status">
                        <el-radio :label="1">置顶显示</el-radio>
                        <el-radio :label="2">显示</el-radio>
                        <el-radio :label="3">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureChange()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import provinces from "@/components/public/provinces";
    export default {
        name: "honerRecognition",
        components:{ provinces },
        data(){
            return{
                isReset:false,  //重置地区
                honerForm:{
                    state:'',
                    type:'',
                    title:''
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
                memberId:'',
                deptLevel:0,
                statusForm:{
                    id:1,
                    status:'1'
                },
                dialogVisible:false
            }
        },
        created() {
            this.getCode()
            this.getDataList()
        },
        methods:{
            getCode(){
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                this.memberId = session_adminInfo.memberId || '';
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
                    type:this.honerForm.type,
                    status:this.honerForm.state,
                    title:this.honerForm.title,
                    pageNumber:this.pageIndex,
                    pageSize:this.pageSize,
                    areaCode: this.areaCode,
                    streetCode: this.streetCode,
                    villageCode: this.villageCode
                }
                let res = await this.$http.monthlyAward(data)
                if(res.status==='success'){
                    this.dataListLoading = false
                    this.tableData = res.data.list
                    this.totalPage = res.data.total
                    this.tableData.map(k=>{
                        if(k.status==1){
                            k.statusName = '置顶显示'
                        }else if (k.status==2){
                            k.statusName = '显示'
                        }else{
                            k.statusName = '隐藏'
                        }
                        if(k.modifyTime){
                            return  k.modifyTime
                        }else{
                            k.modifyTime = '--'
                        }
                    })
                }
            },
            /*查询*/
            searchManage(){
                this.pageIndex = 1
                this.getDataList()
            },
            /*新增*/
            addHandle(){
                this.$router.push({name: 'addRecognition'})
            },
            /*重置*/
            resetForm(){
                this.pageIndex = 1
                this.honerForm.status = ''
                this.honerForm.type = ''
                this.honerForm.title = ''
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
                this.$router.push({ path: `/honerRecognition/moreRecognition/${id}`});
            },
            /*编辑*/
            handleUpdate(id){
                this.$router.push({ path: `/honerRecognition/editRecognition/${id}`});
            },
            /*显示设置*/
            handleSet(val){
                this.dialogVisible = true
                this.statusForm.status = val.status
                this.statusForm.id = val.id
            },
            //删除
            handleDelete(item) {
                this.$confirm("删除后不可恢复，您确定要继续吗?", "删除提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(async (_) => {
                        const res = await this.$http.monthlyAwardDel({
                            id: item.id,
                        });
                        if (res.code == 0) {
                            this.$message({
                                type: "success",
                                message: res.msg,
                            });
                            this.getCode()
                            this.getDataList()
                        } else {
                            this.$message({
                                type: "error",
                                message: res.msg,
                            });
                        }
                    })
                    .catch((_) => {});
            },
            /*确定*/
            async sureChange(){
                let res = await this.$http.monthlyAwardUpdate({
                    id:this.statusForm.id,
                    status:this.statusForm.status
                })
                if(res.status==='success'){
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        duration: 1000,
                    });
                    this.dialogVisible = false
                    this.getCode()
                    this.getDataList()
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                        duration: 1000,
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>
