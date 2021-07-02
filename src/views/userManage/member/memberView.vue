<template>
    <div>
        <el-form v-if="memberChangeShow" v-model="memberChange" label-width="100px" ref="memberChangeRef">
            <el-form-item label="用户名：">{{memberChange.account}}</el-form-item>
            <el-form-item label="绑定手机号：">{{memberChange.mobile || '暂未绑定'}}</el-form-item>
            <el-form-item label="姓名：">{{memberChange.name || '-'}}</el-form-item>
            <el-form-item label="性别：">{{memberChange.ssexName || '-'}}</el-form-item>
            <el-form-item label="联系方式：">{{memberChange.linkMobile || '-'}}</el-form-item>
            <el-form-item label="职务：">{{memberChange.position || '-'}}</el-form-item>
            <el-form-item label="角色：">{{memberChange.typeName || '-'}}</el-form-item>
            <el-form-item label="角色选择：" prop="roleIds" v-if="memberChange.roleList.length>0">
                <el-checkbox-group v-model="memberChange.roleList">
                    <el-checkbox v-for="(item,index) in typeRole" :key="index" :label="item.id"
                                 name="type" disabled>{{item.roleName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="区划组织：">
                <div v-if="memberChange.areaName">
                    <span>{{memberChange.areaName}}</span>
                    <span v-if="memberChange.streetName"> - {{memberChange.streetName}}</span>
                    <span v-if="memberChange.villageName"> - {{memberChange.villageName}}</span>
                </div>
                <div v-else>--</div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "memberView",
        data() {
            return {
                memberChange: {
                    name:'',
                    account:'',
                    mobile:'',
                    positionName: '',
                    positionPhone: '',
                    roleList:[],
                },
                typeRole:[],
                memberId:'',
                memberChangeShow:false
            }
        },
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.memberId = session_adminInfo.memberId || 0;
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
                let res = await this.$http.memberManageInfo({
                    id: this.$route.params.id,

                });
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
                    if (this.memberChange.ssex == '1') {
                        this.memberChange.ssexName = '男'
                    } else if (this.memberChange.ssex == '0'){
                        this.memberChange.ssexName = '女'
                    }
                    if(this.memberChange.type==0){
                        this.memberChange.typeName = '普通管理员'
                    }else if(this.memberChange.type==1){
                        this.memberChange.typeName = '系统管理员'
                    }
                    this.memberChangeShow = true
                    this.$forceUpdate()
                }
            }
        }
    }
</script>

<style scoped>

</style>
