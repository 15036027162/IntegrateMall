<template>
    <div>
        <el-form ref="depositForm" :model="depositForm" :rules="depositRules" label-width="130px" style="width: 60%;min-width: 800px">
            <el-form-item label="存折序号：" prop="orderNum">
                <el-input v-model="depositForm.orderNum" placeholder="请输入阿拉伯数字" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="积分存折：" prop="cardName">
                <el-input v-model="depositForm.cardName" placeholder="请输入6字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="清零时间：">
                <el-date-picker
                        v-model="depositForm.expireTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :editable="false"
                        placeholder="选择日期时间"
                        @change="changeTimer">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="是否包含基础分：">
                <el-radio-group v-model="depositForm.isBase">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可以捐赠：">
                <el-radio-group v-model="depositForm.isDonate">
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="基础分：">
                <el-input v-model="depositForm.score" placeholder="请输入分值" @keyup.native="proving"></el-input>
            </el-form-item>
            <el-form-item label="icon标识：" ref="picListRef" prop="picListUrls">
                <el-checkbox-group v-model="depositForm.picListUrls" v-show="false"></el-checkbox-group>
                <el-upload
                        list-type="picture-card"
                        :action="upLoadApiUrl"
                        :data="uploadImgData"
                        :on-exceed="handleExceedImg"
                        :on-remove="handleRemoveIcon"
                        :on-success="handleUpLoadImgSuccess"
                        :before-upload="beforeImgUpload"
                        :file-list="fileIocnList"
                        :limit="limitUploadNum"
                        :auto-upload="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="存折背景图：" ref="picBgRef" prop="picBgUrls" class="bgClass">
                <el-checkbox-group v-model="depositForm.picBgUrls" v-show="false"></el-checkbox-group>
                <el-upload
                        list-type="picture-card"
                        :action="upLoadApiUrl"
                        :data="uploadImgData"
                        :on-exceed="handleExceedImg"
                        :on-remove="handleRemoveImg"
                        :on-success="handlepicBgUrlSuccess"
                        :before-upload="beforeImgUpload"
                        :file-list="fileImgList"
                        :limit="limitUploadNum"
                        :auto-upload="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="submitForm" :disabled="isdisable">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { baseUrl } from "../../../config/env";
    export default {
        name: "depositAdd",
        data(){
            return{
                depositForm:{
                    orderNum:1,
                    cardName:'',
                    expireTime:'',
                    score:'',
                    isBase:0,
                    isDonate:0,
                    picListUrls:'',
                    picBgUrls:''
                },
                depositRules:{
                    cardName: [
                        {required: true, message: '请输入6字以内的名称', trigger: 'blur'},
                        {min: 1, max: 6, message: '标题长度不得超过 6 字符', trigger: 'blur'}
                    ],
                    picListUrls: [
                        {required: true, message: '请上传icon标识', trigger: 'blur'}
                    ],
                    picBgUrls: [
                        {required: true, message: '请上传存折背景图', trigger: 'blur'}
                    ]
                },
                pickerOptions: {
                    disabledDate (time) {
                        // return time.getTime() < Date.now() - 8.64e7
                        return time.getTime() < Date.now()
                    }
                },  // 时间>今天
                upLoadApiUrl: baseUrl +'commonality/v1/qiNiuYunUpload/singleFileUpload', // 图片上传接口
                uploadImgData: {
                    file: '',
                    type: '2'
                },
                limitUploadNum: 1, // 上传限制
                fileIocnList: [],
                fileImgList: [],
                isdisable:false,
            }
        },
        methods:{
            // 清零时间
            changeTimer (val) {
                let times = Math.round(new Date(val) / 1000)
                if(times < Date.now()){
                    return
                }else{
                    this.depositForm.expireTime = val
                }
            },
            // 基础分
            proving () {
                this.depositForm.score = this.depositForm.score.replace(/[^\.\d]/g, '')
                this.depositForm.score = this.depositForm.score.replace('.', '')
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
                const isLt4M = file.size / 1024 / 1024 < 6
                if (!isJPG) {
                    this.$message.warning('上传图片只能是 jpg/jpeg/png/gif 格式!')
                }
                if (!isLt4M) {
                    this.$message.warning(
                        '上传单个图片大小不能超过 6 MB!'
                    )
                }
                return isJPG && isLt4M
            },
            // 上传icon完成
            handleUpLoadImgSuccess (res, file, fileList) {
                const picStatus = res.status || 'error',
                    picLink = res.data[0] || ''
                if (picStatus === 'success' && picLink.length > 0) {
                    this.fileIocnList.push({
                        name: file.name || picLink,
                        url: picLink
                    })
                    this.depositForm.picListUrls = picLink
                    this.$refs.picListRef.clearValidate()
                } else {
                    this.$message.error(res.msg)
                }
            },
            // 删除icon
            async handleRemoveIcon (file, fileList) {
                let imgUid = file.uid || 999999
                let imgLink = file.url || ''
                var index = this.fileIocnList.findIndex((item) => {
                    if (item.uid === imgUid) {
                        return true
                    }
                })
                if (index >= 0 && imgLink.length > 0) {
                    // 改变资源
                    this.fileIocnList.splice(index, 1)
                    this.depositForm.picListUrls = ''
                }
            },
            // 上传图片完成
            handlepicBgUrlSuccess (res, file, fileList) {
                const picStatus = res.status || 'error',
                    picLink = res.data[0] || ''
                if (picStatus === 'success' && picLink.length > 0) {
                    this.fileImgList.push({
                        name: file.name || picLink,
                        url: picLink
                    })
                    this.depositForm.picBgUrls = picLink
                    this.$refs.picListRef.clearValidate()
                } else {
                    this.$message.error(res.msg)
                }
            },
            // 删除图片
            async handleRemoveImg (file, fileList) {
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
                    this.depositForm.picBgUrls = ''
                }
            },
            /*添加*/
            submitForm(){
                this.$refs['depositForm'].validate(async (valid) => {
                    let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                    let data = {
                        name:session_adminInfo.name,
                        orderNum:this.depositForm.orderNum,
                        cardName:this.depositForm.cardName,
                        score:this.depositForm.score,
                        icon:this.depositForm.picListUrls,
                        background:this.depositForm.picBgUrls,
                        isBase:this.depositForm.isBase,
                        isDonate:this.depositForm.isDonate,
                        expireTime:this.depositForm.expireTime,
                    }
                    if (valid) {
                        this.isdisable = true
                        await this.$http.cardAdd(data).then(res => {
                            if (res.code === '0') {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                setTimeout(() => {
                                    this.$router.push({name: 'depositSet'})
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
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
