/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-02 09:04:01 
 * @Description: 今日处警模块
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-02 09:04:27
 */
import $ from 'jquery'
import { fetch } from '@/util/request'
import tpl from './index.hbs'
import './index.css'

class Total {
  constructor(el) {
    $(el).append(tpl())
  }
  render() {
    fetch('fetchTotal', data => {
      $('.total .value').html(data.value)
    })
  }
}
export default Total
