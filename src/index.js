// 配置了HotModuleReplacementPlugin 之后，会发现，此时我们修改代码，仍然是整个页面都会刷新。不希望整个页面都刷新，加以下配置
// if(module && module.hot) {
//     module.hot.accept()
// }

import './index.less'

// class Animal {
//     constructor(name) {
//         this.name = name
//     }
//     getName() {
//         return this.name
//     }
// }

// let dog = new Animal('dog')
// console.log('aaa');

// if (DEV === 'dev') {
//     console.log('开发环境')
// } else {
//     console.log('生产环境')
// }

//需要将 localhost:3000 转发到 localhost:4000（服务端） 端口
fetch("/api/user")   //这个api其实接口没有这个字段的，接口就是user,加上api是为了所有接口统一配置跨域，见proxy配置
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));