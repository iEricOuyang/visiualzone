/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 09:02:40 
 * @Description: 今日警情mock数据
 * @Last Modified by:   ouyangdecai 
 * @Last Modified time: 2017-12-01 09:02:40 
 */
export default {
    url: '/jiulongpo/solvedcaseinfo',
    mock: {
        'code': 1,
        'msg': 'success',
        'result|3': [
            '@date(yyyy.MM.dd)，@csentence(20,30)', 
            '@date(yyyy.MM.dd)，@csentence(20,30)'
        ]
    }
}