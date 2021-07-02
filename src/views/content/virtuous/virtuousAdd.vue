<template>
    <div>
        <el-form :model="virtuousAddForm" :rules="rulesBill" label-width="100px" ref="virtuousAddForm" style="width: 60%;min-width: 800px">
            <el-form-item label="上榜理由：" prop="theme">
                <el-input type="textarea" v-model="virtuousAddForm.theme" placeholder="请输入100字以内的上榜理由" class="textareaStyle"></el-input>
            </el-form-item>
            <el-form-item label="人员选择：" required>
                <el-button size="medium" @click="addBill">+ 添加</el-button>
                <span class="addBillNum">已添加 {{virtuousAddForm.billList.length}} 人</span>
                <!--添加审核-->
                <div class="honerRecognition">
                    <el-tag
                            :key="index"
                            v-for="(tag,index) in virtuousAddForm.billList"
                            closable
                            :disable-transitions="false"
                            @close="clearBillRed(tag)">
                        {{tag.name}}
                    </el-tag>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100px" type="primary" size="medium" @click="releaseBillboard" :disabled="releaseShow">发布</el-button>
            </el-form-item>
        </el-form>
        <!--新增成员-->
        <honerModel ref="honerModel" @addMember="addMember"></honerModel>
    </div>
</template>

<script>
    import honerModel from "@/components/public/honerModel";
    export default {
        name: "virtuousAdd",
        components:{honerModel},
        data(){
            return{
                virtuousAddForm:{
                    theme: '',
                    billList: []
                },
                rulesBill:{
                    theme: [
                        {required: true, min: 1, message: '请输入上榜理由', trigger: 'blur'},
                        {max: 100, message: '字符超过限制', trigger: 'blur'}
                    ]
                },
                releaseShow:false
            }
        },
        methods:{
            /*人员选择*/
            addBill(){
                this.$refs.honerModel.showHoner = true
            },
            /*新增成员*/
            addMember(val) {
                let _this = this
                _this.virtuousAddForm.billList.push({editMemberId: val.memberId, name: val.name})
            },
            /*审核删除*/
            clearBillRed(tag) {
                this.virtuousAddForm.billList.splice(this.virtuousAddForm.billList.indexOf(tag), 1);
            },
            /*发布*/
            releaseBillboard(){
                this.$refs['virtuousAddForm'].validate(async (valid) => {
                    if (valid) {
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        let areaCode = session_adminInfo.areaCode
                        let areaName = session_adminInfo.areaName
                        let streetCode = session_adminInfo.streetCode
                        let streetName = session_adminInfo.streetName
                        let villageCode = session_adminInfo.villageCode
                        let villageName = session_adminInfo.villageName
                        let data = {
                            type: 1,
                            title: this.virtuousAddForm.theme,
                            areaCode: areaCode,
                            streetCode: streetCode,
                            villageCode: villageCode,
                            areaName: areaName,
                            streetName: streetName,
                            villageName: villageName,
                            list: this.virtuousAddForm.billList,
                        }
                        if(this.virtuousAddForm.billList.length>0){
                            this.releaseShow = true
                            let res = await this.$http.rankSave(data)
                            if (res.status === 'success') {
                                this.$message({
                                    type: 'success',
                                    message: res.msg || '发布成功',
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'virtuous'});
                                    this.releaseShow = false
                                }, 1000);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.releaseShow = false
                                }, 1000);
                            }
                        }else{
                            this.$message({type: 'warning', message: '人员不能为空'})
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    .addBillNum{
        color: #999;
        font-size: 12px;
        margin-left: 15px;
    }
    .textareaStyle{
        .el-textarea__inner{
            min-height: 100px !important;
        }
    }
</style>
