<template>
    <div>
        <el-form :model="addHonerForm" :rules="rulesHoner" label-width="140px" ref="addHonerForm" style="width: 60%;min-width: 800px">
            <el-form-item label="表彰名称：" prop="title">
                <el-input v-model="addHonerForm.title" placeholder="请输入20字以内的表彰名称" style="width: 600px;"></el-input>
            </el-form-item>
            <el-form-item label="月评季奖状态：" required>
                <el-radio-group v-model="addHonerForm.status">
                    <el-radio :label="1">置顶显示</el-radio>
                    <el-radio :label="2">显示</el-radio>
                    <el-radio :label="3">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="表彰说明：" class="editor-item-con" prop="details" ref="contentRef">
                <el-input v-model="addHonerForm.details" v-show="false"></el-input>
                <!-- 图片上传组件辅助-->
                <el-upload style="position: absolute" class="avatar-uploader" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError"></el-upload>
                <quill-editor v-model="addHonerForm.details" ref="myQuillEditor" :options="editorOption" @change="onEditorChange()"></quill-editor>
                <div class="editorWordNumber">{{ editorWordLength }}/2000</div>
            </el-form-item>
            <el-form-item label="标题图片：" class="imgupload" prop="picListUrls">
                <el-checkbox v-model="addHonerForm.picListUrls" v-show="false">备选项</el-checkbox>
                <el-upload class="editOrAddImgList" list-type="picture-card" :action="upLoadApiUrl" accept="image/jpeg, image/jpg, image/gif, image/png" :data="uploadImgData" :on-exceed="handleExceedImg" :on-remove="handleRemoveImg" :on-success="handleUpLoadImgSuccess" :before-upload="beforeImgUpload" :file-list="fileImgList" :limit="limitUploadNum" :auto-upload="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button style="width: 100px" type="primary" size="medium" @click="releaseHonerForm('addHonerForm')" :disabled="submitOver">发布</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {baseUrl} from "../../../config/env";
    export default {
        name: "addRecognition",
        data(){
            var validatecontent = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入表彰说明(最多2000字)"));
                } else {
                    var contents = this.addHonerForm.details;
                    contents = this.removeTAG(contents);
                    if (contents.length > 2000) {
                        callback(new Error("请输入表彰说明(最多2000字)"));
                    } else {
                        callback();
                    }
                }
            };
            return{
                addHonerForm: {
                    title: '',
                    picListUrls:'',
                    status: 1,
                    details: '',
                    dynamicTags: []
                },
                rulesHoner: {
                    title: [
                        {required: true, min: 1, message: '请输入20字以内的表彰名称', trigger: 'blur'},
                        {max: 20, message: '字符超过限制', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入表彰名称', trigger: 'blur'},
                    ],
                    picListUrls: [
                        { required: true, message: "请上传封面图片", trigger: "change" },
                    ],
                    details: [
                        { required: true, validator: validatecontent, trigger: "blur" },
                    ],
                },
                upLoadApiUrl: baseUrl+"commonality/v1/qiNiuYunUpload/singleFileUpload", // 图片上传接口
                uploadImgData: {
                    file: "",
                    type: "2",
                },
                editorWordLength: 0,
                editorOption: {
                    placeholder: "请输入表彰说明(最多2000字)",
                    theme: "snow",
                    modules: {
                        toolbar: {
                            container: [
                                ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
                                ["blockquote", "code-block"], //引用，代码块
                                [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
                                [{ list: "ordered" }, { list: "bullet" }], //列表
                                [{ script: "sub" }, { script: "super" }], // 上下标
                                [{ indent: "-1" }, { indent: "+1" }], // 缩进
                                [{ direction: "rtl" }], // 文本方向
                                [{ size: ["small", false, "large", "huge"] }], // 字体大小
                                [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
                                [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
                                [{ font: [] }], //字体
                                [{ align: [] }], //对齐方式
                                ["image"],
                                ["clean"], //清除字体样式
                            ],
                            handlers: {
                                image: function (value) {
                                    if (value) {
                                        // 触发input框选择图片文件
                                        document.querySelector(".avatar-uploader input").click();
                                    } else {
                                        this.quill.format("image", false);
                                    }
                                },
                            },
                        },
                    },
                },
                fileImgList: [], // 图片
                limitUploadNum: 1,
                limitMaxSize: 2, // 文件大小
                areaCode: '',
                streetCode: '',
                villageCode: '',
                areaName: '',
                streetName: '',
                villageName: '',
                submitOver:false
            }
        },
        mounted() {
            let session_adminInfo = JSON.parse(this.$getStore('adminUserInfo')) || '';
            this.areaCode = session_adminInfo.areaCode
            this.areaName = session_adminInfo.areaName
            this.deptLevel = session_adminInfo.deptLevel
            if(this.deptLevel==4){
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
            }else if(this.deptLevel==5){
                this.streetCode = session_adminInfo.streetCode
                this.streetName = session_adminInfo.streetName
                this.villageCode = session_adminInfo.villageCode
                this.villageName = session_adminInfo.villageName
            }
        },
        methods: {
            // 编辑器文字变化
            onEditorChange() {
                let _this = this;
                var editorWord = _this.addHonerForm.details || "";
                _this.editorWordLength = _this.removeTAG(editorWord).length;
            },

            // 编辑器文字变化
            onEditorChange() {
                var validatecontent = (rule, value, callback) => {
                    if (value === "") {
                        callback(new Error("请输入政策内容(最多2000字)"));
                    } else {
                        var contents = this.addHonerForm.details;
                        contents = this.removeTAG(contents);
                        if (contents.length > 2000) {
                            callback(new Error("请输入政策内容(最多2000字)"));
                        } else {
                            callback();
                        }
                    }
                };
                var editorWord = this.removeTAG(this.addHonerForm.details) || "";
                this.editorWordLength = editorWord.length;
                if (this.editorWordLength > 0) {
                    this.$refs.contentRef.clearValidate();
                } else {
                    this.$set(this.rulesHoner, "details", {
                        required: true,
                        message: "请输入政策内容(最多2000字)",
                        trigger: "change",
                        validator: validatecontent,
                    });
                }
            },
            //去除富文本标签
            removeTAG(str) {
                return str.replace(/<[^>]+>/g, "");
            },
            //富文本图片上传成功
            uploadSuccess(res, file) {
                // 获取富文本组件实例
                let quill = this.$refs.myQuillEditor.quill;
                // 如果上传成功
                if (res.code == "0") {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片
                    quill.insertEmbed(length, "image", res.data[0]);
                    // 调整光标到最后
                    quill.setSelection(length + 1);
                } else {
                    this.$message("图片插入失败");
                }
            },
            // 富文本图片上传失败
            uploadError() {
                this.$message.error("图片插入失败");
            },
            // 文件超出个数限制时的钩子
            handleExceedImg(files, fileList) {
                const realNum = fileList.length || 0;
                if (realNum >= this.limitUploadNum) {
                    this.$message.warning("最多只能上传" + this.limitUploadNum + "张图片!");
                }
            },
            // 图片上传检测
            beforeImgUpload(file) {
                const isJPG =
                    file.type === "image/jpeg" ||
                    file.type === "image/jpg" ||
                    file.type === "image/png" ||
                    file.type === "image/gif";
                const isLt4M = file.size / 1024 / 1024 < this.limitMaxSize;
                if (!isJPG) {
                    this.$message.warning("上传图片只能是 jpg/jpeg/png/gif 格式!");
                }
                if (!isLt4M) {
                    this.$message.warning(
                        "上传单个图片大小不能超过 " + this.limitMaxSize + "MB!"
                    );
                }
                return isJPG && isLt4M;
            },
            // 上传图片完成
            handleUpLoadImgSuccess(res, file, fileList) {
                const picStatus = res.status || "error",
                    picLink = res.data[0] || "";
                if (picStatus === "success" && picLink.length > 0) {
                    this.fileImgList.push({
                        name: file.name || picLink,
                        url: picLink,
                    });
                    this.addHonerForm.picListUrls = picLink || '';
                } else {
                    this.$message.error(res.msg);
                }
            },
            // 删除图片
            async handleRemoveImg(file, fileList) {
                let imgUid = file.uid || 999999;
                let imgLink = file.url || "";
                var index = this.fileImgList.findIndex((item) => {
                    if (item.uid === imgUid) {
                        return true;
                    }
                });

                if (index >= 0 && imgLink.length > 0) {
                    // 改变资源
                    this.fileImgList.splice(index, 1);
                    if (this.fileImgList.length == 0) {
                        this.addHonerForm.picListUrls = "";
                    }
                }
            },
            /*发布*/
            async releaseHonerForm(addHonerForm) {
                this.$refs[addHonerForm].validate(async (valid) => {
                    if (valid) {
                        let res = await this.$http.monthlyAwardSave({
                            title: this.addHonerForm.title,
                            picUrl: this.addHonerForm.picListUrls,
                            status: this.addHonerForm.status,
                            content: this.addHonerForm.details,
                            areaCode: this.areaCode,
                            streetCode: this.streetCode,
                            villageCode: this.villageCode,
                            areaName: this.areaName,
                            streetName: this.streetName,
                            villageName: this.villageName,
                        })
                        if (res.status === 'success') {
                            this.submitOver = true
                            this.$message({
                                type: 'success',
                                message: res.msg || '发布成功',
                                duration: 1000,
                            });
                            setTimeout(() => {
                                this.$router.push({name: 'honerRecognition'});
                                this.submitOver = false
                            }, 1000);
                        } else {
                            this.submitOver = false
                            this.$message({
                                type: 'error',
                                message: res.msg,
                                duration: 1000,
                            });
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .addBillNum{
        color: #999;
        font-size: 12px;
        margin-left: 15px;
    }
    .editorWordNumber {
        position: absolute;
        bottom: -30px;
        right: 1px;
        width: auto;
        height: 24px;
        line-height: 24px;
        background: #fff;
        border-radius: 3px;
        padding: 0 1px;
        color: #666;
        font-size: 13px;
    }
</style>
