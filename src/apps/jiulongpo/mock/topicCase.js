/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 09:03:40 
 * @Description: 本月专题警情mock数据
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-01 09:04:01
 */
export default {
    url: '/jiulongpo/topiccase',
    mock: {
        'code': 1,
        'msg': 'success',
        // 'result|3': [
        //     {
        //         'name': '@cword(4)',
        //         'value|100-1000': 22
        //     }
        // ]
        result: [
            {
                'name': '七类侵财',
                'value': 393
            },
            {
                'name': '八类暴力',
                'value': 6
            },
            {
                'name': '两抢一盗',
                'value': 469
            }
        ]
    }
}