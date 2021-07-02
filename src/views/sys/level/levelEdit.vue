<template>
    <div>
        <el-form ref="levelForm" :model="levelForm" :rules="levelRules" label-width="130px" style="width: 60%;min-width: 800px">
            <el-form-item label="等级：" prop="id">
                <span>L{{levelForm.id}}</span>
            </el-form-item>
            <el-form-item label="等级称号：" prop="gradeName">
                <el-input v-model="levelForm.gradeName" placeholder="请输入5字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="所需积分：" prop="integral">
                <el-input type="number" v-model="levelForm.integral" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="icon标识：" ref="picListRef" prop="picListUrls">
                <el-checkbox-group v-model="levelForm.picListUrls" v-show="false"></el-checkbox-group>
                <el-upload
                        list-type="picture-card"
                        :action="upLoadApiUrl"
                        :data="uploadImgData"
                        :on-exceed="handleExceedImg"
                        :on-remove="handleRemoveIcon"
                        :on-success="handleUpLoadImgSuccess"
                        :before-upload="beforeImgUpload"
                        :file-list="fileImgList"
                        :limit="limitUploadNum"
                        :auto-upload="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item class="changeNum" label="等级描述：">
                <el-input type="textarea" minlength="0" maxlength="100" placeholder="输入100字以内的捐赠说明" :rows="8" v-model="levelForm.introduce"></el-input>
            </el-form-item>
            <el-form-item label="排名限制：">
                <el-input type="number" v-model="levelForm.rankLimit" oninput="value=value.replace(/[^0-9]+/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="保级条件：">
                <el-input type="number" v-model="levelForm.relegation" oninput="value=value.replace(/[^\d^\.]/g,'')"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium"  @click="submitForm" :disabled="isdisable" style="width: 150px">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {baseUrl} from "../../../config/env";

    export default {
        name: "levelEdit",
        data(){
            return{
                levelForm:{
                    gradeName:'',
                    integral:0,
                    introduce:'',
                    rankLimit:1,
                    picListUrls:'',
                    relegation:0
                },
                levelRules:{
                    gradeName: [
                        {required: true, message: '请输入2-5个字之间的名称', trigger: 'blur'},
                        {min: 2, max: 5, message: '称号长度不得少于 2 个字符，不得超过 5 字符', trigger: 'blur'}
                    ],
                    integral:[
                        {required: true, message: '请输入积分价值', trigger: 'blur'},
                    ],
                    picListUrls: [
                        {required: true, message: '请上传icon标识', trigger: 'blur'}
                    ]
                },
                upLoadApiUrl: baseUrl +'commonality/v1/qiNiuYunUpload/singleFileUpload', // 图片上传接口
                uploadImgData: {
                    file: '',
                    type: '2'
                },
                limitUploadNum: 1, // 上传限制
                fileImgList: [],
                isdisable:false
            }
        },
        created() {
            this.getInfo()
        },
        methods:{
            async getInfo(){
                let res = await this.$http.getGradeById({id:this.$route.params.id});
                if(res.status==='success'){
                    this.levelForm.gradeName = res.data.gradeName
                    this.levelForm.integral = res.data.integral
                    this.levelForm.introduce = res.data.introduce
                    this.levelForm.rankLimit = res.data.rankLimit
                    this.levelForm.relegation = res.data.relegation
                    if (res.data.icon) {
                        this.levelForm.picListUrls = res.data.icon
                        this.fileImgList.push({
                            name: '',
                            url: res.data.icon
                        })
                    }
                }
            },
            // 文件超出个数限制时的钩子
            handleExceedImg (files, fileList) {
                const realNum = fileList.length || 0
                if (realNum >= this.limitUploadNum) {
                    this.$message.warning('最多只能上传' + this.limitUploadNum + '张图片!')
                }
            },
            // 图片上传检测
            beforeImgUpload (file) {
                const isJPG =
                    file.type === 'image/jpeg' ||
                    file.type === 'image/jpg' ||
                    file.type === 'image/png' ||
                    file.type === 'image/gif'
                const isLt4M = file.size / 1024 / 1024 < 4
                if (!isJPG) {
                    this.$message.warning('上传图片只能是 jpg/jpeg/png/gif 格式!')
                }
                if (!isLt4M) {
                    this.$message.warning(
                        '上传单个图片大小不能超过 4 MB!'
                    )
                }
                return isJPG && isLt4M
            },
            // 上传icon完成
            handleUpLoadImgSuccess (res, file, fileList) {
                const picStatus = res.status || 'error',
                    picLink = res.data[0] || ''
                if (picStatus === 'success' && picLink.length > 0) {
                    this.fileImgList.push({
                        name: file.name || picLink,
                        url: picLink
                    })
                    this.levelForm.picListUrls = picLink
                    this.$refs.picListRef.clearValidate()
                } else {
                    this.$message.error(res.msg)
                }
            },
            // 删除icon
            async handleRemoveIcon (file, fileList) {
                let imgUid = file.uid || 999999
                let imgLink = file.url || ''
                var index = this.fileImgList.findIndex((item) => {
                    if (item.uid === imgUid) {
                        return true
                    }
                })
                if (index >= 0 && imgLink.length > 0) {
                    // 改变资源
                    this.fileImgList.splice(index, 1)
                    this.levelForm.picListUrls = ''
                }
            },


            submitForm(){
                this.$refs['levelForm'].validate(async valid => {
                    if (valid) {
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        let data = {
                            name:session_adminInfo.name,
                            id:this.$route.params.id,
                            gradeName:this.levelForm.gradeName,
                            integral:this.levelForm.integral,
                            icon:this.fileImgList[0].url,
                            introduce:this.levelForm.introduce,
                            rankLimit:this.levelForm.rankLimit,
                            relegation:this.levelForm.relegation
                        }
                        this.isdisable = true
                        const res = await this.$http.gradeUpdate(data);
                        if (res.status === "success") {
                            this.$message({
                                type: "success",
                                message: res.msg
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'levelSet'})
                                this.isdisable = false
                            }, 1000);
                        } else {
                            this.$message({
                                type: "error",
                                message: res.msg
                            });
                            setTimeout(() => {
                                this.isdisable = false
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
