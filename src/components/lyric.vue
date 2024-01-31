<!--lyric.vue-->
<script>
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
                        tempactiveLineIndexs.push(this.lyric.lines.findIndex((value,index) => {
                            if(value.startTime >= this.state.nowTime){
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
                            if (!this.deepEqual(this.activeLineIndexs, tempactiveLineIndexs)) {
                                this.activeLineIndexs.forEach((value,index)=>{
                                    if(tempactiveLineIndexs.findIndex((value2)=>{value==value2}) != -1&&this.lyric.lines[value-1]){
                                        this.lyric.lines[value-1]['active'] = true
                                        return true
                                    } else if (this.lyric.lines[value-1]){
                                        this.lyric.lines[value-1]['active'] = false
                                        return false
                                    }
                                })
                                if(this.lyric.lines[tempactiveLineIndexs[0]-1])this.lyric.lines[tempactiveLineIndexs[0]-1]['active'] = true
                                this
                                    .activeLineIndexs =
                                    tempactiveLineIndexs

                                
                            }
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
                let centerTop = this.tempData.halfWindowHeight * 0.7
                let lastTop = centerTop,
                    lastBottom = centerTop
                let elements = document.querySelectorAll("div>#lyricLine"),
                    halfElementOffsetHeight = 0
                if (this.lyric.lines[this.activeLineIndexs[0] - 1]) {
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
            }
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
                    if (this.lyricText.tranContent) {
                        let tranEdLyric = lyricParser.parseLRClyric(this.lyricText.tranContent)
                        this.lyric.headers = {
                            ...this.lyric.headers,
                            ...tranEdLyric.headers
                        }
                        for (let index = 0; index < this.lyric.lines.length; index++) {
                            const element = this.lyric.lines[index];
                            let tranEdLine = tranEdLyric.lines.find((value) => {
                                return Math.abs(value.startTime - element.startTime) < 0.1
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
                handler: async function (newVal) {
                    if (newVal !== this.lastActiveLineIndexs) {
                        this.lastActiveLineIndexs = newVal
                    }
                },
                // deep: true
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
        <div :style="(rendingLine[index])?{
            visibility: 'visible',
            top: (rendingLine[index].top+'px'),
        color: (index+1==activeLineIndexs[0])?'#0009':'#0007',
        transform: (index+1==activeLineIndexs[0])?'scale(1)':'scale(.8)',
    
        }:{visibility: 'hidden'}" v-for="(item, index) in lyric.lines" :key="index" id="lyricLine" class="lyricLine">
            <div v-if="item" class="content">
                <div v-if="lyric.type == 'lrc'">{{ item.text }}</div>
                <div v-if="lyric.type == 'yrc'&&item.active!=true">{{ item.text }}</div>
                <span v-for="(line,wordIndex) in item.words" v-if="lyric.type == 'yrc'&&item.active==true">{{ line.word }}</span>
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
        padding: 0.5em 0;
        color: #0007;
        font-weight: 900;
        transition: top 0.3s, color 0.3s, transform 0.3s;
        transform: scale(0.95);
        transform-origin: 0% 50%
    }

    div.content {
        font-size: 1.9em;
    }

    div.tran {
        font-size: 1.4em;
    }
</style>