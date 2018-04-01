/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 09:03:21 
 * @Description: 时间请求mock数据
 * @Last Modified by:   ouyangdecai 
 * @Last Modified time: 2017-12-01 09:03:21 
 */
export default {
    url: '/timewebsocket/time',
    isWebsocket: true,
    mock: {
        code: 1,
        'msg': 'success',
        'result': {
            data: '2017-11-13 09:38 星期四'
        }
    }
}