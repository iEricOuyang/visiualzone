/*
 * @Author: ouyangdecai 
 * @Date: 2017-12-02 09:02:33 
 * @Description: 页面总标题渲染
 * @Last Modified by:   ouyangdecai 
 * @Last Modified time: 2017-12-02 09:02:33 
 */
import $ from 'jquery'
import tpl from './index.hbs'
import './index.css'

class Title {
  constructor(el) {
    this.el = el
  }

  render(title) {
    $(this.el).append(
      tpl({
        title
      })
    )
  }
}
export default Title
