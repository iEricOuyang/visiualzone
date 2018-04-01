/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 09:00:36 
 * @Description: 重点案由环图mock数据
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-06 21:19:44
 */
export default {
    url: '/jiulongpo/casepies',
    mock: {
        code: 1,
        msg: 'success',
        // 'result|3': [
        //     {
        //         'id':'@natural(1,4)',
        //         'name': '@cword(4)',
        //         'value|100-9999': 1
        //     }
        // ]
        result: [
            {
                'id': '119',
                'name': '刑事类',
                'value': 162
            },
            {
                'id': '118',
                'name': '治安类',
                'value': 32
            },
            {
                'id': '114',
                'name': '交通类',
                'value': 126
            }
        ]
    }
}