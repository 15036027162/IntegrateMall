import fetch from '@/config/fetch'

/**
 * ================================================================================================
 * wyl 接口相关      20210106
 * ================================================================================================
 */
//家庭户管理
export const familyList = data => fetch('jinshimember/v1/w/door/list', data,'GET');// 家庭管理-家庭户列表
export const addFamily = data => fetch('jinshimember/v1/w/door/save', data,'POST');// 家庭管理-添加家庭户
export const updateFamily = data => fetch('jinshimember/v1/w/door/update', data,'POST');// 家庭管理-编辑家庭户
export const deleteFamily = data => fetch('jinshimember/v1/w/door/delete', data,'POST');// 家庭管理-删除家庭户
export const batchSave = data => fetch('jinshimember/v1/w/door/batchSave', data,'post');// 家庭户-批量添加
export const downCode = data => fetch('jinshimember/v2/w/member/downCode', data,'post');// 家庭户-下载二维码
export const batchDownCode = data => fetch('jinshimember/v2/w/member//batchDownCode', data,'post');// 家庭户-批量下载二维码
export const memberDetails = data => fetch('jinshimember/v1/w/memberDoor/getById', data,'GET');// 家庭管理-成员详情
export const groupByVillage = data => fetch('commonality/v1/division/groupByVillage', data,'GET');// 村社区获取组信息
export const getMemberListByDoorNum = data => fetch('jinshimember/v1/w/memberDoor/getMemberListByDoorNum', data,'GET');// 家庭管理-家庭成员列表
// 乡村组
export const commonalityGroup = data => fetch('commonality/v1/group/groupList', data, 'GET');// 组管理-列表
export const commonalityGroupSave = data => fetch('commonality/v1/group/save', data, 'POST');// 组管理-新增
export const commonalityGroupId = data => fetch('commonality/v1/group/getById', data, 'GET');// 组管理-详情
export const commonalityGroupUpdate = data => fetch('commonality/v1/group/update', data, 'POST');// 组管理-编辑
export const commonalityGroupDelete = data => fetch('commonality/v1/group/delete', data, 'POST');// 组管理-删除
// 信息公开
export const policyList = data => fetch('jinshiintegrate/v1/w/policy/policyList', data,'GET');// 信息公开-信息公开列表
export const policyDetail = data => fetch('jinshiintegrate/v1/w/policy/policyDetail', data,'GET');// 信息发布-政策详情
export const policySave = data => fetch('jinshiintegrate/v1/w/policy/policySave', data,'POST');// 信息发布-信息发布/编辑
export const policyUpdateState = data => fetch('jinshiintegrate/v1/w/policy/updateState', data,'POST');// 信息发布-信息发布审核和删除
export const getTabListById = data => fetch('jinshiintegrate/v1/w/tab/getTabListById/'+data.id,{},'GET');// tab设置-类别id获取Tab
//基础设置
export const introduceList = data => fetch('jinshiintegrate/v1/w/villageIntroduction/introduceList', data,'GET');// 基本设置-乡村介绍
export const introduceDetail = data => fetch('jinshiintegrate/v1/w/villageIntroduction/introduceDetail', data,'GET');// 基本设置-乡村介绍详情
export const introduceUpdate = data => fetch('jinshiintegrate/v1/w/villageIntroduction/introduceUpdate', data,'post');// 基本设置-乡村介绍编辑
export const villageOrganizeList = data => fetch('jinshiintegrate/v1/w/villageOrganize/list', data,'GET');// 基本设置-组织介绍列表
export const villageOrganizeInfo = data => fetch('jinshiintegrate/v1/w/villageOrganize/info/'+data.id,{},'GET');//  基本设置-组织介绍详情
export const villageOrganizeUpdate = data => fetch('jinshiintegrate/v1/w/villageOrganize/update',data,'post');//  基本设置-组织介绍编辑
export const villageOrganizeSave = data => fetch('jinshiintegrate/v1/w/villageOrganize/save',data,'post');//  基本设置-组织介绍添加
export const villageOrganizeDelete = data => fetch('jinshiintegrate/v1/w/villageOrganize/delete',data,'post');//  基本设置-组织介绍删除
export const villageEnterList = data => fetch('jinshiintegrate/v1/w/villageEnter/list', data,'GET');// 基本设置-走进乡村列表
export const villageEnterUpdate = data => fetch('jinshiintegrate/v1/w/villageEnter/update', data,'post');// 基本设置-走进乡村编辑
export const villageEnterSave = data => fetch('jinshiintegrate/v1/w/villageEnter/save', data,'post');// 基本设置-走进乡村新增
export const villageEnterDelete = data => fetch('jinshiintegrate/v1/w/villageEnter/delete', data,'post');// 基本设置-走进乡村删除
export const villageEnterInfo = data => fetch('jinshiintegrate/v1/w/villageEnter/info/'+data.id,{},'GET');//  基本设置-走进乡村详情
export const villageRuleList = data => fetch('jinshiintegrate/v1/w/villageRule/list', data,'GET');// 基本设置-村规民约列表
export const villageRuleUpdate = data => fetch('jinshiintegrate/v1/w/villageRule/update', data,'post');// 基本设置-村规民约编辑
export const villageRuleSave = data => fetch('jinshiintegrate/v1/w/villageRule/save', data,'post');// 基本设置-村规民约新增
export const villageRuleDelete = data => fetch('jinshiintegrate/v1/w/villageRule/delete', data,'post');// 基本设置-村规民约删除
export const villageRuleInfo = data => fetch('jinshiintegrate/v1/w/villageRule/info/'+data.id,{},'GET');//  基本设置-村规民约详情
export const integralSetList = data => fetch('jinshiintegrate/v1/w/integralSet/list', data,'GET');// 基本设置-积分设置列表
export const integralSetInfo = data => fetch('jinshiintegrate/v1/w/integralSet/info/'+data.id,{},'GET');//  基本设置-积分设置详情
export const integralSetDelete = data => fetch('jinshiintegrate/v1/w/integralSet/delete', data,'post');// 基本设置-积分设置删除
export const integralSetUpdate = data => fetch('jinshiintegrate/v1/w/integralSet/update', data,'post');// 基本设置-积分设置编辑
export const integralSetSave = data => fetch('jinshiintegrate/v1/w/integralSet/save', data,'post');// 基本设置-积分设置新增
export const integralRuleList = data => fetch('jinshiintegrate/v1/w/integralRule/list', data,'GET');// 基本设置-积分规则列表
export const integralRuleInfo = data => fetch('jinshiintegrate/v1/w/integralRule/info/'+data.id,{},'GET');//  基本设置-积分规则详情
export const integralRuleDelete = data => fetch('jinshiintegrate/v1/w/integralRule/delete', data,'post');// 基本设置-积分规则删除
export const integralRuleUpdate = data => fetch('jinshiintegrate/v1/w/integralRule/update', data,'post');// 基本设置-积分规则编辑
export const integralRuleSave = data => fetch('jinshiintegrate/v1/w/integralRule/save', data,'post');// 基本设置-积分规则新增
//积分相关下拉列表
export const getCard = data => fetch('jinshiintegrate/v1/w/integralSet/getCard', data,'GET');// 基本设置-获取存折列表
export const getInteger = data => fetch('jinshiintegrate/v1/w/integralSet/getInteger', data,'GET');// 基本设置-获取积分类别
export const getIntegralSetList = data => fetch('jinshiintegrate/v1/w/integralSet/getIntegralSetList', data,'post');// 基本设置-获取积分明细
// 乡村影集
export const villageAlbumList = data => fetch('jinshiintegrate/v1/w/villageAlbum/list', data,'GET');// 乡村影集-乡村影集列表
export const villageAlbumUpdate = data => fetch('jinshiintegrate/v1/w/villageAlbum/update', data,'post');// 乡村影集-乡村影集编辑
export const villageAlbumSave = data => fetch('jinshiintegrate/v1/w/villageAlbum/save', data,'post');// 乡村影集-乡村影集新增
export const villageAlbumDelete = data => fetch('jinshiintegrate/v1/w/villageAlbum/delete', data,'post');// 乡村影集-乡村影集删除
export const villageAlbumInfo = data => fetch('jinshiintegrate/v1/w/villageAlbum/info/'+data.id,{},'GET');//乡村影集-乡村影集详情
//用户管理
export const memberList = data => fetch('jinshimember/v1/w/jinshi/member/list', data,'GET');// 用户管理-用户列表
export const membergetById = data => fetch('jinshimember/v1/w/jinshi/member/getById', data,'GET');// 用户管理-用户详情
export const editMember = data => fetch('jinshimember/v1/w/jinshi/member/editMember', data,'post');// 用户管理-用户启用禁用
//商品管理
export const calcExGoods = data => fetch('jinshiintegrate/v1/w/exGoods/calcExGoods', data,'GET');// 商品管理-根据价格计算积分值
export const exGoodsList = data => fetch('jinshiintegrate/v1/w/exGoods/exGoods', data,'GET');// 商品管理-物品列表
export const saveExGoods = data => fetch('jinshiintegrate/v1/w/exGoods/saveExGoods', data,'post');// 商品管理-物品保存
export const updateExGoodsStatus = data => fetch('jinshiintegrate/v1/w/exGoods/updateExGoodsStatus', data,'post');// 商品管理-物品编辑
export const exGoodsInfo = data => fetch('jinshiintegrate/v1/w/exGoods/exGoodsInfo', data,'GET');// 商品管理-物品详情
export const getExGoodsRecords = data => fetch('jinshiintegrate/v1/w/exGoods/getExGoodsRecords', data,'GET');// 商品管理-兑换列表
//积分管理
export const getIntegralRegisterList = data => fetch('jinshiintegrate/v1/w/register/getIntegralRegisterList', data,'post');// 积分管理-积分登记列表
export const getMemberIntegralInfo = data => fetch('jinshiintegrate/v1/w/register/getMemberIntegralInfo', data,'post');// 积分管理-积分登记登记查询
export const registerAdd = data => fetch('jinshiintegrate/v1/w/register/add', data,'post');// 积分管理-积分登记登记提交
export const getIntegralRegisterById = data => fetch('jinshiintegrate/v1/w/register/getIntegralRegisterById/'+data.id, {},'get');// 积分管理-积分登记详情
export const registerEdit = data => fetch('jinshiintegrate/v1/w/register/edit', data,'post');// 积分管理-积分登记审核
export const getIntegralList = data => fetch('jinshiintegrate/v1/w/integral/getIntegralList', data,'get');// 积分管理-积分类别集合
export const getIntegralPublicityList = data => fetch('jinshiintegrate/v1/w/publicity/getIntegralPublicityList', data,'post');// 积分管理-公示列表
export const getIntegralPublicityById = data => fetch('jinshiintegrate/v1/w/publicity/getIntegralPublicityById/'+data.id, {},'get');// 积分管理-公示详情
export const publicityEdit = data => fetch('jinshiintegrate/v1/w/publicity/publicityEdit', data,'post');// 积分管理-公示修正
export const getIntegralPersonList = data => fetch('jinshiintegrate/v1/w/person/getIntegralPersonList', data,'post');// 积分管理-个人积分列表
export const getIntegralPersonDetail = data => fetch('jinshiintegrate/v1/w/person/getIntegralPersonDetail', data,'post');// 积分管理-个人积分明细
export const getIntegralByMemberId = data => fetch('jinshiintegrate/v1/w/person/getIntegralByMemberId/'+data.id, {},'get');// 积分管理-个人积分详情查看
export const getIntegralFamilyList = data => fetch('jinshiintegrate/v1/w/family/getIntegralFamilyList', data,'post');// 积分管理-家庭积分列表
export const getIntegralFamilyInfo = data => fetch('jinshiintegrate/v1/w/family/getIntegralFamilyInfo', data,'post');// 积分管理-家庭积分详情查看
export const getIntegralFamilyDetail = data => fetch('jinshiintegrate/v1/w/family/getIntegralFamilyDetail', data,'post');// 积分管理-家庭积分明细查看
export const getIntegralBatchList = data => fetch('jinshiintegrate/v1/w/import/getIntegralBatchList', data,'post');// 积分管理-批量处理积分列表
export const getIntegralBatchById = data => fetch('jinshiintegrate/v1/w/import/getIntegralBatchById/'+data.id, {},'get');// 积分管理-积分批量处理详情查看
export const getIntegralBatchMemberList = data => fetch('jinshiintegrate/v1/w/import/getIntegralBatchMemberList', data,'post');// 积分管理-批量处理明细列表
export const batchOperate = data => fetch('jinshiintegrate/v1/w/import/batchOperate', data,'post');// 积分管理-批量处理/删除/审核
//首页
export const getHomeHeader = data => fetch('jinshiintegrate/v1/w/home/getHomeHeader', data,'post');//首页-数量
export const getHomeBaseCount = data => fetch('jinshiintegrate/v1/w/home/getHomeBaseCount', data,'post');//首页-基本信息
export const getHomeWaitCount = data => fetch('jinshiintegrate/v1/w/home/getHomeWaitCount', data,'post');//首页-待处理数量
export const getHomeTotalScore = data => fetch('jinshiintegrate/v1/w/home/getHomeTotalScore', data,'post');//首页-积分存折占比
export const getWebRankList = data => fetch('jinshiintegrate/v1/w/home/getWebRankList', data,'get');//首页-积分排名下拉框
export const getWebRankById = data => fetch('jinshiintegrate/v1/w/home/getWebRankById', data,'post');//首页-各类排行榜明细
export const getHomeGoodsInfo = data => fetch('jinshiintegrate/v1/w/home/getHomeGoodsInfo', data,'post');//首页-商品信息





/**
 * ================================================================================================
 * xj  接口相关      20200106
 * ================================================================================================
 */
export const memberLogin = data => fetch('jinshimember/v1/login/jinshi/jinShiMemberLoginWeb', data,'POST');// 登录
export const memberLoginOut = data => fetch('jinshimember/v1/login/memberLoginOut', data,'POST');// 退出
export const sendShortMessageCode = data => fetch('jinshimember/v1/login/sendShortMessageCode', data,'POST');// 发送短信验证码
export const retrievePasswordNew = data => fetch('jinshimember/v2/login/retrievePassword', data,'POST');// 登录-找回密码
export const loginCheckCode = data => fetch('jinshimember/v2/login/checkCode', data,'POST');// 登录-校验验证码
export const setMemberAvatar = data => fetch('jinshimember/v1/login/setMemberAvatar', data,'POST');// 上传头像
export const changeMemberPhone = data => fetch('jinshimember/v1/login/changeMemberAppPhone', data,'POST');// 修改手机号
export const changeMemberPassword = data => fetch('jinshimember/v1/login/changeMemberPassword', data,'POST');// 修改密码
export const getWebMemberBaseInfo = data => fetch('jinshimember/v1/login/getWebMemberBaseInfo', data,'GET');// 个人中心
export const getStreetByArea = data => fetch('commonality/v1/division/streetByArea', data, 'GET');// 根据县code 获取 镇列表数据
export const getVillageByStreet = data => fetch('commonality/v1/division/villageByStreet', data, 'GET');// 根据镇code 获取 村列表数据
// 心愿管理
export const getWishPageList = data => fetch('jinshiintegrate/v1/w/wish/getWishPageList', data, 'POST');// 心愿-列表
export const getWishById = data => fetch('jinshiintegrate/v1/w/wish/getWishById/'+data.id);// 心愿-详情
export const getWishUpdate = data => fetch('jinshiintegrate/v1/w/wish/update', data, 'POST');// 心愿-编辑
export const getWishDelete = data => fetch('jinshiintegrate/v1/w/wish/delete/'+data.id);// 心愿-删除
export const getVolunteerPageList = data => fetch('jinshiintegrate/v1/w/volunteer/getVolunteerPageList', data, 'POST');// 志愿者-列表
export const getVolunteerById = data => fetch('jinshiintegrate/v1/w/volunteer/getVolunteerById/'+data.id);// 志愿者-列表
export const getIntegralListByCardId = data => fetch('jinshiintegrate/v1/w/integral/getIntegralListByCardId/'+data.id);// 存折id获取积分类别
export const volunteerAdd = data => fetch('jinshiintegrate/v1/w/volunteer/add',data,'POST'); // 志愿者-新增
export const volunteerUpdate = data => fetch('jinshiintegrate/v1/w/volunteer/update',data,'POST'); // 志愿者-编辑
export const getRegisterPageList = data => fetch('jinshiintegrate/v1/w/volunteer/getRegisterPageList',data,'POST'); // 志愿者-报名列表
export const volunteerDel = data => fetch('jinshiintegrate/v1/w/volunteer/delete/'+data.id);// 志愿者-删除
// 内容管理
export const commendationList = data => fetch('jinshiintegrate/v1/w/honorCommendation/commendationList', data, 'GET');// 表彰-列表
export const getCommendation = data => fetch('jinshiintegrate/v1/w/commendationSet/getCommendation', data, 'GET');// 荣誉表彰-下拉框
export const commendationPublish = data => fetch('jinshiintegrate/v1/w/honorCommendation/commendationPublish', data, 'POST');// 荣誉表彰-发布
export const getDoorMemberByVillageCode = data => fetch('jinshimember/v1/member/getDoorMemberByVillageCode', data, 'GET');// 荣誉表彰-根据姓名获取人员
export const commendationDetails = data => fetch('jinshiintegrate/v1/w/honorCommendation/commendationDetails', data, 'GET');// 荣誉表彰-详情
export const updateCommendationStatus = data => fetch('jinshiintegrate/v1/w/honorCommendation/updateCommendationStatus', data, 'POST');// 荣誉表彰-状态更新
export const rankList = data => fetch('jinshiintegrate/v1/w/rank/list', data, 'GET');// 乡贤榜-列表
export const rankSave = data => fetch('jinshiintegrate/v1/w/rank/save', data, 'POST');// 乡贤榜-撤榜
export const updateState = data => fetch('jinshiintegrate/v1/w/rank/updateState', data, 'POST');// 乡贤榜-撤榜
export const rankGetById = data => fetch('jinshiintegrate/v1/w/rank/getById', data, 'GET');// 乡贤榜-详情
export const getMemberByVillageCode = data => fetch('jinshimember/v1/member/getMemberByVillageCode', data, 'GET');// 乡贤榜-根据姓名获取人员
export const advList = data => fetch('jinshiintegrate/v1/w/adv/advList', data, 'GET');// 首页轮播图-列表
export const advPublish = data => fetch('jinshiintegrate/v1/w/adv/advPublish', data, 'POST');// 首页轮播图-发布
export const advDetail = data => fetch('jinshiintegrate/v1/w/adv/advDetail', data, 'GET');// 首页轮播图-详情
export const innerSelectList = data => fetch('jinshiintegrate/v1/w/adv/innerSelectList', data, 'GET');// 获取商业发布内部链接选项内
export const advUpdateState = data => fetch('jinshiintegrate/v1/w/adv/updateState', data, 'POST');// 首页轮播图-状态变更
export const memberManageList = data => fetch('jinshiintegrate/v1/w/memberManage/list', data, 'GET');// 成员管理-列表
export const getRoleList = data => fetch('jinshiintegrate/v1/w/role/getRoleList', data, 'GET');// 成员管理-获取所有角色
export const getMemberByMobile = data => fetch('jinshimember/v1/member/getMemberByMobile', data, 'GET');// 成员管理-手机号获取成员信息
export const memberManageInfo = data => fetch('jinshiintegrate/v1/w/memberManage/info/'+data.id);// 成员管理-详情
export const memberManageSave = data => fetch('jinshiintegrate/v1/w/memberManage/save', data, 'POST');// 成员管理-新增
export const memberManageUpdate = data => fetch('jinshiintegrate/v1/w/memberManage/update', data, 'POST');// 成员管理-编辑
export const memberManageDelete = data => fetch('jinshiintegrate/v1/w/memberManage/delete', data, 'POST');// 成员管理-删除
// 系统设置
export const villageOpenList = data => fetch('jinshiintegrate/v1/w/villageIntroduction/openList', data, 'GET');//开通乡村-列表
export const villageOpen = data => fetch('jinshiintegrate/v1/w/villageIntroduction/open', data, 'POST');//开通乡村-开通、关闭
export const commendationSetList = data => fetch('jinshiintegrate/v1/w/commendationSet/list', data, 'GET');// 表彰设置-列表
export const commendationGetById = data => fetch('jinshiintegrate/v1/w/commendationSet/getById', data, 'GET');// 表彰设置-详情
export const commendationSetAdd = data => fetch('jinshiintegrate/v1/w/commendationSet/add', data, 'POST');// 表彰设置-新增
export const commendationSetEdit = data => fetch('jinshiintegrate/v1/w/commendationSet/edit', data, 'POST');// 表彰设置-编辑
export const commendationSetDelete = data => fetch('jinshiintegrate/v1/w/commendationSet/delete', data, 'POST');// 表彰设置-删除
export const getTabPageList = data => fetch('jinshiintegrate/v1/w/tab/getTabPageList', data, 'POST');//Tab分页列表
export const tabPageListAdd = data => fetch('jinshiintegrate/v1/w/tab/add', data, 'POST');//Tab-新增
export const tabGetTabById = data => fetch('jinshiintegrate/v1/w/tab/getTabById/'+data.id);//Tab-详情
export const tabPageListUpdate = data => fetch('jinshiintegrate/v1/w/tab/update', data, 'POST');//Tab-编辑
export const tabGetTabDelete = data => fetch('jinshiintegrate/v1/w/tab/delete/'+data.id);//Tab-删除
export const getCardList = data => fetch('jinshiintegrate/v1/w/card/getCardList', data, 'GET');//存折分页列表
export const getCardById = data => fetch('jinshiintegrate/v1/w/card/getCardById/'+data.id);//存折主键id查询
export const cardAdd = data => fetch('jinshiintegrate/v1/w/card/add', data, 'POST');//存折-新增
export const cardUpdate = data => fetch('jinshiintegrate/v1/w/card/update', data, 'POST');//存折-编辑
export const cardDelete = data => fetch('jinshiintegrate/v1/w/card/delete/'+data.id);//存折-删除
export const getIntegralPageList = data => fetch('jinshiintegrate/v1/w/integral/getIntegralPageList', data, 'POST');//积分类别-列表
export const integralAdd = data => fetch('jinshiintegrate/v1/w/integral/add', data, 'POST');//积分类别-新增
export const getIntegralById = data => fetch('jinshiintegrate/v1/w/integral/getIntegralById/'+data.id);//积分类别-详情
export const integralUpdate = data => fetch('jinshiintegrate/v1/w/integral/update', data, 'POST');//积分类别-编辑
export const integralDel = data => fetch('jinshiintegrate/v1/w/integral/delete/'+data.id);//积分类别-删除
export const getGradeList = data => fetch('jinshiintegrate/v1/w/grade/getGradeList', data, 'GET');//等级列表
export const getGradeById = data => fetch('jinshiintegrate/v1/w/grade/getGradeById/'+ data.id);//等级-详情
export const gradeUpdate = data => fetch('jinshiintegrate/v1/w/grade/update', data, 'POST');//等级-编辑
export const getRolePageList = data => fetch('jinshiintegrate/v1/w/role/getRolePageList', data, 'POST');//角色-列表
export const getConfigInfo = data => fetch('jinshiintegrate/v1/w/config/getConfigInfo', data, 'GET');//系统设置-详情
export const configUpdate = data => fetch('jinshiintegrate/v1/w/config/update', data, 'POST');//系统设置-编辑
export const getMenuList = data => fetch('jinshiintegrate/v1/w/menu/getMenuList/'+ data.deptLevel);//角色-所有菜单
export const roleSave = data => fetch('jinshiintegrate/v1/w/role/addRole', data, 'POST');//角色-新增
export const getRoleById = data => fetch('jinshiintegrate/v1/w/role/getRoleById/'+ data.id);//角色-详情
export const updateRole = data => fetch('jinshiintegrate/v1/w/role/updateRole', data, 'POST');//角色-编辑
export const updateStatus = data => fetch('jinshiintegrate/v1/w/role/updateStatus', data, 'POST');//角色-启用禁用
export const deleteRole = data => fetch('jinshiintegrate/v1/w/role/deleteRole/'+ data.id);//角色-删除
export const getRankPageList = data => fetch('jinshiintegrate/v1/w/rank/getRankPageList', data, 'POST');//积分排名分页列表
export const getRankById = data => fetch('jinshiintegrate/v1/w/rank/getRankById/'+ data.id);//积分排名-详情
export const getRankPageUpdate = data => fetch('jinshiintegrate/v1/w/rank/update', data, 'POST');//积分排名分-编辑
export const getPersonalMenuList = data => fetch('jinshiintegrate/v1/w/login/getPersonalMenuList/'+data.memberId, {},'get');//个人菜单列表

// 月评季奖
export const monthlyAward = data => fetch('jinshiintegrate/v1/w/monthlyAward/list', data, 'GET');//列表
export const monthlyAwardSave = data => fetch('jinshiintegrate/v1/w/monthlyAward/save', data, 'POST');//新增
export const monthlyAwardUpdate = data => fetch('jinshiintegrate/v1/w/monthlyAward/setUpdate', data, 'POST');//显示设置
export const monthlyAwardUpdateAll = data => fetch('jinshiintegrate/v1/w/monthlyAward/update', data, 'POST');//编辑
export const monthlyAwardDel = data => fetch('jinshiintegrate/v1/w/monthlyAward/delete', data, 'POST');//删除
export const monthlyAwardInfo = data => fetch('jinshiintegrate/v1/w/monthlyAward/info/'+ data.id);//详情
