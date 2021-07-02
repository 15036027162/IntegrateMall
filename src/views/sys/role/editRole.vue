<template>
    <div>
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="130px">
            <el-form-item label="角色名称：" prop="roleName" style="width: 572px">
                <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="区域选择：" required v-if="provincesobj">
                <provinces @changeTown="changeTown" :provinces="provincesobj" :isadd="false"></provinces>
            </el-form-item>
            <el-form-item label="菜单权限：" prop="tree">
                <el-tree
                        ref="tree"
                        :data="roleForm.treeData"
                        :props="defaultProps"
                        :default-checked-keys="expandedKeys"
                        node-key="id"
                        show-checkbox
                        :highlight-current='true'
                        @check="handleCheckChange">
                </el-tree>
                <!--:default-expanded-keys="expandedKeys"-->
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="submitForm('roleForm')" :disabled="isdisable" style="width: 150px">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import provinces from "@/components/public/provinces1";
    export default {
        name: 'role-change',
        components: { provinces },
        data () {
            return {
                roleForm: {
                    roleName: '',
                    treeData: []
                },
                roleRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '名称长度不得超过 10 字符', trigger: 'blur'}
                    ],
                    tree: [
                        {required: true, message: '请选择权限', trigger: 'blur'}
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
                provincesobj: {},
                isdisable: false
            }
        },
        created () {
            this.getRoleById()
        },
        methods: {
            handleCheckChange () {
                var parentArr = this.$refs.tree.getHalfCheckedKeys();
                var childeArr = this.$refs.tree.getCheckedKeys();
                this.expandedKeysAll = parentArr.concat([this.rubbish]).concat(childeArr);
                // 获取当前的选中的节点id
                this.expandedKeys = this.$refs.tree.getCheckedKeys()
                if (this.expandedKeys.length > 0) {
                    this.$refs['roleForm'].clearValidate(['tree'])
                }
            },
            async getRoleById () {
                await this.$http.getRoleById({id: this.$route.params.id}).then(res => {
                    if (res.code === '0') {
                        this.expandedKeysAll = res.data.menuIdList
                        var idx = res.data.menuIdList.indexOf(this.rubbish)
                        if (idx !== -1) {
                            this.expandedKeys = res.data.menuIdList.splice(idx, res.data.menuIdList.length - idx)
                        }
                        this.roleForm.roleName = res.data.roleName
                        this.provincesobj = {
                            areaCode: res.data.areaCode,
                            areaName: res.data.areaName,
                            streetCode: res.data.streetCode,
                            villageCode: res.data.villageCode,
                            streetName: res.data.streetName,
                            villageName: res.data.villageName
                        };
                        let deptLevel = ''
                        if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length==0&&this.provincesobj.villageCode==0){
                            deptLevel = '3'
                        }else if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length>0&&this.provincesobj.villageCode==0){
                            deptLevel = '4'
                        }else if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length>0&&this.provincesobj.villageCode>0){
                            deptLevel = '5'
                        }
                        this.getMenuList(deptLevel)
                    }
                })
            },
            async getMenuList (deptLevel) {
                await this.$http.getMenuList({deptLevel:deptLevel}).then(res => {
                    if (res.code === '0') {
                        this.roleForm.treeData = res.data
                    } else {
                        this.roleForm.treeData = []
                    }
                })
            },
            /*区域选择*/
            changeTown(val){
                this.provincesobj.areaCode = val.cityCode
                this.provincesobj.areaName = val.cityName
                this.provincesobj.streetCode = val.townCode
                this.provincesobj.streetName = val.townName
                this.provincesobj.villageCode = val.villageCode
                this.provincesobj.villageName = val.villageName
                let deptLevel = ''
                if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length==0&&this.provincesobj.villageCode==0){
                    deptLevel = '3'
                }else if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length>0&&this.provincesobj.villageCode==0){
                    deptLevel = '4'
                }else if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length>0&&this.provincesobj.villageCode>0){
                    deptLevel = '5'
                }
                this.getMenuList(deptLevel)
            },
            // 保存
            submitForm (roleForm) {
                let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                let data = {
                    id: this.$route.params.id,
                    name:session_adminInfo.name,
                    roleName: this.roleForm.roleName,
                    menuIdList: this.$refs.tree.getHalfCheckedKeys().concat([this.rubbish]).concat(this.$refs.tree.getCheckedKeys()),
                    areaCode:this.provincesobj.areaCode,
                    areaName:this.provincesobj.areaName,
                    streetCode:this.provincesobj.streetCode,
                    streetName:this.provincesobj.streetName,
                    villageCode:this.provincesobj.villageCode,
                    villageName:this.provincesobj.villageName
                }
                this.$refs[roleForm].validate(async (valid) => {
                    if (this.expandedKeys.length > 0) {
                        this.$refs[roleForm].clearValidate(['tree'])
                        if (this.roleForm.roleName&&this.roleForm.roleName.length<=10) {
                            valid = true
                        }
                    }
                    if (valid) {
                        this.isdisable = true
                        await this.$http.updateRole(data).then(res => {
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
            }
        },
        watch:{
            expandedKeysAll(){
                return this.expandedKeysAll
            }
        }
    }
</script>

<style scoped>

</style>
