<template>
    <div>
        <el-form ref="volunteForm" :model="volunteForm" :rules="discloseRules" label-width="130px" style="width: 60%;min-width: 800px">
            <el-form-item label="积分存折：" prop="cardId">
                <el-select v-model="volunteForm.cardId" placeholder="请选择" clearable @change="changeDeposits">
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in deposits" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="积分类别：" prop="integralId">
                <el-select v-model="volunteForm.integralId" placeholder="请选择" clearable>
                    <el-option label="--请选择--" value=""></el-option>
                    <el-option v-for="item in integralList" :key="item.id" :label="item.integralName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动主题：" prop="activityName">
                <el-input v-model="volunteForm.activityName"  placeholder="请输入活动主题"></el-input>
            </el-form-item>
            <el-form-item label="活动时间：" prop="activityDate">
                <el-date-picker
                        class="date_picker"
                        v-model="volunteForm.activityDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        placeholder="选择日期时间"
                        @change="changeTimer">
                </el-date-picker>
            </el-form-item>
            <div class="clear">
                <el-form-item label="积分范围：" prop="scopeNum" class="fl-left">
                    <el-input-number v-model="volunteForm.scopeNum" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <div style="margin: 0 20px;line-height: 35px" class="fl-left">至</div>
                <el-form-item prop="scopeNumEnd" class="fl-left numTxt">
                    <el-input-number v-model="volunteForm.scopeNumEnd" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
            </div>
            <el-form-item label="需要人数：" prop="peopleNum">
                <el-input-number v-model="volunteForm.peopleNum" controls-position="right" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="列表图片：" ref="picListRef" prop="picListUrls">
                <el-checkbox-group v-model="volunteForm.picListUrls" v-show="false"></el-checkbox-group>
                <el-upload
                        list-type="picture-card"
                        :action="upLoadApiUrl"
                        :data="uploadImgData"
                        :on-exceed="handleExceedImg"
                        :on-remove="handleRemoveImg"
                        :on-success="handleUpLoadImgSuccess"
                        :before-upload="beforeImgUpload"
                        :file-list="fileImgList"
                        :limit="limitUploadNum"
                        :auto-upload="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="详细说明：" class="editor-item-con" prop="introduce">
                <el-input type="textarea" :rows="10" v-model="volunteForm.introduce" placeholder="请输入200字以内的详细说明"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="submitForm" :disabled="isdisable" style="width: 150px;">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {baseUrl} from "../../config/env";
    export default {
        name: 'volunteerEdit',
        data () {
            const MIN_NUMBER = 0;
            const MAX_NUMBER = 100000;
            const validateCom = (rule, value, callback) => {
                const one = Number(value);
                if (Number.isInteger(one)) {
                    if (one < MIN_NUMBER) {
                        return callback(new Error(`输入值必须大于${MIN_NUMBER}`));
                    }
                    /*else if (one > MAX_NUMBER) {
                        return callback(new Error(`输入值必须小于${MAX_NUMBER}`));
                    }*/
                    return callback();
                }
                return callback(new Error('输入值必须为正整数'));
            }
            const validateMin = (rule, value, callback) => {
                const one = Number(value);
                const max = Number(this.volunteForm.scopeNumEnd);
                if (!max || one < max) {
                    return callback();
                }
                return callback(new Error('输入值不得大于最大阈值'));
            }
            const  validateMax = (rule, value, callback) => {
                const one = Number(value);
                const min = Number(this.volunteForm.scopeNum);
                if (!min || one > min) {
                    return callback();
                }
                return callback(new Error('输入值不得小于最小阈值'));
            }
            return {
                volunteForm: {
                    cardId: '',
                    integralId: '',
                    activityName: '',
                    activityDate:'',
                    scopeNum: '',
                    scopeNumEnd: '',
                    peopleNum: '',
                    picListUrls: '',
                    introduce: ''
                },
                discloseRules: {
                    cardId: [
                        {required: true, message: '请选择积分存折', trigger: 'change'}
                    ],
                    integralId: [
                        {required: true, message: '请选择积分类别', trigger: 'change'}
                    ],
                    activityName: [
                        {required: true, message: '请输入活动主题名称', trigger: 'blur'},
                        {min: 1, max: 100, message: '名称长度不得超过 100 字符', trigger: 'blur'}
                    ],
                    activityDate:[
                        {required: true, message: '请选择时间', trigger: 'blur'}
                    ],
                    scopeNum:[
                        { required: true, message: '请输入积分范围', trigger: 'blur' },
                        { validator: validateCom, trigger: 'blur' },
                        { validator: validateMin, trigger: 'blur' }
                    ],
                    scopeNumEnd:[
                        {required: true, message: '请输入积分范围', trigger: 'blur'},
                        { validator: validateCom, trigger: 'blur' },
                        { validator: validateMax, trigger: 'blur' }
                    ],
                    peopleNum:[
                        {required: true, message: '请输入所需人数', trigger: 'blur'}
                    ],
                    picListUrls: [
                        {required: true, message: '请上传列表图片', trigger: 'blur'}
                    ],
                    introduce: [
                        {required: true, message: '请输入200字以内的详细说明', trigger: 'blur'},
                        {min: 1, max: 200, message: '详情长度不得超过 200 字符', trigger: 'blur'}
                    ]
                },
                pickerOptions: {
                    disabledDate (time) {
                        // return time.getTime() < Date.now() - 8.64e7
                        return time.getTime() < Date.now()
                    }
                },  // 时间>今天
                upLoadApiUrl: baseUrl+'commonality/v1/qiNiuYunUpload/singleFileUpload', // 图片上传接口
                uploadImgData: {
                    file: '',
                    type: '2'
                },
                limitUploadNum: 1, // 上传限制
                fileImgList: [],
                isdisable: false,
                deposits:[],  // 积分存折
                integralList:[],  // 积分类别
            }
        },
        created () {
            this.getDeposite()
            this.getInfo()
        },
        methods: {
            /*获取存折*/
            async getDeposite(){
                let res = await this.$http.getCardList();
                if (res.code === '0') {
                    this.deposits = res.data
                }
            },
            async changeDeposits(val){
                if(val){
                    /*id为cardId*/
                    let res = await this.$http.getIntegralListByCardId({id:val});
                    if (res.code === '0') {
                        this.integralList = res.data
                    }
                }
            },
            /*详情*/
            async getInfo(){
                let res = await this.$http.getVolunteerById({
                    id:this.$route.params.id
                })
                if(res.status==='success'){
                    this.volunteForm.cardId = res.data.cardId
                    this.volunteForm.integralId = res.data.integralId
                    this.volunteForm.activityName = res.data.activityName
                    this.volunteForm.activityDate = res.data.activityDate
                    this.volunteForm.introduce = res.data.introduce
                    this.volunteForm.scopeNum = res.data.integralFrom
                    this.volunteForm.scopeNumEnd = res.data.integralTo
                    this.volunteForm.peopleNum = res.data.allNum
                    this.volunteForm.picListUrls = res.data.imageUrl
                    if (res.data.imageUrl) {
                        this.fileImgList.push({
                            name: '',
                            url: res.data.imageUrl
                        })
                    }
                    this.changeDeposits(this.volunteForm.cardId)
                }
            },
            // 活动时间
            changeTimer (val) {
                this.volunteForm.activityDate = val
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
            // 上传图片完成
            handleUpLoadImgSuccess (res, file, fileList) {
                const picStatus = res.status || 'error',
                    picLink = res.data[0] || ''
                if (picStatus === 'success' && picLink.length > 0) {
                    this.fileImgList.push({
                        name: file.name || picLink,
                        url: picLink
                    })
                    this.volunteForm.picListUrls = picLink
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
                    this.volunteForm.picListUrls = ''
                }
            },
            // 保存
            submitForm () {
                this.$refs['volunteForm'].validate(async (valid) => {
                    if (valid) {
                        let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
                        let data = {
                            id:this.$route.params.id,
                            name:session_adminInfo.name,
                            cardId: this.volunteForm.cardId,
                            integralId: this.volunteForm.integralId,
                            activityName: this.volunteForm.activityName,
                            activityDate: this.volunteForm.activityDate,
                            integralFrom: this.volunteForm.scopeNum,
                            integralTo: this.volunteForm.scopeNumEnd,
                            allNum: this.volunteForm.peopleNum,
                            imageUrl: this.fileImgList[0].url,
                            introduce: this.volunteForm.introduce,
                            areaCode:session_adminInfo.areaCode,
                            areaName:session_adminInfo.areaName,
                            streetCode:session_adminInfo.streetCode,
                            streetName:session_adminInfo.streetName,
                            villageCode:session_adminInfo.villageCode,
                            villageName:session_adminInfo.villageName
                        }
                        this.isdisable = true
                        await this.$http.volunteerUpdate(data).then(res => {
                            if (res.code === '0') {
                                this.$message({
                                    type: 'success',
                                    message: res.msg
                                })
                                setTimeout(() => {
                                    this.$router.push({name: 'volunteer'})
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

<style lang="less">
    .numTxt{
        .el-form-item__content{
            margin-left: 0 !important;
        }
    }
</style>

