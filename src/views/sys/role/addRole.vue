<template>
    <div>
        <el-form ref="roleForm" :model="roleForm" :rules="rulesForm"  label-width="130px">
            <el-form-item label="角色名称：" prop="roleName" style="width: 572px">
                <el-input v-model="roleForm.roleName" placeholder="输入10字以内角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="区域选择：" required>
                <provinces @changeTown="changeTown" :isadd="true"></provinces>
            </el-form-item>
            <el-form-item label="菜单权限：" prop="tree">
                <el-tree
                        ref="tree"
                        :data="roleForm.treeData"
                        :props="defaultProps"
                        :default-checked-keys="expandedKeys"
                        node-key="id"
                        :show-checkbox="true"
                        :highlight-current='true'
                        @check="handleCheckChange">
                </el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="submitForm('roleForm')" :disabled="isdisable" style="width: 150px">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import provinces from "@/components/public/provinces1";
    export default {
        name: "addRole",
        components: {provinces},
        data(){
            return{
                roleForm:{
                    roleName:'',
                    treeData: []
                },
                rulesForm:{
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '名称长度不得超过 10 字符', trigger: 'blur'}
                    ],
                    tree: [
                        {required: true, message: '请选择权限', trigger: 'change'}
                    ]
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id: 'id'
                },
                expandedKeys: [],
                expandedKeysAll:[],
                rubbish:99999,
                areaCode:'',
                areaName:'',
                streetCode:'',
                streetName:'',
                villageCode:'',
                villageName:'',
                isdisable:false,
                deptLevel:''
            }
        },
        created() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.deptLevel=session_adminInfo.deptLevel
            this.areaCode = session_adminInfo.areaCode
            this.areaName = session_adminInfo.areaName
            if(this.deptLevel==3){
                this.villageCode = '';
                this.villageName = '';
                this.streetName = '';
                this.streetCode = '';
            }else if(this.deptLevel==4){
                this.villageCode = ''
                this.villageName = ''
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
            }else if(this.deptLevel==5){
                this.villageCode = session_adminInfo.villageCode
                this.villageName = session_adminInfo.villageName
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
            }
            this.getMenuList(this.deptLevel)
        },
        methods:{
            /*获取菜单*/
            async getMenuList (deptLevel) {
                await this.$http.getMenuList({deptLevel:deptLevel}).then(res => {
                    if (res.code === '0') {
                        this.roleForm.treeData = res.data
                    } else {
                        this.roleForm.treeData = []
                    }
                })
            },
            // 获取当前的选中的节点id
            handleCheckChange(){
                var parentArr = this.$refs.tree.getHalfCheckedKeys();
                var childeArr = this.$refs.tree.getCheckedKeys();
                this.expandedKeysAll = parentArr.concat([this.rubbish]).concat(childeArr);
                this.expandedKeys = this.$refs.tree.getCheckedKeys()
                if (this.expandedKeys.length > 0) {
                    this.$refs['roleForm'].clearValidate(['tree'])
                }
            },
            /*区域选择*/
            changeTown(val){
                this.areaCode = val.cityCode
                this.areaName = val.cityName
                this.streetCode = val.townCode
                this.streetName = val.townName
                this.villageCode = val.villageCode
                this.villageName = val.villageName
                let deptLevel = ''
                if(this.areaCode.length>0&&this.streetCode.length==0&&this.villageCode==0){
                    deptLevel = '3'
                }else if(this.areaCode.length>0&&this.streetCode.length>0&&this.villageCode==0){
                    deptLevel = '4'
                }else if(this.areaCode.length>0&&this.streetCode.length>0&&this.villageCode>0){
                    deptLevel = '5'
                }
                this.getMenuList(deptLevel)
            },
            /*添加*/
            submitForm (roleForm) {
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let data = {
                    name:session_adminInfo.name,
                    roleName: this.roleForm.roleName,
                    menuIdList: this.expandedKeysAll,
                    areaCode:this.areaCode,
                    areaName:this.areaName,
                    streetCode:this.streetCode,
                    streetName:this.streetName,
                    villageCode:this.villageCode,
                    villageName:this.villageName
                }
                console.log(data);
                this.$refs[roleForm].validate(async (valid) => {
                    if (this.expandedKeys.length > 0) {
                        this.$refs[roleForm].clearValidate(['tree'])
                        if (this.roleForm.roleName&&this.roleForm.roleName.length<=10) {
                            valid = true
                        }
                    }
                    if (valid) {
                        this.isdisable = true
                        await this.$http.roleSave(data).then(res => {
                            if (res.code === '0') {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                setTimeout(() => {
                                    this.$router.push({name: 'roleManage'})
                                    this.isdisable = false
                                }, 1000)
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                                setTimeout(() => {
                                    this.isdisable = false
                                }, 1000)
                            }
                        })
                    } else {
                        this.isdisable = false
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
