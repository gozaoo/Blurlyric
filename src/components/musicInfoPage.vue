<script>
    import "bootstrap-icons/font/bootstrap-icons.css";
    import background from "./background.vue";
    import elemListener from "../js/elemListener.js"
    import anime from 'animejs/lib/anime.es.js';
    import lyricVue from "./lyric.vue";
    export default {
        data() {
            return {
                displayState: 'buttom',
                oriDisplayState: 'buttom',
                eventTempCache: (args) => {
                    switch (args.direction) {
                        case "up":
                        case "down":
                            this.changeDisplayState(args.direction, Number((args.speed*0.15).toFixed(0)))
                            break;
                        case "left":
                        case "right":
                            break;
                        default:
                            break;
                    }
                },
                slideEventReturn:{
                    removeSlideEvent:()=>{}
                },
                windowsResizeReturn: {
                    removeWindowsResize: ()=>{}
                },
                tempSetTimeoutSaver:setTimeout(() => {
                }, 0)
            }
        },
        components: {
            background,
            lyricVue
        },
        methods: {
            changeDisplayState(area, speed) {
                speed = Math.abs(speed).toFixed(0);
                if (speed > 15) speed = 15;
                if (speed === NaN) speed = 5
                const self = this
                switch (area) {
                    case 'up':
                        if (this.displayState == 'top') return
                        this.displayState = 'top'
                        this.oriDisplayState = 'top'
                        anime({
                            targets: this.$refs.player,
                            height: [this.$refs.player.offsetHeight + "px", window.innerHeight + "px"],
                            backgroundColor: "#ddddddff",
                            easing: 'spring(1,100, 60, ' + speed + ')',
                        })
                        anime({
                            targets: this.$refs.menu,
                            easing: 'linear',
                            duration: 100,
                            opacity: 1,
                        })
                        anime({
                            targets: this.$refs.miniControlBar,
                            opacity: 0,
                            right: ['0px', '-' + this.$refs.miniControlBar.offsetWidth + 'px'],
                            easing: 'spring(1,100, 60, ' + speed + ')',
                        })
                        anime({
                            easing: 'spring(1, 100, 60,  ' + speed + ')',
                            targets: this.$refs.coverImage,
                            left: this.$refs.coverImagePlaceHolder.offsetLeft,
                            top: this.$refs.coverImagePlaceHolder.offsetTop,
                            height: this.$refs.coverImagePlaceHolder.offsetWidth + 'px',
                        })
                        this.slideEventReturn.removeSlideEvent()
                        this.slideEventReturn = elemListener.addSlideEvent(this.$refs.coverImage, this.eventTempCache, {
                            threshold: 100
                        })
                        this.tempSetTimeoutSaver= setTimeout(() => {
                            this.$nextTick(()=>{
                                this.$refs.player.style.height = '100%'
                                this.$refs.highQualityView.style.display='block'
                            })
                        }, 1300);
                        setTimeout(() => {
                            this.$nextTick(()=>{
                                this.$refs.highQualityView.style.display='block'
                            })
                        }, 400);
                        this.windowsResizeReturn = elemListener.onWindowsResize(()=>{
                            this.$refs.coverImage.style.left = this.$refs.coverImagePlaceHolder.offsetLeft + 'px'
                            this.$refs.coverImage.style.top = this.$refs.coverImagePlaceHolder.offsetTop + 'px'
                            this.$refs.coverImage.style.height= this.$refs.coverImagePlaceHolder.offsetWidth + 'px'
                        })
                        break;

                    case 'down':
                        clearTimeout(this.tempSetTimeoutSaver)
                        if (this.displayState == 'buttom') return
                        this.displayState = 'buttom'
                        this.oriDisplayState = 'buttom'

                        this.$refs.highQualityView.style.display='none'

                        anime({
                            targets: this.$refs.player,
                            height: [this.$refs.player.offsetHeight + "px", '100px'],
                            easing: 'spring(1, 100, 60,' + speed + ')',
                            finished: () => {
                                anime({
                                    targets: self.$refs.player,
                                    backgroundColor: "#dddddd55",
                                    easing: 'spring(1, 100, 60,  ' + speed + ')',
                                })
                            }
                        })
                        anime({
                            targets: this.$refs.menu,
                            easing: 'linear',
                            duration: 100,
                            opacity: 0,
                        })
                        anime({
                            targets: this.$refs.miniControlBar,
                            opacity: 1,
                            right: '0px',
                            duration: 300,
                            easing: 'spring(1, 100, 60,  ' + speed + ')',
                        })

                        anime({
                            targets: this.$refs.coverImage,
                            left: 0,
                            easing: 'spring(1, 100, 60,  ' + speed + ')',
                            top: 0,
                            height: '58px',
                        })

                        this.slideEventReturn.removeSlideEvent()
                        this.slideEventReturn = elemListener.addSlideEvent(this.$refs.player, this.eventTempCache, {
                            threshold: 100
                        })
                        this.windowsResizeReturn.removeWindowsResize()
                        break;

                    default:
                        break;
                }
            },

            formTime(sec) { //秒数转化为mm:ss
                let s = sec % 60 < 10 ? ('0' + sec % 60) : sec % 60
                let min = Math.floor(sec / 60) < 10 ? ('0' + Math.floor(sec / 60)) : Math.floor(sec / 60)
                return min + ':' + s
            },
        },
        props: {
            musicInfo: Object,
            controls: Object,
            playerState: Object,
            lyric: Object,
            audio: HTMLAudioElement
        },
        watch: {
            musicInfo: {
                handler: async function (newVal) {
                },
                deep: true
            }
        },
        created() {
            const self = this
            this.$nextTick(() => {
                elemListener.addOnhoverListener(this.$refs.player, (state) => {
                    if (this.displayState == "top") return;
                    this.displayState = (state) ? 'wait' : this.oriDisplayState
                })
                this.slideEventReturn = elemListener.addSlideEvent(this.$refs.player, this.eventTempCache, {
                    threshold: 100
                })
            })
        }
    }
</script>

<template>
    <div ref="player" :class="['player',displayState]">
        <div id="audioProgress" v-if="displayState!='top'" class="processbar">
            <div :style="{'width': (playerState.icurrentTime / playerState.durationTime * 100).toFixed(2) + '%'}"
                class="progress"></div>
            <!-- <span>{{ playerState.currentTime }}</span> -->
        </div>
        <div class="relativeRow">
            <background :dynamic="false" :imgSrc="musicInfo.al.picUrl" :mainDisplay="displayState" />

            <div ref="coverImage" class="alPicTure">
                <div class="relativeRow">

                    <img class="blur" :src="musicInfo.al.picUrl + '?param=128y128'" alt="" srcset="">
                    <img ref="highQualityView" class="highQualityView" :src="musicInfo.al.picUrl + '?param=1024y1024'" alt="">
                    <img class="view" :src="musicInfo.al.picUrl + '?param=128y128'" alt="" srcset="">

                </div>
            </div>
            <div ref="miniControlBar" class="hiddenControlBar">
                <div class="flexRow">
                    <div class="info">
                        <h1 class="title">{{ musicInfo.name }}</h1>
                        <h2 class="artist"><span v-for="(item,e,index) in musicInfo.ar">{{ item.name + ' ' }}</span>
                        </h2>
                    </div>
                    <div class="bottoms">
                        <i @click="controls.prevTrack()" class="bi bi-skip-start-fill"></i>
                        <i @click="controls.play()"
                            :class="['bi',(playerState.audioState)?'bi-pause-fill':'bi-play-fill','notice']"></i>
                        <i @click="controls.nextTrack()" class="bi bi-skip-end-fill"></i>
                    </div>
                </div>
            </div>
            <div style="opacity:0" ref="menu" class="menu">

                <div ref="coverImagePlaceHolder" class="coverImage"
                    style="image-rendering: auto; transition: background-image 0.5s linear 0s, box-shadow 0.5s ease 0s, transform 0.5s cubic-bezier(0.3, 0.2, 0.2, 1.4) 0s;">
                </div>
                <div class="musicInfo">
                    <div style="display: flex;">
                        <div style="display: flex; flex: 1 1 0%; flex-direction: column; min-width: 0px;">
                            <div class="musicname">{{ musicInfo.name }}</div>


                            <div class="artists">
                                <span v-for="(item,index) in musicInfo.ar"> <span>{{ item.name }}</span> <span
                                        v-if="musicInfo.ar.length -1 != index">&</span> </span>
                            </div>

                        </div><button type="button" class="moreButtom"><i class="bi bi-three-dots"></i></button>
                    </div>
                    <div class="progressControl">
                        <div id="audioProgress" class="slider ">
                            <div :style="{'width': (playerState.icurrentTime / playerState.durationTime * 100).toFixed(2) + '%'}" class="inner">
                                <div class="thumb"></div>
                            </div>
                        </div>
                        <div class="progressTips">
                            <div>{{formTime(playerState.icurrentTime)}}</div>
                            <div>{{formTime(playerState.durationTime)}}</div>
                        </div>
                    </div>
                    <div class="musicControls">
                        <button style="font-size: 1.2em"><i class="bi bi-shuffle"></i></button>
                        <button @click="controls.prevTrack()" style="font-size: 1.3em"><i class="bi bi-skip-backward-fill"></i></button>
                        <button @click="controls.play()" style="font-size: 2.3em" class="am-music-play">
                            <i :class="['bi',(playerState.audioState)?'bi-pause-fill':'bi-play-fill']"></i>
                        </button>
                        <button @click="controls.nextTrack()" style="font-size: 1.3em"><i class="bi bi-skip-forward-fill"></i></button>
                        <button style="font-size: 1.2em">
                            <svg style="height:1.1em;width:1.1em" t="1657018656868" class="icon" viewBox="0 0 1024 1024"
                                version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1849">
                                <path
                                    d="M928 476.8c-19.2 0-32 12.8-32 32v86.4c0 108.8-86.4 198.4-198.4 198.4H201.6l41.6-38.4c6.4-6.4 12.8-16 12.8-25.6 0-19.2-16-35.2-35.2-35.2-9.6 0-22.4 3.2-28.8 9.6l-108.8 99.2c-16 12.8-12.8 35.2 0 48l108.8 96c6.4 6.4 19.2 12.8 28.8 12.8 19.2 0 35.2-12.8 38.4-32 0-12.8-6.4-22.4-16-28.8l-48-44.8h499.2c147.2 0 265.6-118.4 265.6-259.2v-86.4c0-19.2-12.8-32-32-32zM96 556.8c19.2 0 32-12.8 32-32v-89.6c0-112 89.6-201.6 198.4-204.8h496l-41.6 38.4c-6.4 6.4-12.8 16-12.8 25.6 0 19.2 16 35.2 35.2 35.2 9.6 0 22.4-3.2 28.8-9.6l105.6-99.2c16-12.8 12.8-35.2 0-48l-108.8-96c-6.4-6.4-19.2-12.8-28.8-12.8-19.2 0-35.2 12.8-38.4 32 0 12.8 6.4 22.4 16 28.8l48 44.8H329.6C182.4 169.6 64 288 64 438.4v86.4c0 19.2 12.8 32 32 32z"
                                    p-id="1850"></path>
                                <path d="M544 672V352h-48L416 409.6l16 41.6 60.8-41.6V672z" p-id="1851"></path>
                            </svg>
                        </button></div>

                </div>
                <lyricVue class="lyricRow" :importedConfig="{
                    usingwfwLyric: true,
                    energySavingMode: false
                }" :audioDom="audio" :lyricText="lyric" />
            </div>
        </div>

    </div>
</template>
<style scoped>
    .player {
        position: absolute;
        user-select: none;
        -webkit-user-drag: none;
        bottom: 0;
        left: 0px;
        width: 100vw;
        border-top: #ddd9 solid 1px;
        height: 100px;
        box-sizing: border-box;
        padding: 20px;
        overflow: hidden;
        background-color: #ddd5;
        backdrop-filter: blur(6vmin) saturate(200%);
        z-index: 9999;
        box-shadow: 0 0 5vmin #00000005;
        transition: background-color .3s, backdrop-filter 0s 0s;
    }

    .player:hover {
        background-color: #ddd;
    }

    .player.top,
    .player.wait {
        backdrop-filter: blur(0) saturate(0);
        background-color: #ddd;
        transition: background-color .3s, backdrop-filter 0s 0.3s;
    }

    .processbar {
        position: absolute;
        top: 0px;
        left: 0;
        height: 5px;
        /* background: #ddd; */
        /* box-shadow: rgba(0, 0, 0, 0.4) 0px 16px 32px; */
        width: 100%;
    }

    .processbar>.progress {
        height: 5px;
        /* transition: width 1s linear; */
        background: #0005;
    }

    .player>.relativeRow {
        width: 100%;
        height: 100%;
    }

    .relativeRow {
        position: relative;
    }

    .alPicTure {
        height: 58px;
        aspect-ratio: 1 / 1;
        left: 0px;
        position: absolute;
    }

    .alPicTure>.relativeRow {
        aspect-ratio: 1 / 1;
        height: inherit;
    }

    .alPicTure img {
        /* border-radius: 1%; */
        border-radius: 1%;
        height: inherit;
        z-index: -1;
        -webkit-user-drag: none;
    }
    .alPicTure img.view {
        border: #0001 solid 1px;
    
    }

    .alPicTure img.blur {
        position: absolute;
        z-index: -1;

        filter: blur(1.5vmin) saturate(200%)
    }
    
    .alPicTure img.highQualityView {
        position: absolute;
        z-index: 2;
        /* filter: blur(2vmin) */
        border: #0001 solid 1px;
        display: none;
        transition: display 0 0s;

     }
     /*
     img.highQualityView{
        display: block;
        transition: display 0 0.3s;
    } */

    .hiddenControlBar {
        display: block;
        position: absolute;
        right: 0px;
        /* top: 20px; */
        height: 60px;
        width: calc(100% - 60px);
        z-index: 2;
    }

    .hiddenControlBar .info {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        height: 60px;
    }

    .flexRow {
        display: flex;
        padding-left: 16px;
    }

    .hiddenControlBar h1.title {
        margin: 0;
        font-size: 19px;
    }

    .hiddenControlBar h2.artist {
        margin: 0;
        font-size: 16px;
        color: #000b;

    }

    .hiddenControlBar .bottoms {
        position: relative;
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 28px;
        margin-right: 20px;
        justify-content: center;
        color: #000d;
        height: 60px;
        gap: 20px;
    }

    .hiddenControlBar .bottoms .notice {
        font-size: 40px;
    }

    .hiddenControlBar .bottoms>* {
        position: relative;

    }

    div.musicControls>button:hover::after,
    .hiddenControlBar .bottoms>*:hover::after {
        position: absolute;
        background-color: #0001;
        width: 100%;
        border-radius: 50%;
        /* height: 100%; */
        aspect-ratio: 1/1;
        left: 0;
        top: 50%;
        transform: translate(0, -50%) scale(1.3);
        content: "";
    }

    .menu {
        display: grid;
        width: 100%;
        height: 100%;
        position: relative;
        grid-template-rows: [drag-area] minmax(30px, 1fr) [thumb] auto [cover] auto [music-info] 3fr 1fr;
        grid-template-columns: [info-side] .75fr [player-side] 1fr;
        gap: 8px;
        transition: .5s ease-in-out;
        left: 0%;
        z-index: 0
    }
    .lyricRow {
        grid-column: player-side;
        grid-row: drag-area;
    }    
    .coverImage {
        color: rgb(255, 255, 255);
        aspect-ratio: 1/1;
        grid-column: info-side;
        grid-row: cover;
        align-self: center;
        justify-self: center;
        width: min(50vh, 40vw);
        height: min(50vh, 40vw);
        background-position: center;
        background-size: cover;
        border-radius: 1%;
        overflow: hidden;
        background-image: url("");
        image-rendering: auto;
        transition: background-image 0.5s linear 0s, box-shadow 0.5s ease 0s, transform 0.5s cubic-bezier(0.3, 0.2, 0.2, 1.4) 0s;
    }

    .musicInfo {
        display: flex;
        grid-row: music-info;
        width: min(50vh, 40vw);
        flex-direction: column;
        margin: 1em auto;
        font-size: min(2.5vh, 2vw);
        color: #000e
    }

    .musicInfo .musicname,
    .musicInfo .moreButtom {
        font-size: 1.2em;
        font-weight: 700;

    }
    .musicInfo .musicname{
        display: flex;
        /* align-items: center; */
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    }
    .musicInfo .artists {
        color: #0009;
        font-weight: 700;overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    }

    .musicControls {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    button {
        border: 0;
        position: relative;
        background: none;
        aspect-ratio: 1/1;

    }

    button>*:hover::after {
        position: absolute;
        background-color: #0001;
        width: 100%;
        border-radius: 50%;
        /* height: 100%; */
        aspect-ratio: 1/1;
        left: 0;
        top: 50%;
        transform: translate(0, -50%) scale(1.3);
        content: "";
    }

    .slider {
        margin: 1em 0 0.6em 0;
        height: 0.6em;
        border-radius: 0.4em;
        background-color: #0001;
        transition: 0.2s;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 16px;
        overflow:hidden
    }

    .slider .inner{
        height:inherit;
        background-color: #000a;
    }

    .progressControl:hover>.slider {
        margin: 0.8em 0 0.4em 0;
        height: 1em;
        border-radius: 1em;
    }

    .progressTips {
        display: flex;
        color: #0008;
        font-weight: 900;
        font-size: 10px;
        flex-direction: row;
        justify-content: space-between
    }
</style>