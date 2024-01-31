<!--lyric.vue-->
<script>
    import {
        transform
    } from '@vue/compiler-core';
    import anime from 'animejs/lib/anime.es';
    import elemListener from '../js/elemListener';
    import lyricParser from '../js/lyricParser.js'
    export default {
        data() {
            return {
                config: {
                    usingwfwLyric: true, //是否启用逐字歌词
                    energySavingMode: false // 是否继续渲染歌词画面
                },
                lyric: {
                    type: 'none'
                },
                state: {
                    nowTime: 0,
                },
                intervalIDs: {
                    LyricCalculate: undefined,
                    wfwLyricCalculate: undefined
                },
                tempData: {
                    windowHeight: undefined,
                    halfWindowHeight: undefined
                },
                activeLineIndexs: [],
                lastActiveLineIndexs: [],
                rendingLine: {}
            }
        },
        methods: {
            checkConfig(config) {

            },
            LyricCalculate() {
                const self = this
                this.intervalIDs.LyricCalculate = setInterval(() => {
                    if (this.lyric.type != 'none') {
                        this.state.nowTime = this.audioDom.currentTime
                        let tempactiveLineIndexs = []
                        // 根据时间找到所有激活的行
                        tempactiveLineIndexs.push(this.lyric.lines.findIndex((value, index) => {
                            if (value.startTime >= this.state.nowTime) {
                                return value.startTime >= this.state.nowTime
                            } else {
                                return false
                            }

                        }))

                        if (tempactiveLineIndexs[0] == -1) {
                            if (!this.deepEqual(this.activeLineIndexs, [])) this.activeLineIndexs = []
                            return
                        } else {
                            for (let i = tempactiveLineIndexs[0]; i < this.lyric.lines.length; i++) {
                                const element = this.lyric.lines[i];
                                if (element.startTime >= this.state.nowTime && element.endTime <= this.state
                                    .nowTime) {
                                    tempactiveLineIndexs.push(i)
                                }
                            }
                        }
                        if (!this.deepEqual(this.activeLineIndexs, tempactiveLineIndexs)) {
                            this.activeLineIndexs.forEach((value, index) => {
                                if (tempactiveLineIndexs.findIndex((value2) => {
                                        value == value2
                                    }) != -1 && this.lyric.lines[value - 1]) {
                                    this.lyric.lines[value - 1]['active'] = true
                                    return true
                                } else if (this.lyric.lines[value - 1]) {
                                    this.lyric.lines[value - 1]['active'] = false
                                    return false
                                }
                            })
                            if (this.lyric.lines[tempactiveLineIndexs[0] - 1]) this.lyric.lines[
                                tempactiveLineIndexs[0] - 1]['active'] = true
                            this
                                .activeLineIndexs =
                                tempactiveLineIndexs
                        }
                        // 如果正在渲染歌词画面，则继续
                        if (this.config.energySavingMode == false) {

                            // 计算应该显示的行和理应的赋值
                            this.LyricListRender()
                        }

                    }
                }, 80);
            },
            deepEqual(obj1, obj2) {
                if (obj1 === obj2) return true;
                if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
                    return false;
                }
                let keys1 = Object.keys(obj1);
                let keys2 = Object.keys(obj2);
                if (keys1.length !== keys2.length) return false;
                for (let key of keys1) {
                    if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
                        return false;
                    }
                }
                return true;
            },
            LyricListRender() {
                let rendingLine = {}
                let centerTop = this.tempData.halfWindowHeight * 0.65
                let lastTop = centerTop,
                    lastBottom = centerTop
                let elements = document.querySelectorAll("div>#lyricLine"),
                    halfElementOffsetHeight = 0
                if (this.lyric.lines[this.activeLineIndexs[0] - 1]&&elements.length>0) {
                    const element = elements[this.activeLineIndexs[0] - 1]
                    halfElementOffsetHeight = element.offsetHeight / 2
                    lastTop = centerTop - halfElementOffsetHeight
                    lastBottom = centerTop + halfElementOffsetHeight

                    rendingLine[this.activeLineIndexs[0] - 1] = {
                        index: this.activeLineIndexs[0] - 1,
                        top: centerTop - halfElementOffsetHeight
                    }
                }
                for (let i = this.activeLineIndexs[0] - 2; lastBottom >= 0; i--) {
                    const element = elements[i];
                    if (element) {
                        lastTop -= element.offsetHeight
                        lastBottom -= element.offsetHeight
                        rendingLine[i] = {
                            index: i,
                            top: lastTop
                        }
                    } else {
                        lastTop = -1
                        lastBottom = -1
                    }
                }

                lastTop = centerTop - halfElementOffsetHeight
                lastBottom = centerTop + halfElementOffsetHeight

                for (let i = this.activeLineIndexs[0]; lastTop <= this.tempData.windowHeight; i++) {
                    const element = elements[i];
                    if (element) {
                        lastTop = lastBottom
                        lastBottom += element.offsetHeight
                        rendingLine[i] = {
                            index: i,
                            top: lastTop
                        }
                    } else {
                        lastBottom = this.tempData.windowHeight
                        lastTop = this.tempData.windowHeight + 1
                    }
                }

                this.rendingLine = rendingLine
            },
            LyricLineRender(useAnimation, newrendingLine, oldrendingLine) {
                let lines = document.querySelectorAll("div>#lyricLine")
                const self = this
                let needHiddenIndex = [],
                    stillVisibleIndex = [],
                    needVisibleIndex = []
                let useMove = (newrendingLine != undefined && oldrendingLine != undefined)
                if (useMove == true) {

                    // 找出不同触发类型的元素
                    for (const key in oldrendingLine) {
                        if (Object.hasOwnProperty.call(oldrendingLine, key)) {
                            const value = oldrendingLine[key];
                            let hasSameIndex = false
                            for (const key2 in (newrendingLine)) {
                                const value2 = newrendingLine[key2];
                                hasSameIndex = (hasSameIndex == false) ? value2.index == value.index : true
                            }
                            if (hasSameIndex == true && this.lyric.lines[value.index]) {
                                stillVisibleIndex.push(value.index)
                            } else if (this.lyric.lines[value.index]) {
                                needHiddenIndex.push(value.index)
                            }
                        }
                    }
                    for (const key in newrendingLine) {
                        if (Object.hasOwnProperty.call(newrendingLine, key)) {
                            const value = newrendingLine[key];
                            let hasSameIndex = false
                            for (const key2 in (oldrendingLine)) {
                                const value2 = oldrendingLine[key2];

                                hasSameIndex = (hasSameIndex == false) ? value2.index == value.index : true
                            }
                            if (hasSameIndex == false && this.lyric.lines[value.index]) {
                                needVisibleIndex.push(value.index)
                            }
                        }
                    }
                }
                if (useAnimation == true) {
                    if (useMove == true) {
                        console.log(needHiddenIndex,stillVisibleIndex,needVisibleIndex);
                        needHiddenIndex.forEach(info => {
                            const element = lines[info];
                            this.cssEditor(element, {
                                visibility: 'hidden',
                                transform: 'translateY(0px)'
                            })
                        });
                        needVisibleIndex.forEach(info=>{
                            const element = lines[info];
                            this.cssEditor(element, {
                                visibility: 'visible',
                                transform: 'translateY('+ newrendingLine[info].top + 'px)'
                            })
                        })
                        anime({
                            targets: lines,
                            translateY: (el, index, length) => {
                                return (newrendingLine[index]) ? (newrendingLine[index].top + 'px') : ('0')
                            },
                            delay: (el, index, length) => {
                                return (newrendingLine[index]) ? ((index - self.activeLineIndexs + 3) *
                                    50) : 0
                            },
                            easing: 'spring(1, 90, 14, 0)',

                        })
                    }
                } else {
                    if (useMove == true && 1 == 2) {
                        for (let i = 0; i < needHiddenIndex.length; i++) {
                            const element = lines[needHiddenIndex[i].index];
                            const info = needHiddenIndex[i]
                            this.cssEditor(element, {
                                visibility: 'hidden',
                                top: '0px'
                            })
                        }
                        for (let i = 0; i < stillVisibleIndex.length; i++) {
                            const element = lines[stillVisibleIndex[i].index];
                            const info = stillVisibleIndex[i]
                            this.cssEditor(element, {
                                visibility: 'visible',
                                top: info.top
                            })
                        }
                        for (let i = 0; i < needVisibleIndex.length; i++) {
                            const element = lines[needVisibleIndex[i].index];
                            const info = needVisibleIndex[i]
                            this.cssEditor(element, {
                                visibility: 'visible',
                                top: info.top
                            })
                        }
                    }
                }
                this.activeLine(lines, useAnimation)
            },
            // 高亮行显示
            activeLine(lines, useAnimation) {
                if (lines == undefined) lines = document.querySelectorAll("div>#lyricLine")
                for (const key in this.rendingLine) {
                    if (Object.hasOwnProperty.call(this.rendingLine, key)) {
                        const element = this.rendingLine[key];
                        let hasActive = this.activeLineIndexs.findIndex((value)=>element.index==value)!=-1
                        if(hasActive == true&&lines[element.index - 1]){
                            this.cssEditor(lines[element.index - 1], {
                                color: "#0009",
                                transform: lines[element.index - 1].style.transform + ' scale(1)'
                            })
                        } else if(lines[element.index - 1]) {
                            this.cssEditor(lines[element.index - 1], {
                                color: "#0005",
                                transform: lines[element.index - 1].style.transform + ' scale(0.9)'
                            })
                        }
                    }
                }
                // this.activeLineIndexs.forEach((value, index, array) => {
                //     if (useAnimation == true && lines[value - 1]) {
                //         // anime({
                //         //     targets: lines[value - 1],
                //         //     color: "#0009",
                //         //     transform: 'scale(1)',
                //         //     easing: 'spring(1, 80, 13, 0)',
                //         // })

                //     } else if (lines[value - 1]) {
                //         this.cssEditor(lines[value - 1], {
                //             color: "#0009",
                //             transform: 'scale(1)'
                //         })
                //     }
                // })
            },
            cssEditor(element, style) {
                // 检查传入的是否为一个 DOM 元素
                if (!(element instanceof Element)) {
                    return;
                }
                // 检查 style 是否为一个对象
                if (typeof style !== 'object' || style === null) {
                    return;
                }
                // 如果 style 对象为空，则清除元素上的所有内联样式
                if (Object.keys(style).length === 0) {
                    element.removeAttribute('style');
                } else {
                    // 遍历 style 对象，并应用每个样式规则
                    for (const property in style) {
                        element.style.setProperty(property,style[property]);
                    }
                }
            }

        },
        beforeDestroyed: () => {
            clearInterval(intervalIDs.LyricCalculate);
            clearInterval(intervalIDs.wfwLyricCalculate);
        },
        props: {
            audioDom: HTMLAudioElement,
            lyricText: Object,
            importedConfig: Object
        },
        watch: {
            lyricText: {
                handler: async function (newVal) {
                    if (this.lyricText.type == 'none') {
                        this.lyric = {
                            type: 'none'
                        };
                        return
                    }
                    this.lyric = (this.lyricText.type == "yrc") ? lyricParser.parseYRClyric(this.lyricText
                        .content) : lyricParser.parseLRClyric(this.lyricText.content)
                    this.rendingLine = {}
                    if (this.lyricText.tranContent) {
                        let tranEdLyric = lyricParser.parseLRClyric(this.lyricText.tranContent)
                        this.lyric.headers = {
                            ...this.lyric.headers,
                            ...tranEdLyric.headers
                        }
                        for (let index = 0; index < this.lyric.lines.length; index++) {
                            const element = this.lyric.lines[index];
                            let tranEdLine = tranEdLyric.lines.find((value) => {
                                return Math.abs(value.startTime - element.startTime) < 0.2
                            })
                            if (tranEdLine == undefined) continue
                            element['tranEdContent'] = tranEdLine.text
                        }
                    }
                },
                deep: true
            },
            importedConfig: {
                handler: async function (newVal) {
                    this.checkConfig()
                },
                deep: true
            },
            activeLineIndexs: {
                handler: async function (newVal, oldVal) {
                    if (!this.deepEqual(newVal, this.lastActiveLineIndexs)) {
                        this.lastActiveLineIndexs = newVal,
                            this.LyricLineRender(true)
                    }
                },
                deep: true
            },
            rendingLine: {
                handler: async function (newVal, oldVal) {
                    if (!this.deepEqual(oldVal, this.rendingLine)) {
                        this.LyricLineRender(true, newVal, oldVal)
                    }
                },
                deep: true
            }
        },
        created() {
            const self = this
            this.checkConfig()
            this.LyricCalculate()
            elemListener.onWindowsResize(() => {
                self.tempData.windowHeight = window.innerHeight
                self.tempData.halfWindowHeight = self.tempData.windowHeight / 2
            })
            this.$nextTick(() => {

                this.tempData.windowHeight = window.innerHeight
                this.tempData.halfWindowHeight = self.tempData.windowHeight / 2
            })
        }
    }
</script>
<template>
    <div ref="lyricRow" v-if="lyric&&lyric.type != 'none'&&lyric.lines" class="lyricRow">
        <div v-for="(item, index) in lyric.lines" :key="item.text" id="lyricLine" class="lyricLine">
            <div v-if="item" class="content">
                <div v-if="lyric.type == 'lrc'">{{ item.text }}</div>
                <div v-if="lyric.type == 'yrc'&&item.active!=true">{{ item.text }}</div>
                <span v-for="(line,wordIndex) in item.words"
                    v-if="lyric.type == 'yrc'&&item.active==true">{{ line.word }}</span>
            </div>
            <div v-if="item&&item.tranEdContent" class="tran">
                <div>{{ item.tranEdContent }}</div>

            </div>

        </div>
    </div>
</template>
<style scoped>
    .lyricRow {
        display: relative;
        height: 100vh;

    }

    .lyricLine {
        position: absolute;
        font-size: min(2.5vh, 2vw);
        padding: 0.9em 0;
        color: #0005;
        font-weight: 900;
        transition: color 0.3s;
        transform-origin: 0% 50%;
        visibility: hidden;
        transform: scale(0.9);
        will-change: transform,visibility,color
    }

    div.content {
        font-size: 1.8em;
    }

    div.tran {
        font-size: 1.2em;
    }
</style>