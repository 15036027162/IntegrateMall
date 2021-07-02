<template>
    <div>
        <el-form :model="memberEdit" label-width="120px"  :rules="rulesEdit" ref="memberEdit">
            <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="memberEdit.mobile" placeholder="请输入手机号" style="width: 300px;margin-right: 50px"></el-input>
                <el-button type="primary" size="medium" @click="searchMoblie" >查询</el-button>
            </el-form-item>
            <div v-if="showGetUser">
                <ul class="userMember" v-if="getUser.account">
                    <li>用户名：{{getUser.account}}</li>
                </ul>
            </div>
            <el-form-item label="姓名：" prop="name">
                <el-input v-model="memberEdit.name" placeholder="请输入姓名" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="ssex" class="formItems" required>
                <el-radio-group v-model="memberEdit.ssex">
                    <el-radio label="1">男</el-radio>
                    <el-radio label="0">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="职务：" prop="post">
                <el-input v-model="memberEdit.post" placeholder="请输入2~12个字的职务名称" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="linkMobile">
                <el-input v-model="memberEdit.linkMobile" placeholder="请输入联系电话" style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <!--<el-form-item label="管理员选择：" prop="isDistrict">
                <el-select v-model="memberEdit.isDistrict" placeholder="&#45;&#45;请选择&#45;&#45;" clearable>
                    <el-option label="&#45;&#45;请选择&#45;&#45;" value=""></el-option>
                    <el-option label="普通管理员" :value="0"></el-option>
                    <el-option v-if="deptLevel!=5" label="系统管理员" :value="1"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item label="区域选择：" class="is-required">
                <provinces @changeTown="changeTown" :isadd="true"></provinces>
            </el-form-item>
            <!--<el-form-item label="角色选择：" prop="roleList" v-if="memberEdit.isDistrict === 0">-->
            <el-form-item label="角色选择：" prop="roleList">
                <el-checkbox-group v-model="memberEdit.roleList" v-if="typeRole.length>0">
                    <el-checkbox v-for="(item,index) in typeRole" :key="index" :label="item.id" name="type">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
                <span v-else style="color: red;font-size: 12px">该区域下没有角色，请重新选择</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('memberEdit')" :disabled="submitOver" style="width: 150px">确定添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import provinces from "@/components/public/provinces1";
    export default {
        name: "memberAdd",
        components:{provinces},
        data() {
            const mobileSms = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入联系人电话'));
                } else {
                    let regPone = null;
                    let mobile = /^1[3456789]\d{9}$/; //11位手机正则
                    let tel = /^(0[0-9]{2,3}\-)([2-9][0-9]{4,7})+(\-[0-9]{1,4})?$/; //座机
                    if (value.charAt(0) == 0) {
                        regPone = tel;
                    } else {
                        regPone = mobile;
                    }
                    if (!regPone.test(value)) {
                        return callback(
                            new Error("请填写正确的联系人电话")
                        );
                    }
                    callback();
                }
            };
            return {
                memberEdit:{
                    mobile:'',
                    name:'',
                    ssex:'1',
                    post:'',
                    linkMobile:'',
                    isDistrict:0,
                    roleList:[]
                },
                rulesEdit:{
                    mobile:[
                        {required: true, message: '请输入用户名', trigger: 'blur', type: "string"}
                    ],
                    name:[
                        {required: true, message: '请输入姓名', trigger: 'blur', type: "string"},
                        { min:1, max: 10, message: '姓名长度不得超过 10 字符', trigger: 'blur' }
                    ],
                    post: [
                        { required: true, message: '请输入职务名称', trigger: 'blur' },
                        { min:2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur' }
                    ],
                    linkMobile:[
                        {required: true, message: '请输入联系方式', trigger: 'blur', type: "string"},
                        {validator: mobileSms, trigger: 'blur'}
                    ],
                    // isDistrict: [
                    //     {required: true, message: "请选择管理员", trigger: "change"}
                    //     ],
                    roleList: [
                        {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
                    ]
                },
                typeRole:[],
                showGetUser:false,
                getUser:{},
                changeTips:false,
                memberId: '',
                areaCode: '',
                streetCode: '',
                villageCode: '',
                areaName: '',
                streetName: '',
                villageName: '',
                submitOver: false,
                deptLevel: '',
                deptDistrictsCode: ''
            };
        },
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0
            this.areaCode = session_adminInfo.areaCode
            this.areaName = session_adminInfo.areaName
            this.deptLevel = session_adminInfo.deptLevel
            this.deptDistrictsCode = session_adminInfo.deptDistrictsCode
            if(this.deptLevel==4){
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
            }else if(this.deptLevel==5){
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
                this.villageCode = session_adminInfo.villageCode
                this.villageName = session_adminInfo.villageName
            }
            this.getUserRole(this.deptDistrictsCode)
        },
        methods: {
            async getUserRole(code){
                let res = await this.$http.getRoleList({deptDistrictsCode:code});
                let arr = []
                if(res.status==='success'){
                    res.data.map(k=>{
                        let obj = {}
                        obj.roleName = k.roleName
                        obj.id = k.id
                        arr.push(obj)
                    })
                    this.typeRole = arr
                }
            },
            /*手机号获取成员信息*/
            async searchMoblie(){
                let res = await this.$http.getMemberByMobile({mobile:this.memberEdit.mobile});
                if(res.status==='success'){
                    this.showGetUser = true
                    if(res.data.length>0){
                        this.getUser = res.data[0]
                        this.memberEdit.ssex = res.data[0].ssex || '1'
                        this.memberEdit.name = res.data[0].name || ''
                    }else{
                        this.memberEdit.ssex ='1'
                        this.memberEdit.name =''
                        this.getUser = {}
                        this.$message({
                            type: 'warning',
                            message: '该用户未注册',
                            duration: 1000,
                        })
                    }
                }else{
                    this.$message({
                        type: 'warning',
                        message: res.msg,
                        duration: 1000,
                    })
                }
            },
            /*区域选择*/
            changeTown(val) {
                this.areaCode = val.cityCode
                this.areaName = val.cityName
                this.streetCode = val.townCode
                this.streetName = val.townName
                this.villageCode = val.villageCode
                this.villageName = val.villageName
                let code = ''
                if(this.areaCode.length>0&&this.streetCode.length==0&&this.villageCode==0){
                    code = this.areaCode
                }else if(this.areaCode.length>0&&this.streetCode.length>0&&this.villageCode==0){
                    code = this.streetCode
                }else if(this.areaCode.length>0&&this.streetCode.length>0&&this.villageCode>0){
                    code = this.villageCode
                }
                this.getUserRole(code)
            },
            /*添加*/
            async submitForm(memberEdit){
                this.$refs[memberEdit].validate(async (valid) => {
                    if (valid) {
                        if(this.showGetUser==true){
                            let data = {
                                editMemberId:this.getUser.memberId || '',
                                name:this.memberEdit.name,
                                mobile:this.memberEdit.mobile,
                                ssex:this.memberEdit.ssex,
                                position:this.memberEdit.post,
                                linkMobile:this.memberEdit.linkMobile,
                                type:this.memberEdit.isDistrict,
                                areaCode: this.areaCode,
                                streetCode: this.streetCode,
                                villageCode: this.villageCode,
                                areaName: this.areaName,
                                streetName: this.streetName,
                                villageName: this.villageName,
                                roles:this.memberEdit.roleList
                            }
                            this.submitOver = true
                            let res = await this.$http.memberManageSave(data);
                            if(res.status==='success'){
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    duration: 1000,
                                });
                                setTimeout(() => {
                                    this.$router.push({name: 'memberManage'});
                                    this.submitOver = false
                                }, 1000);
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    duration: 1500,
                                });
                                setTimeout(() => {
                                    this.submitOver = false
                                }, 1000);
                            }
                        }else{
                            this.$message({
                                type: 'warning',
                                message: '请先根据用户名查询用户是否注册！',
                                duration: 1500,
                            });
                        }
                    }
                })
            }
        },
    }
</script>

<style lang="less" scoped>
    .userMember{
        width: 300px;
        padding: 0px 20px;
        margin-bottom: 20px;
        margin-left: 100px;
    }
    .userMember li{
        margin-bottom: 10px;
    }
</style>
