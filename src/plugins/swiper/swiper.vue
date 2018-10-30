<template>
    <div class="swiper-container" ref="swiperContainer">
        <div class="swiper-wrapper" ref="swiperWrapper" :style="swiperWrapperStyle">
            <slot></slot>
        </div>
        <div class="swiper-button swiper-button-prev" v-if="navigationButtons" @click="slide('prev')"></div>
        <div class="swiper-button swiper-button-next" v-if="navigationButtons" @click="slide('next')"></div>
        <div class="swiper-pagination" v-if="pagination" @click="onBulletClick">
            <span class="swiper-pagination-bullet" :style="{backgroundColor: (index+1==bulletIndex)?indicatorActiveColor:indicatorColor}" v-for="(item, index) in bullets" :data-index="index"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Swiper',
        data() {
            return {
                swiperWrapper: null,
                swiperItems: [],
                swiperItemNum: 0,
                bullets: [],
                bulletIndex: 1,
                currentIndex: 1,
                swiperWidth: 0,
                wrapperWidth: '100%',
                transformStyle: {
                    transitionDuration: '0ms',
                    transform: 'translate3d(0, 0, 0)'
                },
                transformFlag: false,
                timer: null,
                touchStartX: 0,
                touchEndX: 0
            }
        },
        props: {
            auto: {
                type: Boolean,
                default: true
            },
            delay: {
                type: Number,
                default: 5000
            },
            speed: {
                type: Number,
                default: 300
            },
            navigationButtons: {
                type: Boolean,
                default: true
            },
            pagination: {
                type: Boolean,
                default: true
            },
            indicatorColor: {
                type: String,
                default: 'rgba(0, 0, 0, 0.3)'
            },
            indicatorActiveColor: {
                type: String,
                default: '#fff'
            }
        },
        computed: {
            swiperWrapperStyle: function() {
                return{
                    width: this.wrapperWidth,
                    ...this.transformStyle
                }
            }
        },
        created() {

        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.swiperWrapper = this.$refs['swiperWrapper'];
                this.swiperWidth = this.$el.clientWidth;
                this.swiperItems = this.$refs['swiperWrapper'].querySelectorAll('.swiper-item');
                this.swiperItemNum = this.swiperItems.length;
                for(let i = 0; i < this.swiperItems.length; i++) {
                    this.bullets.push(i)
                    this.swiperItems[i].style.width = `${this.swiperWidth}px`;
                }
                this.swiperWrapper.append(this.swiperItems[0].cloneNode(true));
                this.swiperWrapper.prepend(this.swiperItems[this.swiperItemNum - 1].cloneNode(true));
                this.wrapperWidth = `${this.swiperWidth * (this.swiperItemNum + 2)}px`;
                this.transformStyle.transform = `translate3d(-${this.swiperWidth * this.currentIndex}px, 0 , 0)`;
                this.swiperWrapper.addEventListener('transitionend', this.onTransitionend);
                this.auto && this.autoPlay();
                this.$refs.swiperContainer.addEventListener('mouseover', () => {
                    clearInterval(this.timer);
                })
                this.$refs.swiperContainer.addEventListener('mouseout', () => {
                    this.auto && this.autoPlay();
                })
                this.handleGesture();
            },
            slide(dir) {
                if(this.transformFlag) {
                    return false;
                }
                if(dir == 'prev') {
                    this.currentIndex --;
                }
                if(dir == 'next') {
                    this.currentIndex ++;
                }
                this.updateBulletIndex();
                this.transformFlag = true;
                this.transformStyle = {
                    transitionDuration: `${this.speed}ms`,
                    transform: `translate3d(-${this.swiperWidth * this.currentIndex}px, 0 , 0)`
                }
            },
            onTransitionend() {
                this.transformFlag = false;
                if(this.currentIndex == 0 || this.currentIndex == this.swiperItemNum + 1) {
                    if(this.currentIndex == 0) {
                        this.currentIndex = this.swiperItemNum;
                    }
                    if(this.currentIndex == this.swiperItemNum + 1) {
                        this.currentIndex = 1;
                    }
                    this.transformStyle = {
                        transitionDuration: '0ms',
                        transform: `translate3d(-${this.swiperWidth * this.currentIndex}px, 0 , 0)`
                    }
                }
            },
            updateBulletIndex() {
                this.bulletIndex = this.currentIndex;
                if(this.bulletIndex == 0) {
                    this.bulletIndex = this.swiperItemNum;
                }
                if(this.bulletIndex == this.swiperItemNum + 1) {
                    this.bulletIndex = 1;
                }
                let swiperData = {
                    currentIndex: this.bulletIndex - 1
                };
                this.$emit('change', swiperData);
            },
            autoPlay() {
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    this.slide('next');
                    this.timer = null;
                }, this.delay + this.speed);
            },
            handleGesture() {
                this.swiperWrapper.addEventListener('touchstart', e => {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.touchStartX = e.targetTouches[0].pageX;
                })
                this.swiperWrapper.addEventListener('touchmove', e => {
                    this.touchEndX = e.targetTouches[0].pageX;
                    let disX = this.touchEndX - this.touchStartX;
                    this.transformStyle.transitionDuration = '0ms';
                    this.transformStyle.transform = `translate3d(${-this.swiperWidth * this.currentIndex + disX}px, 0 , 0)`;
                })
                this.swiperWrapper.addEventListener('touchend', e => {
                    let disX = this.touchEndX - this.touchStartX;
                    if(Math.abs(disX) > 60) {
                        if(disX < 0) {
                            this.slide('next');
                        }
                        else {
                            this.slide('prev');
                        }
                    }
                    else {
                        this.transformStyle = {
                            transitionDuration: '100ms',
                            transform: `translate3d(-${this.swiperWidth * this.currentIndex}px, 0 , 0)`
                        }
                    }
                    this.auto && this.autoPlay();
                })
            },
            onBulletClick(e) {
                if(e.target.tagName == 'SPAN') {
                    this.currentIndex = parseInt(e.target.dataset.index) + 1;
                    this.slide();
                }
            }
        }
    }
</script>

<style scoped>
.swiper-container{
    width: 100%;
    /*height: 200px;*/
    overflow: hidden;
    position: relative;
}
.swiper-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    transition-timing-function: ease;
}
.swiper-pagination{
    width: 100%;
    font-size: 0;
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 20px;
}
.swiper-pagination-bullet{
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #ddd;
    border-radius: 50%;
    margin: 0 4px;
    cursor: pointer;
}
.swiper-pagination-bullet-active{
    background-color: green;
}
.swiper-button{
    width: 40px;
    height: 40px;
    background-color: green;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
}
.swiper-button-prev{
    left: 0;
}
.swiper-button-next{
    right: 0;
}
</style>