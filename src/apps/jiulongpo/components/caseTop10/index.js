/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 10:36:03 
 * @Description:  本月各类案件top10
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-01 17:58:23
 */
import $ from 'jquery'
import {
  fetch
} from '@/util/request'
import tpl from './index.hbs'
import itemTpl from './item.hbs'
import './index.css'
class CaseTop10 {
  constructor(el) {
    $(el).append(tpl())
  }
  render() {
    fetch('fetchCaseTop10', data => {
      data.sort((a, b) => {
        return b.value - a.value
      })
      let max = data[0].value

      const dataSet = data.map(item => {
        return {
          ...item,
          barWidth: (max && item.value * 100 / max || 0) + '%'
        }
      })
      $('.case-top10 .top10-list').html(itemTpl(dataSet))
    })
  }
}
export default CaseTop10
