/*
* @Author: ouyangdecai@hiynn.com
* @Date: 2017-12-04 11:31:10
* @Description: 案由详情弹出框
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-05 16:43:43
*/
import $ from 'jquery'
import { fetch } from '@/util/request'
import tpl from './index.hbs'
import itemTpl from './item.hbs'
import './index.css'

class CaseDetail {
  constructor(el) {
    $(el).append(tpl())
    $('.close-btn').on('click', () => {
      $('.detail-container').fadeOut()
    })
  }
  render(type, domainId, startTime, endTime) {
    fetch('fetchCaseDetail', {type, domainId, startTime, endTime}, data => {
      $('.detail-list').html(itemTpl(data))
      $('.detail-container').fadeIn()
    })
  }
}
export default CaseDetail