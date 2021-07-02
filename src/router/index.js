import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
    { path: "/", name: "login", component: () => import("@/views/login"), meta: { title: '登录' } },
    { path: '/404', component: () => import('@/views/404'), name: '404', meta: { title: '404未找到' } }
]

const routes = [
    //首页
    {
        path: '/',
        component: () => import('@/views/index'),
        name: 'index',
        redirect: { name: 'home' },
        children: [
            { path: "/home", name: "home", component: () => import('@/views/Home'), meta: { title: '首页', noCache: true } },
            { path: "/userInfo", name: "userInfo", component: () => import('@/views/userInfo'), meta: { title: '个人中心' } },
        ]
    },
    /*wyl的路由*/
    //积分管理
    {
        path: '/index',
        redirect: '/integralManage/integralRegister',
        meta: { title: '积分管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/integralManage/integralRegister", name: "integralRegister", component: () => import("@/views/integralManage/integralRegister/integralRegister"), meta: { title: '积分登记' } },
            {
                path: "/integralManage/integralRegister",
                name: "integralRegister",
                component: () => import("@/views/integralManage/integralRegister/index"),
                meta: { title: '积分登记' },
                children: [
                    { path: "/integralManage/register", name: "register", component: () => import("@/views/integralManage/integralRegister/register"), meta: { title: '登记',activeMenu: 'integralRegister' } },
                    { path: "/integralManage/integralRegisterView", name: "integralRegisterView", component: () => import("@/views/integralManage/integralRegister/integralRegisterView"), meta: { title: '查看',activeMenu: 'integralRegister' } },
                    { path: "/integralManage/examIntegralRegister", name: "examIntegralRegister", component: () => import("@/views/integralManage/integralRegister/examIntegralRegister"), meta: { title: '审核',activeMenu: 'integralRegister' } },
                ]
            },
            { path: "/integralManage/integralHandle", name: "integralHandle", component: () => import("@/views/integralManage/integralHandle/integralHandle1"), meta: { title: '积分批量处理' } },
            {
                path: "/integralManage/integralHandle",
                name: "integralHandle",
                component: () => import("@/views/integralManage/integralHandle/index"),
                meta: { title: '积分批量处理' },
                children: [
                    { path: "/integralManage/integralHandleView", name: "integralHandleView", component: () => import("@/views/integralManage/integralHandle/integralHandleView"), meta: { title: '查看',activeMenu: 'integralHandle' } },

                ]
            },
            { path: "/integralManage/personalIntegral", name: "personalIntegral", component: () => import("@/views/integralManage/personalIntegral/personalIntegral"), meta: { title: '个人积分' } },
            {
                path: "/integralManage/personalIntegral",
                name: "personalIntegral",
                component: () => import("@/views/integralManage/personalIntegral/index"),
                meta: { title: '个人积分' },
                children: [
                    { path: "/integralManage/personalIntegralView", name: "personalIntegralView", component: () => import("@/views/integralManage/personalIntegral/personalIntegralView"), meta: { title: '查看',activeMenu: 'personalIntegral' } },
                    { path: "/integralManage/inergralDetailed", name: "inergralDetailed", component: () => import("@/views/integralManage/personalIntegral/inergralDetailed"), meta: { title: '明细' ,activeMenu: 'personalIntegral'} },
                ]
            },
            { path: "/integralManage/exportIntegral", name: "exportIntegral", component: () => import("@/views/integralManage/exportIntegral"), meta: { title: '导出积分' } },
            { path: "/integralManage/familyIntegral", name: "familyIntegral", component: () => import("@/views/integralManage/familyIntegral/familyIntegral"), meta: { title: '家庭积分' } },
            {
                path: "/integralManage/familyIntegral",
                name: "familyIntegral",
                component: () => import("@/views/integralManage/familyIntegral/index"),
                meta: { title: '家庭积分' },
                children: [
                    { path: "/integralManage/familyIntegralView", name: "familyIntegralView", component: () => import("@/views/integralManage/familyIntegral/familyIntegralView"), meta: { title: '查看',activeMenu: 'familyIntegral' } },
                    { path: "/integralManage/familyDetailed", name: "familyDetailed", component: () => import("@/views/integralManage/familyIntegral/familyDetailed"), meta: { title: '积分明细' ,activeMenu: 'familyIntegral'} },
                ]
            },
            { path: "/integralManage/integralPublicity", name: "integralPublicity", component: () => import("@/views/integralManage/integralPublicity/integralPublicity"), meta: { title: '积分公示列表' } },
            {
                path: "/integralManage/integralPublicity",
                name: "integralPublicity",
                component: () => import("@/views/integralManage/integralPublicity/index"),
                meta: { title: '积分公示列表' },
                children: [
                    { path: "/integralManage/integralPublicityView", name: "integralPublicityView", component: () => import("@/views/integralManage/integralPublicity/integralPublicityView"), meta: { title: '查看',activeMenu: 'integralPublicity' } },
                ]
            },
            { path: "/content/honerRecognition", name: "honerRecognition", component: () => import("@/views/content/recognition/honerRecognition"), meta: { title: '月评季奖' }},
            { path: "/content/honerRecognition",
                name: "honerRecognition",
                component: () => import("@/views/childIndex"),
                meta: { title: '月评季奖' },
                children: [
                    { path: "/honerRecognition/addRecognition", name: "addRecognition", component: () => import("@/views/content/recognition/addRecognition"), meta: { title: '发布', activeMenu: 'honerRecognition'} },
                    { path: "/honerRecognition/editRecognition/:id", name: "editRecognition", component: () => import("@/views/content/recognition/editRecognition"), meta: { title: '编辑', activeMenu: 'editRecognition'} },
                    { path: "/honerRecognition/moreRecognition/:id", name: "moreRecognition", component: () => import("@/views/content/recognition/moreRecognition"), meta: { title: '查看', activeMenu: 'honerRecognition'} }
                ]
            },
            { path: "/content/virtuous", name: "virtuous", component: () => import("@/views/content/virtuous/virtuous"), meta: { title: '乡贤榜' }},
            { path: "/content/virtuous",
                name: "virtuous",
                component: () => import("@/views/childIndex"),
                meta: { title: '乡贤榜' },
                children: [
                    { path: "/virtuous/virtuousAdd", name: "virtuousAdd", component: () => import("@/views/content/virtuous/virtuousAdd"), meta: { title: '发布', activeMenu: 'virtuous'} },
                    { path: "/virtuous/virtuousView/:id", name: "virtuousView", component: () => import("@/views/content/virtuous/virtuousView"), meta: { title: '查看', activeMenu: 'virtuous'} }
                ]
            },
        ]
    },
    //乡村管理
    {
        path: '/index',
        redirect: '/basicSettings/villageIntroduction',
        meta: { title: '乡村管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/basicSettings/villageIntroduction", name: "villageIntroduction", component: () => import("@/views/basicSettings/villageIntroduction/villageIntroduction"), meta: { title: '乡村介绍' } },
            {
                path: "/basicSettings/villageIntroduction",
                name: "villageIntroduction",
                component: () => import("@/views/basicSettings/villageIntroduction/index"),
                meta: { title: '乡村介绍' },
                children: [
                    { path: "/basicSettings/addVillageIntroduction", name: "addVillageIntroduction", component: () => import("@/views/basicSettings/villageIntroduction/addVillageIntroduction"), meta: { title: '编辑' ,activeMenu: 'villageIntroduction'} },
                    { path: "/basicSettings/villageIntroductionView", name: "villageIntroductionView", component: () => import("@/views/basicSettings/villageIntroduction/villageIntroductionView"), meta: { title: '查看 ',activeMenu: 'villageIntroduction' } },
                ]
            },
            { path: "/basicSettings/villageorganizations", name: "villageorganizations", component: () => import("@/views/basicSettings/villageorganizations/villageorganizations"), meta: { title: '乡村组织介绍' } },
            {
                path: "/basicSettings/villageorganizations",
                name: "villageorganizations",
                component: () => import("@/views/basicSettings/villageorganizations/index"),
                meta: { title: '乡村组织介绍' },
                children: [
                    { path: "/basicSettings/editVillageorganizations", name: "editVillageorganizations", component: () => import("@/views/basicSettings/villageorganizations/editVillageorganizations"), meta: { title: '编辑',activeMenu: 'villageorganizations' } },
                    { path: "/basicSettings/villageorganView", name: "villageorganView", component: () => import("@/views/basicSettings/villageorganizations/villageorganView"), meta: { title: '查看' ,activeMenu: 'villageorganizations'} },
                ]
            },
            { path: "/basicSettings/enterVillage", name: "enterVillage", component: () => import("@/views/basicSettings/enterVillage/enterVillage"), meta: { title: '走进乡村' } },
            {
                path: "/basicSettings/enterVillage",
                name: "enterVillage",
                component: () => import("@/views/basicSettings/enterVillage/index"),
                meta: { title: '走进乡村' },
                children: [
                    { path: "/basicSettings/addEnterVillage", name: "addEnterVillage", component: () => import("@/views/basicSettings/enterVillage/addEnterVillage"), meta: { title: '编辑',activeMenu: 'enterVillage' } },
                    { path: "/basicSettings/enterVillageView", name: "enterVillageView", component: () => import("@/views/basicSettings/enterVillage/enterVillageView"), meta: { title: '查看',activeMenu: 'enterVillage' } },
                ]
            },
            { path: "/basicSettings/villagerules", name: "villagerules", component: () => import("@/views/basicSettings/villagerules/villagerules"), meta: { title: '村规民约' } },
            {
                path: "/basicSettings/villagerules",
                name: "villagerules",
                component: () => import("@/views/basicSettings/villagerules/index"),
                meta: { title: '村规民约' },
                children: [
                    { path: "/basicSettings/addVillagerules", name: "addVillagerules", component: () => import("@/views/basicSettings/villagerules/addVillagerules"), meta: { title: '编辑',activeMenu: 'villagerules' } },
                    { path: "/basicSettings/villagerulesView", name: "villagerulesView", component: () => import("@/views/basicSettings/villagerules/villagerulesView"), meta: { title: '查看',activeMenu: 'villagerules' } },
                ]
            },
            { path: "/content/photograph", name: "photograph", component: () => import("@/views/content/photo/photograph"), meta: { title: '乡村影集' }},
            { path: "/content/photograph",
                name: "photograph",
                component: () => import("@/views/childIndex"),
                meta: { title: '乡村影集' },
                children: [
                    { path: "/photograph/photographAdd", name: "photographAdd", component: () => import("@/views/content/photo/photographAdd"), meta: { title: '发布', activeMenu: 'photograph'} },
                    { path: "/photograph/photographView", name: "photographView", component: () => import("@/views/content/photo/photographView"), meta: { title: '查看', activeMenu: 'photograph'} }
                ]
            },
        ]
    },
     //用户管理
     {
        path: '/index',
        redirect: '/userManage/userList',
        meta: { title: '用户管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/userManage/userList", name: "userList", component: () => import("@/views/userManage/userList/userList"), meta: { title: '用户列表' } },
            {
                path: "/userManage/userList",
                name: "userList",
                component: () => import("@/views/userManage/userList/index"),
                meta: { title: '用户列表' },
                children: [
                    { path: "/userManage/userView", name: "userView", component: () => import("@/views/userManage/userList/userView"), meta: { title: '查看', activeMenu: 'userList' } },
                ]
            },
            { path: "/userManage/familyManage", name: "familyManage", component: () => import("@/views/userManage/familyManage/familyManage"), meta: { title: '家庭户管理' } },
            {
                path: "/userManage/familyManage",
                name: "familyManage",
                component: () => import("@/views/userManage/familyManage/index"),
                meta: { title: '家庭户管理' },
                children: [
                    { path: "/userManage/familyView", name: "familyView", component: () => import("@/views/userManage/familyManage/familyView"), meta: { title: '查看',activeMenu: 'familyManage' } },
                    { path: "/userManage/familyView",
                     name: "familyView",
                     component: () => import("@/views/userManage/familyManage/familyView/index"),
                      meta: { title: '查看',activeMenu: 'familyManage' },
                      children:[
                        { path: "/userManage/userViews", name: "userViews", component: () => import("@/views/userManage/familyManage/familyView/userView"), meta: { title: '查看用户',activeMenu: 'familyManage' } },
                      ]
                     },
                ]
            },
            { path: "/basicSettings/groupManage", name: "groupManage", component: () => import("@/views/basicSettings/groupManage"), meta: { title: '乡村分组设置' } }
        ]
    },
    //商品管理
    {
        path: '/index',
        redirect: '/goodsManage/goodsManage',
        meta: { title: '商品管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/goodsManage/exchangeRecord", name: "exchangeRecord", component: () => import("@/views/goodsManage/exchangeRecord"), meta: { title: '兑换记录' }},
            { path: "/goodsManage/goodsManage", name: "goodsManage", component: () => import("@/views/goodsManage/goodsManage"), meta: { title: '商品列表' }},
            { path: "/goodsManage/goodsManage",
                name: "goodsManage/goodsManage",
                component: () => import("@/views/goodsManage/index"),
                meta: { title: '商品列表' },
                children: [
                    { path: "/goodsManage/addGoods", name: "addGoods", component: () => import("@/views/goodsManage/addGoods"), meta: { title: '新增', activeMenu: 'goodsManage'} },
                    { path: "/goodsManage/examGoods", name: "examGoods", component: () => import("@/views/goodsManage/examGoods"), meta: { title: '查看', activeMenu: 'goodsManage'} }
                ]
            },
        ]
    },


    /*xj的路由*/
    //心愿管理
    {
        path: '/index',
        redirect: '/wish/wishManage',
        meta: { title: '心愿管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/wish/volunteer", name: "volunteer", component: () => import("@/views/wish/volunteer"), meta: { title: '志愿者招募列表' }},
            { path: "/wish/volunteer",
                name: "volunteer",
                component: () => import("@/views/childIndex"),
                meta: { title: '志愿者招募列表' },
                children: [
                    { path: "/volunteer/volunteerAdd", name: "volunteerAdd", component: () => import("@/views/wish/volunteerAdd"), meta: { title: '发布', activeMenu: 'volunteer'}},
                    { path: "/volunteer/volunteerEdit/:id", name: "volunteerEdit", component: () => import("@/views/wish/volunteerEdit"), meta: { title: '编辑', activeMenu: 'volunteer'}},
                    { path: "/volunteer/volunteerView/:id", name: "volunteerView", component: () => import("@/views/wish/volunteerView"), meta: { title: '查看', activeMenu: 'volunteer'}},
                ]
            },
            { path: "/wish/wishManage", name: "wishManage", component: () => import("@/views/wish/wishManage"), meta: { title: '心愿列表' }},
            { path: "/wish/wishManage",
                name: "volunteer",
                component: () => import("@/views/childIndex"),
                meta: { title: '心愿列表' },
                children: [
                    { path: "/wishManage/wishManageView/:id", name: "volunteerAdd", component: () => import("@/views/wish/wishManageView"), meta: { title: '查看', activeMenu: 'wishManage'} }
                ]
            },
        ]
    },
    //内容管理
    {
        path: '/index',
        redirect: '/content/disclose',
        meta: { title: '内容管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/content/disclose", name: "disclose", component: () => import("@/views/content/disclose/disclose"), meta: { title: '信息公开' }},
            { path: "/content/disclose",
                name: "disclose",
                component: () => import("@/views/childIndex"),
                meta: { title: '信息公开' },
                children: [
                    { path: "/disclose/discloseAdd", name: "discloseAdd", component: () => import("@/views/content/disclose/discloseAdd"), meta: { title: '发布', activeMenu: 'disclose'} },
                    { path: "/disclose/discloseView", name: "discloseView", component: () => import("@/views/content/disclose/discloseView"), meta: { title: '查看', activeMenu: 'disclose'} }
                ]
            },
            { path: "/content/carousel", name: "carousel", component: () => import("@/views/content/carousel/carousel"), meta: { title: '轮播图管理' }},
            { path: "/content/carousel",
                name: "carousel",
                component: () => import("@/views/childIndex"),
                meta: { title: '轮播图管理' },
                children: [
                    { path: "/carousel/carouselAdd", name: "carouselAdd", component: () => import("@/views/content/carousel/carouselAdd"), meta: { title: '发布', activeMenu: 'carousel'}},
                    { path: "/carousel/carouselView/:id", name: "carouselView", component: () => import("@/views/content/carousel/carouselView"), meta: { title: '查看', activeMenu: 'carousel'}}
                ]
            },
            { path: "/sys/village", name: "village", component: () => import("@/views/sys/village"), meta: { title: '乡村管理' }},
            { path: "/sys/tabSet", name: "tabSet", component: () => import("@/views/sys/tabSet"), meta: { title: 'tab设置' }},
            { path: "/sys/depositSet", name: "depositSet", component: () => import("@/views/sys/deposit/depositSet"), meta: { title: '存折设置' }},
            { path: "/sys/depositSet",
                name: "depositSet",
                component: () => import("@/views/childIndex"),
                meta: { title: '存折设置' },
                children: [
                    { path: "/depositSet/depositAdd", name: "depositAdd", component: () => import("@/views/sys/deposit/depositAdd"), meta: { title: '添加存折', activeMenu: 'depositSet'}},
                    { path: "/depositSet/depositEdit/:id", name: "depositEdit", component: () => import("@/views/sys/deposit/depositEdit"), meta: { title: '编辑', activeMenu: 'depositSet'}}
                ]
            },
            { path: "/sys/integralCategory", name: "integralCategory", component: () => import("@/views/sys/integralCategory"), meta: { title: '积分类别设置' }},
            { path: "/sys/ranking", name: "ranking", component: () => import("@/views/sys/ranking"), meta: { title: '积分排名设置' }},
            { path: "/sys/levelSet", name: "levelSet", component: () => import("@/views/sys/level/levelSet"), meta: { title: '等级设置' }},
            { path: "/sys/levelSet",
                name: "levelSet",
                component: () => import("@/views/childIndex"),
                meta: { title: '等级设置' },
                children: [
                    { path: "/levelSet/levelEdit/:id", name: "levelEdit", component: () => import("@/views/sys/level/levelEdit"), meta: { title: '编辑', activeMenu: 'levelSet'}}
                ]
            },
            { path: "/sys/honorSetting", name: "honorSetting", component: () => import("@/views/sys/honor/honorSetting"), meta: { title: '荣誉表彰设置' }},
            { path: "/sys/honorSetting",
                name: "honorSetting",
                component: () => import("@/views/childIndex"),
                meta: { title: '荣誉表彰设置' },
                children: [
                    { path: "/honorSetting/addHonor", name: "addHonor", component: () => import("@/views/sys/honor/addHonor"), meta: { title: '添加', activeMenu: 'honorSetting'}},
                    { path: "/honorSetting/editHonor/:id", name: "editHonor", component: () => import("@/views/sys/honor/editHonor"), meta: { title: '编辑', activeMenu: 'honorSetting'}},
                ]
            },
            { path: "/basicSettings/integralSettings", name: "integralSettings", component: () => import("@/views/basicSettings/integralSettings/integralSettings"), meta: { title: '积分设置'} },
            {
                path: "/basicSettings/integralSettings",
                name: "integralSettings",
                component: () => import("@/views/childIndex"),
                meta: { title: '积分设置' },
                children: [
                    { path: "/basicSettings/addIntegralset", name: "addIntegralset", component: () => import("@/views/basicSettings/integralSettings/addIntegralset"), meta: { title: '添加' ,activeMenu: 'integralSettings' } },
                ]
            },
            { path: "/basicSettings/IntegralRule", name: "IntegralRule", component: () => import("@/views/basicSettings/IntegralRule/IntegralRule"), meta: { title: '积分规则' } },
            {
                path: "/basicSettings/IntegralRule",
                name: "IntegralRule",
                component: () => import("@/views/childIndex"),
                meta: { title: '积分规则' },
                children: [
                    { path: "/basicSettings/editIntegralRule", name: "editIntegralRule", component: () => import("@/views/basicSettings/IntegralRule/editIntegralRule"), meta: { title: '编辑' ,activeMenu: 'IntegralRule'} },
                    { path: "/basicSettings/IntegralRuleView", name: "IntegralRuleView", component: () => import("@/views/basicSettings/IntegralRule/IntegralRuleView"), meta: { title: '查看',activeMenu: 'IntegralRule' } },
                ]
            },
        ]
    },
    //系统管理
    {
        path: '/index',
        redirect: '/userManage/memberManage',
        meta: { title: '系统管理' },
        component: () => import('@/views/index'),
        name: 'index',
        children: [
            { path: "/userManage/memberManage", name: "memberManage", component: () => import("@/views/userManage/member/memberManage"), meta: { title: '成员管理' } },
            { path: "/userManage/memberManage",
                name: "memberManage",
                component: () => import("@/views/childIndex"),
                meta: { title: '成员管理' },
                children: [
                    { path: "/memberManage/memberView/:id", name: "memberView", component: () => import("@/views/userManage/member/memberView"), meta: { title: '查看', activeMenu: 'memberManage'}},
                    { path: "/memberManage/memberAdd", name: "memberAdd", component: () => import("@/views/userManage/member/memberAdd"), meta: { title: '添加成员', activeMenu: 'memberManage'}},
                    { path: "/memberManage/memberEdit/:id", name: "memberEdit", component: () => import("@/views/userManage/member/memberEdit"), meta: { title: '编辑', activeMenu: 'memberManage'}},
                ]
            },
            { path: "/sys/roleManage", name: "roleManage", component: () => import("@/views/sys/role/roleManage"), meta: { title: '角色管理' }},
            { path: "/sys/roleManage",
                name: "roleManage",
                component: () => import("@/views/childIndex"),
                meta: { title: '角色管理' },
                children: [
                    { path: "/roleManage/addRole", name: "addRole", component: () => import("@/views/sys/role/addRole"), meta: { title: '添加', activeMenu: 'roleManage'}},
                    { path: "/roleManage/editRole/:id", name: "editRole", component: () => import("@/views/sys/role/editRole"), meta: { title: '编辑', activeMenu: 'roleManage'}},
                    { path: "/roleManage/moreRole/:id", name: "moreRole", component: () => import("@/views/sys/role/moreRole"), meta: { title: '查看', activeMenu: 'roleManage'}},
                ]
            },
            { path: "/sys/publicitySet", name: "publicitySet", component: () => import("@/views/sys/publicitySet"), meta: { title: '系统设置' }}
        ]
    }
];

const router = new VueRouter({
    routes: globalRoutes.concat(routes)
});
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default router;
