import {baseUrl} from './env'
import {getStore, removeStore} from "./mUtils";
import router from '../router';
import {sign} from "./signApi";
import {Message} from 'element-ui';

//设置cookie
function setFetchCookie(name,value,expireHours){
    var eDate = new Date();
    eDate.setTime(eDate.getTime() + expireHours * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ((expireHours == null) ? "" : ";SameSite=None;expires=" + eDate.toUTCString());
}

// 接口公共方法  method = fetch/xhr
export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;
    let authToken = getStore('tokenId') || '';
    // 统一添加 member_id
    var storeAdminUserInfo = JSON.parse(getStore('adminUserInfo')) || '';
    var storeMemberId = storeAdminUserInfo.memberId || '';

    if (typeof (data) == 'string') {
        // data 为字符号串
        url = url + '/' + data;
    } else {
        // data 为数组
        var dataMemberId = data.member_id || '';
        if (dataMemberId.length === 0) {
            data.member_id = storeMemberId;
        }
        data = sign(data, authToken)

        if (type == 'GET' || type == 'DELETE') {
            let dataStr = ''; //数据拼接字符串
            Object.keys(data).forEach(key => {
                dataStr += key + '=' + data[key] + '&';
            });

            if (dataStr !== '') {
                dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
                url = url + '?' + dataStr;
            }
        }
    }

    if (window.fetch && method == 'fetch') {

        let requestConfig = {
            credentials: 'include',// include   /   omit
            method: type,
            headers: {
                'Accept': 'application/json; charset=UTF-8',// application/json; charset=utf-8
                //'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',// application/x-www-form-urlencoded; charset=utf-8  或 application/json; charset=utf-8  或 text/plain
                'Content-Type': 'application/json; charset=UTF-8',// application/x-www-form-urlencoded; charset=utf-8  或 application/json; charset=utf-8  或 text/plain
                'token': authToken,
                'Access-Control-Allow-Origin': '*',// *
            },
            mode: "cors",
            cache: "no-cache",//force-cache
        };

        if (type == 'POST' || type == 'PUT') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }

        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();

            var resCode = responseJson.code || '999999';
            var resMsg = responseJson.msg || '登录信息已失效，请重新登录。';

            // 异常强制退出
            if (resCode === '4001' || resCode === '4002' || resCode === '4003') {
                Message({showClose: false, message: resMsg, type: 'error', duration: 1000});
                // 设置退出标识
                setFetchCookie('hasLogin', false, 720);
                // 清除数据
                removeStore('tokenId');
                removeStore('adminUserInfo');
                removeStore('remember_me');
                removeStore('townListInfo');
                removeStore('villageListInfo');
                removeStore('districtsLevel');
                removeStore('districtsCode');
                removeStore('subMember');
                // 转向登录页面
                setTimeout(() => {
                    router.push({name: "login", params: {ref: 'forcedOffline'}});
                }, 1000)
            }

            return responseJson;
        } catch (error) {
            //console.log("=== catch error: ===");
            //console.log(error);
            throw new Error(error);
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }

            let sendData = '';

            if (type == 'POST' || type == 'DELETE') {
                sendData = JSON.stringify(data);
                //sendData = JSON.parse(data);
            }

            requestObj.open(type, url, true);
            requestObj.setRequestHeader("token", authToken);

            if (method == 'export') {
                // 导出
                requestObj.setRequestHeader("Content-type", "application/json");
            } else if (method == 'import') {
                // 导入
                requestObj.setRequestHeader("Content-Type", "multipart/form-data");
            } else {
                requestObj.setRequestHeader("Content-type", "application/json");
            }

            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response;
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }
        })
    }
}
