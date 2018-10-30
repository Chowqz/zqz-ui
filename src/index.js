import {Swiper, SwiperItem} from './plugins/swiper';

const components = [
    Swiper,
    SwiperItem
];

const install = (Vue, options = {}) => {
    components.map(component => {
        Vue.component(component.name, component);
    })
};

if(typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    Swiper,
    SwiperItem
}