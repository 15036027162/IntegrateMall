<template>
    <div>
        <el-form :model="memberChange" label-width="100px" :rules="rulesChange" ref='memberChange'>
            <el-form-item label="区划组织：">
                <div v-if="memberChange.areaName">
                    <span>{{memberChange.areaName}}</span>
                    <span v-if="memberChange.streetName"> - {{memberChange.streetName}}</span>
                    <span v-if="memberChange.villageName"> - {{memberChange.villageName}}</span>
                </div>
                <div v-else>--</div>
            </el-form-item>
            <el-form-item label="用户名：">{{memberChange.account}}</el-form-item>
            <el-form-item label="绑定手机号：">{{phoneNumFilterLogin(memberChange.mobile) || '暂未绑定'}}</el-form-item>
            <el-form-item label="姓名：">{{memberChange.name || '-'}}</el-form-item>
            <el-form-item label="性别：">{{memberChange.ssexName || '-'}}</el-form-item>
            <el-form-item label="角色：">{{memberChange.typeName || '-'}}</el-form-item>
            <el-form-item label="职务：" prop="position">
                <el-input v-model="memberChange.position" placeholder="请输入2~12个字的职务名称"
                          style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="联系方式：" prop="linkMobile">
                <el-input v-model="memberChange.linkMobile" placeholder="请输入联系电话"
                          style="width: 300px;margin-right: 50px"></el-input>
            </el-form-item>
            <el-form-item label="角色选择：" prop="roleList" v-if="memberChange.type==0">
                <el-checkbox-group v-model="memberChange.roleList">
                    <el-checkbox v-for="(item,index) in typeRole" :key="index" :label="item.id" name="type">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="changeForm" :disabled="changeOver" style="width: 150px;">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "memberAdd",
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
                memberChange: {
                    position: '',
                    linkMobile:'',
                    roleList:[],
                },
                rulesChange: {
                    linkMobile: [
                        {required: true, message: '请输入联系方式', trigger: 'blur'},
                        {validator: mobileSms, message: '请输入正确的联系方式', trigger: 'blur'}
                    ],
                    position: [
                        {required: true, message: '请输入职务名称', trigger: 'blur'},
                        {min: 2, max: 12, message: '请输入2~12个字的职务名称', trigger: 'blur'}
                    ],
                    roleList: [
                        {type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change'}
                    ]
                },
                typeRole:[],
                memberId:'',
                changeOver:false
            }
        },
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
            //this.getUserRole()
            this.getInfo()
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
                    this.$forceUpdate()
                }
            },
            /*获取成员信息*/
            async getInfo() {
                let res = await this.$http.memberManageInfo({id: this.$route.params.id});
                if (res.status === 'success') {
                    this.memberChange = res.data[0]
                    let code = ''
                    if(this.memberChange.areaCode.length>0&&this.memberChange.streetCode.length==0&&this.memberChange.villageCode==0){
                        code = this.memberChange.areaCode
                    }else if(this.memberChange.areaCode.length>0&&this.memberChange.streetCode.length>0&&this.memberChange.villageCode==0){
                        code = this.memberChange.streetCode
                    }else if(this.memberChange.areaCode.length>0&&this.memberChange.streetCode.length>0&&this.memberChange.villageCode>0){
                        code = this.memberChange.villageCode
                    }
                    this.getUserRole(code)
                    this.memberChange.roleList = res.data[0].roleList
                    if (this.memberChange.ssex == '1') {
                        this.memberChange.ssexName = '男'
                    } else if (this.memberChange.ssex == '0') {
                        this.memberChange.ssexName = '女'
                    }
                    if(this.memberChange.type==0){
                        this.memberChange.typeName = '普通管理员'
                    }else if(this.memberChange.type==1){
                        this.memberChange.typeName = '系统管理员'
                    }
                    this.$forceUpdate()
                }
            },
            /*修改*/
            async changeForm() {
                this.$refs['memberChange'].validate(async (valid) => {
                    if (valid) {
                        let dataObj = {
                            id: this.$route.params.id,
                            position: this.memberChange.position,
                            linkMobile: this.memberChange.linkMobile,
                            roles: this.memberChange.roleList || [],
                        }
                        this.changeOver = true
                        let res = await this.$http.memberManageUpdate(dataObj);
                        if (res.status === 'success') {
                            this.$message({
                                type: 'success',
                                message: res.msg || '修改成功',
                                duration: 1000,
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'memberManage'});
                                this.changeOver = false
                            }, 1000);
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                duration: 1500,
                            });
                            setTimeout(() => {
                                this.changeOver = false
                            }, 1000);
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
