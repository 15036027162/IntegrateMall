<template>
    <div>
        <el-form ref="roleForm" :model="roleForm" label-width="130px" style="width: 60%;min-width: 800px">
            <el-form-item label="角色名称：" prop="roleName">
                <span>{{roleForm.roleName}}</span>
            </el-form-item>
            <el-form-item label="区域选择：" prop="roleName">
                <span>{{provincesobj.areaName}}</span>
                <span v-if="provincesobj.streetName"> - {{provincesobj.streetName}}</span>
                <span v-if="provincesobj.villageName"> - {{provincesobj.villageName}}</span>
            </el-form-item>
            <el-form-item label="菜单权限：" prop="tree">
                <el-tree
                        ref="tree"
                        :data="roleForm.treeData"
                        :props="defaultProps"
                        :default-checked-keys="expandedKeys"
                        node-key="id"
                        :show-checkbox="true"
                        :disabled="true"
                        :highlight-current='true'>
                </el-tree>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "editRole",
        data(){
            return{
                roleForm:{
                    roleName:'',
                    treeData: []
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id: 'id'
                },
                rubbish:99999,
                expandedKeys: [],
                provincesobj:{}
            }
        },
        created() {
            this.getRoleById()
        },
        methods:{
            /*获取菜单*/
            async getRoleById () {
                await this.$http.getMenuList({deptLevel:this.deptLevel}).then(res => {
                    if (res.code === '0') {
                        this.roleForm.treeData = res.data
                    } else {
                        this.roleForm.treeData = []
                    }
                })
                await this.$http.getRoleById({id: this.$route.params.id}).then(res => {
                    if (res.code === '0') {
                        this.provincesobj = {
                            areaCode: res.data.areaCode,
                            areaName: res.data.areaName,
                            streetCode: res.data.streetCode,
                            villageCode: res.data.villageCode,
                            streetName: res.data.streetName,
                            villageName: res.data.villageName
                        };
                        var idx = res.data.menuIdList.indexOf(this.rubbish)
                        if (idx !== -1) {  // 存在
                            this.expandedKeys = res.data.menuIdList.splice(idx, res.data.menuIdList.length - idx)
                        }
                        this.roleForm.roleName = res.data.roleName
                        let deptLevel = ''
                        if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length==0&&this.provincesobj.villageCode==0){
                            deptLevel = '3'
                        }else if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length>0&&this.provincesobj.villageCode==0){
                            deptLevel = '4'
                        }else if(this.provincesobj.areaCode.length>0&&this.provincesobj.streetCode.length>0&&this.provincesobj.villageCode>0){
                            deptLevel = '5'
                        }
                        this.getMenuList(deptLevel)
                    } else {
                        this.expandedKeys = []
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
        }
    }
</script>

<style scoped>

</style>
