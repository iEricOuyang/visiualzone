/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-11-23 16:39:13 
 * @Description: 今日重大警情
 * @Last Modified by: ouyangdecai
 * @Last Modified time: 2017-12-14 11:19:41
 */
import $ from 'jquery'
import { fetch } from '@/util/request'
import LiMarquee from 'limarquee'
import tpl from './index.hbs'
import infoTpl from './info.hbs' 
import './index.css'

class CaseInfo {
  constructor(el) {
    $(el).append(tpl())
    this.render = this.render.bind(this)
  }
  render() {
    fetch('fetchCaseInfo', data => {
      if (data.length == 0) return
      const initLength = $('.important-into .case-list').children('li').length
      $('.important-into .case-list').html(infoTpl(data))
      if(initLength === 0){
        const liMarquee = new LiMarquee('.limarquee')
        liMarquee.render({
          direction: 'up',
          scrollamount: 30
        })
      }
    })
  }

}
export default CaseInfo
