/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 09:01:37 
 * @Description: 本月各类案件TOP10 mock数据
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-01 09:01:58
 */
export default {
    url: '/jiulongpo/jingqing',
    mock: {   
        'code': '1',
        'msg': 'success',
        // 'result|10': [
        //     {
        //         'name': '@cword(4,6)',
        //         'value|1000-9999': 549
        //     }
        // ]  
        result: [
        {
          'name': '道路交通类',
          'value': 8319
        },
        {
          'name': '公民求助',
          'value': 7814
        },
        {
          'name': '其他类',
          'value': 5085
        },
        {
          'name': '纠纷',
          'value': 2396
        },
        {
          'name': '刑事类',
          'value': 894
        },
        {
          'name': '治安类',
          'value': 610
        },
        {
          'name': '行政案件',
          'value': 266
        },
        {
          'name': '110工作特殊需要',
          'value': 33
        },
        {
          'name': '举报类',
          'value': 18
        },
        {
          'name': '灾害类',
          'value': 1
        }
      ]
    }
}