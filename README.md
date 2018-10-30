# zqz-ui

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Document

### Install

``` bash
npm install zqz-ui -S
```

### Quick Start

```bash
// main.js
import ZqzUI from 'zqz-ui';

Vue.use(ZqzUI);

// 组件中使用
<template>
    <swiper ref="swiper" :delay="3000" :speed="300" :auto="false" :indicatorColor="'pink'" :indicatorActiveColor="'red'" @change="onSwiperChange">
        <swiper-item v-for="(item, index) in slideArr" :key='index'>
            <div class="slide-item slide01">{{item}}</div>
            </swiper-item>
        </swiper>
</template>

<script>
    export default {
        data() {
            return {
                slideArr: [1, 2 , 3, 4]
            }
        },
        methods: {
            onSwiperChange(data) {
                console.log(data);
            }
        }
    }
</script>

<style scoped>
.slide-item{
    height: 200px;
    color: #fff;
    font-size: 20px;
    text-align: center;
}
.slide-item::before{
    display: inline-block;
    width: 0;
    height: 100%;
    content: "";
    vertical-align: middle;
}
.slide01{
    background-color: grey;
}
.slide02{
    background-color: #333;
}
.slide03{
    background-color: grey;
}
</style>
```
### Options

> auto: true  // 自动播放
> 
> delay: 3000 // 滑动时间间隔
> 
> speed: 300 // 滑动速度
> 
> navigationButtons: true // 是否显示左右切换按钮
> 
> pagination: true // 是否显示指示点
> 
> indicatorColor: '#ddd' //指示点底色
> 
> indicatorColor: '#fff' //指示点高亮颜色