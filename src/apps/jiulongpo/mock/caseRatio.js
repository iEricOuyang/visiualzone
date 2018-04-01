/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-01 09:01:04 
 * @Description: 本月警情同环比mock数据
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-01 09:01:30
 */
export default {
    url: '/jiulongpo/casecomparison',
    mock: {
        'code': 1,
        'msg': 'success',
        // 'result|8': [
        //     {
        //         'name': '@cword(4)',
        //         'tongbi|-100-100': -20,
        //         'tongbiValue|100-1000': 135,
        //         'huanbi|-100-100': 30,
        //         'huanbiValue|100-1000': 128
        //     }
        // ]
        result: [
          {
            'name': '道路交通类',
            'tongbi': 0,
            'tongbiValue': -3351,
            'huanbi': 2.31,
            'huanbiValue': 188
          },
          {
            'name': '公民求助',
            'tongbi': -35.08,
            'tongbiValue': -4223,
            'huanbi': 7.01,
            'huanbiValue': 512
          },
          {
            'name': '其他类',
            'tongbi': 2.05,
            'tongbiValue': 102,
            'huanbi': 13.38,
            'huanbiValue': 600
          },
          {
            'name': '纠纷',
            'tongbi': 2.61,
            'tongbiValue': 61,
            'huanbi': 5.6,
            'huanbiValue': 127
          },
          {
            'name': '刑事类',
            'tongbi': -25.44,
            'tongbiValue': -305,
            'huanbi': -53.53,
            'huanbiValue': -1030
          },
          {
            'name': '治安类',
            'tongbi': -10.16,
            'tongbiValue': -69,
            'huanbi': 8.73,
            'huanbiValue': 49
          },
          {
            'name': '行政案件',
            'tongbi': 13.68,
            'tongbiValue': 32,
            'huanbi': -6.67,
            'huanbiValue': -19
          },
          {
            'name': '110工作特殊需要',
            'tongbi': 3200,
            'tongbiValue': 32,
            'huanbi': 312.5,
            'huanbiValue': 25
          },
          {
            'name': '举报类',
            'tongbi': -30.77,
            'tongbiValue': -8,
            'huanbi': 63.64,
            'huanbiValue': 7
          },
          {
            'name': '灾害类',
            'tongbi': -66.67,
            'tongbiValue': -2,
            'huanbi': -90.91,
            'huanbiValue': -10
          }
        ]
    }

}