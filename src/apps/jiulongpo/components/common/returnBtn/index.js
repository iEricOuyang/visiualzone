/*
 * @Author: ouyangdecai@hiynn.com 
 * @Date: 2017-12-04 10:15:07 
 * @Description: 返回按钮
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2017-12-05 09:09:26
 */
import $ from 'jquery'
import tpl from './index.hbs'
import './index.css'
class ReturnBtn{
    constructor(el, returnBtnText, createInterval){
        $(el).append(tpl({returnBtnText}))
        $('.return-btn').on('click', () => {
            $('#app').show()
            $('#sub-app').hide()
            createInterval()
        })
    }
}
export default ReturnBtn