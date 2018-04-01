/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 09:47:37 
 * @Description:  右上角日期、时间
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-02 09:02:13
 */
import $ from 'jquery'
import { fetchSocket } from '@/util/request'
import tpl from './index.hbs'
import './index.css'

class Time {
  constructor(el) {
    $(el).append('<div class="time"></div>')
  }
  render() {
    fetchSocket('fetchTime', 1, d => {
      const date = d.data
      const year = date.slice(0, 4)
      const month = date.slice(5, 7)
      const day = date.slice(8, 10)
      const hour = date.slice(11, 13)
      const minute = date.slice(14, 16)
      const week = date.slice(19)
      const timeInfo = {
        year,
        month,
        day,
        hour,
        minute,
        week
      }
      $('.time').html(tpl(timeInfo))
    })
  }
}
export default Time
