/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-03 13:03:26 
 * @Description: 案由树形菜单
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-08 14:00:01
 */
import $ from 'jquery'
import { fetch } from '@/util/request'
import caseTpl from './caseList.hbs'
import tpl from './index.hbs'
import './index.css'
class CaseMenu{
  /**
   * 下拉菜单构造函数
   * @param {string} el 组件需要挂载到的节点选择器
   * @param {any} renderSubMap 渲染地图数据的回调函数
   * @memberof CaseMenu
   */
  constructor(el,renderMap) {
    this.renderMap = renderMap
    this.render = this.render.bind(this)
    $(el).append(tpl())
  }
  /**
   * 根据数据渲染菜单
   * 
   * @param {string} el 列表需要挂载到的节点选择器
   * @param {string} id 被选中的案由id，初始化传0
   * @memberof CaseMenu
   */
  render(el,id) {
    fetch('fetchCaseMenu', { id }, data => {
      $(el).append(caseTpl(data))    
      let level = 0 
      // 默认进入下钻页面时，执行if语句块，只需要绑定一次事件
      if(id === 0){
        level = 0
        this.bindEvent(el)
      } else {
        level = parseInt($(el).attr('level'), 10) + 1
      }
      $(el).find('li').attr('level', level)
        .addClass(`level${level}`)       
      $(el).find('li:last-child').addClass('unexpended') 
    })
  }
  /**
   * 给菜单项绑定点击事件
   * 
   * @param {any} el 菜单的挂载点
   * @memberof CaseMenu
   */
  bindEvent(el) {
    const { renderMap } = this
    $(el).find('li').on('click', e => {
      /**
       * 双击实际触发了两次单击事件，如果不调用clearTimeout，
       * 即使在dblclick中清除了定时器，第一次被触发的点击事件仍然会执行
       */
      clearTimeout(this.timeout)
      this.timeout = setTimeout( () => {
        $('.drop-menu').find('.active').removeClass('active')
        $(e.target).addClass('active')      
        const target = $(e.target).parent()
        const mark = parseInt($(target).attr('data-mark'), 10)
        const currentId = $(target).attr('data-id')
        const ul = $(target).find('ul')
        // console.log(target,mark,currentId,ul)
        // 如果当前点击的项不包含ul列表，并且它是可扩展的，则请求被点击案由的下级案由
        if(ul.length == 0 && mark){
          this.render(target, currentId)
        } else {
          ul.toggle()
        }
        // 切换收展状态
        $(e.target).toggleClass('expended')
      }, 300)

    })
    // 双击时更新数据
    $(el).find('li').bind('dblclick', e => {
      clearTimeout(this.timeout)
      const target = $(e.target).parent()
      const currentId = $(target).attr('data-id')
      renderMap(currentId)
    })
  }
}
export default CaseMenu
