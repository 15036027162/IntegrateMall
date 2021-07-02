<template>
    <div>
        <el-form :model="publicityForm" :rules="publicityRules" label-width="140px" ref="publicityForm" style="width: 60%;min-width: 800px">
            <div class="userHeader">积分设置</div>
            <el-form-item class="changeNum" label="公示时间：" prop="publicity">
                <el-input type="number" v-model="publicityForm.publicity" style="width: 200px" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
                <span style="margin-left: 10px">天</span>
            </el-form-item>
            <el-form-item class="changeNum" label="1 积分 = " prop="money">
                <el-input type="number" v-model="publicityForm.money" style="width: 200px" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
            </el-form-item>
            <div class="userHeader">积分捐赠说明</div>
            <el-form-item class="changeNum" label="捐赠说明：" prop="introduce">
                <el-input type="textarea" minlength="0" maxlength="500" placeholder="输入500字以内的捐赠说明" :rows="12" v-model="publicityForm.introduce"></el-input>
            </el-form-item>
            <!--<div class="userHeader">微心愿内容设置</div>
            <el-form-item label="志愿者组织介绍：" prop="wish">
                <el-select v-model="publicityForm.wish" placeholder="请选择" clearable>
                    <el-option label="&#45;&#45;请选择&#45;&#45;" value=""></el-option> 
                    <el-option label="志愿者站" :value="1"></el-option>
                    <el-option label="爱卫协会" :value="2"></el-option>
                    <el-option label="我党支部" :value="3"></el-option>
                    <el-option label="健康协会" :value="4"></el-option>
                </el-select>
            </el-form-item>-->
            <!--
            <div class="userHeader">微课堂设置</div>
            <el-form-item label="外链接地址：">
                <el-input v-model="publicityForm.roomUrl" placeholder="请输入外链接地址"></el-input>
            </el-form-item>
            -->
            <el-form-item>
                <el-button type="primary" size="medium"  @click="submitForm" :disabled="submitOver" style="width: 150px" v-if="isAuth('web:system:sava')">保存</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "publicitySet",
        data(){
            const isIntegerNum = (rule, value, callback) => {
                const reg =  /^(?:[1-9]|1[0-5])$/;
                const rsCheck = reg.test(value);
                if (!rsCheck) {
                    callback(new Error('公示时间为1-15的整数'));
                } else {
                    callback();
                }
            };
            const isScoreNum = (rule, value, callback) => {
                const reg=/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/
                const rsCheck = reg.test(value);
                if (!rsCheck) {
                    callback(new Error('积分价值范围为0.01~100之间'));
                } else {
                    callback();
                }
            };
            return{
                publicityForm:{
                    publicity:1,
                    money:0.1,
                    introduce:'',
                    wish:''
                    //roomUrl:''
                },
                publicityRules:{
                    publicity:[
                        {required: true, message: '请输入公示时间', trigger: 'blur'},
                        {validator: isIntegerNum, trigger: 'blur'}
                    ],
                    money:[
                        {required: true, message: '请输入积分价值', trigger: 'blur'},
                        {validator: isScoreNum, trigger: 'blur'}
                    ],
                    introduce:[
                        {required: true, message: '请输入500字以内的捐赠说明', trigger: 'blur',min: 1, max: 500}
                    ],
                    wish:[
                        {required: true, message: '请选择志愿者组织介绍', trigger: 'change'}
                    ]
                },
                id:'',
                submitOver:false
            }
        },
        mounted() {
            this.getInfo()
        },
        methods:{
            /*详情*/
            async getInfo(){
                let res = await this.$http.getConfigInfo();
                if(res.status==='success'){
                    this.publicityForm = res.data
                    this.id = res.data.id
                }
            },
            /*保存*/
            submitForm(){
                this.$refs['publicityForm'].validate(async valid => {
                    let data = {
                        id:this.id,
                        publicity:this.publicityForm.publicity,
                        money:this.publicityForm.money,
                        introduce:this.publicityForm.introduce
                        /*wish:this.publicityForm.wish,*/
                        //roomUrl:this.publicityForm.roomUrl
                    }
                    if (valid) {
                        this.submitOver = true
                        const res = await this.$http.configUpdate(data);
                        if (res.status === "success") {
                            this.$message({
                                type: "success",
                                message: res.msg
                            });
                            setTimeout(() => {
                                this.getInfo()
                                this.submitOver = false
                            }, 1000);
                            this.$refs['publicityForm'].resetFields();
                        } else {
                            this.$message({
                                type: "error",
                                message: res.msg
                            });
                            setTimeout(() => {
                                this.submitOver = false
                            }, 1000);
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .scaleIcon{
        display: inline-block;
        width: 30px;
        margin: 0 10px;
    }
</style>
