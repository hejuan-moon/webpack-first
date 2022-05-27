// 配置了HotModuleReplacementPlugin 之后，会发现，此时我们修改代码，仍然是整个页面都会刷新。不希望整个页面都刷新，加以下配置
// if(module && module.hot) {
//     module.hot.accept()
// }

import './login.less'

class Animal {
    constructor(name) {
        this.name = name
    }
    getName() {
        return this.name
    }
}

let dog = new Animal('dog')
console.log('aaa');