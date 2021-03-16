// import api from './index'
import { axios } from '@/utils/request'


// 获取所有一级分类
export function fenlei(parameter) {
  return axios({
    url: '/kunze/category/getHotelMenu',
    method: 'post',
    data: parameter,
    contentType:'application/form-data',
  })
}

// // 删除类
// export function delelei(data) {
//   return axios({
//     url: '/kunze/category/categoryDel',
//     method: 'post',
//     contentType: "application/json; charset=utf-8",
//     data
//
//   })
// }

// 添加商品分类、
export function addlei(data) {
  return axios({
    url: '/kunze/category/categorySave',
    method: 'post',
    contentType: "application/json; charset=utf-8",
    data
  })
}

//修改商品分类、
export function xiulei(data) {
  return axios({
    url: '/kunze/category/categoryUpdate',
    method: 'post',
    contentType: "application/json; charset=utf-8",
    data
  })
}
export function xiufz(data) {
  return axios({
    url: '/kunze/spec/updateSpec',
    method: 'post',
    contentType: "application/json; charset=utf-8",
    data
  })
}
export function chaorder(data) {
  return axios({
    url: '/kunze/order/queryOrder',
    method: 'post',
    contentType: "application/x-www-form-urlencoded",
    data
  })
}
