<template>
    <div>
        <el-table
                :data="tableData"
                v-loading="dataListLoading"
                style="width: 100%"
                border>
            <el-table-column prop="gradeTag" label="等级"></el-table-column>
            <el-table-column prop="gradeName" label="等级称号"></el-table-column>
            <el-table-column
                    prop="icon"
                    label="图标">
                <template slot-scope="scope">
                    <img v-if="scope.row.icon" :src="scope.row.icon" alt width="50px" />
                </template>
            </el-table-column>
            <el-table-column prop="integral" label="所需积分"></el-table-column>
            <el-table-column prop="introduce" label="等级描述"></el-table-column>
            <el-table-column prop="modifier" label="操作人"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="120"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleSet(scope.row.id)" v-if="isAuth('web:grade:edit')">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "levelSet",
        data(){
            return{
                /*列表*/
                tableData: [],
                dataListLoading:false
            }
        },
        mounted() {
            this.getDataList()
        },
        methods:{
            /*列表*/
            async getDataList(){
                this.dataListLoading = true
                let res = await this.$http.getGradeList()
                if(res.status==='success'){
                    this.dataListLoading = false
                    this.tableData = res.data
                }
            },
            /*编辑*/
            handleSet(id){
                this.$router.push({ path: `/levelSet/levelEdit/${id}`})
            }
        }
    }
</script>

<style scoped>

</style>
