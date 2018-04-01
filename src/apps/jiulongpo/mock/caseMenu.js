/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-03 13:02:29 
 * @Description: 案由菜单接口
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-04 18:32:48
 */
export default {
  url: '/jiulongpo/seed/:id',
  mock: {
    'code': 1,
    'msg': 'success',
    'result|5-10': [
        {
            'id|1000000-100000000':1,
            'name':'@cword(3,5)',
            'mark|0-1':1
        }
    ]
  }
}