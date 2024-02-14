<script >
    import "bootstrap-icons/font/bootstrap-icons.css";

        export default {
        data() {
            return {
            }
        },
        methods: {},
        beforeDestroyed: () => {
        },
        props: {
            imageSrc: Text,
            title: Text,
            describe: Text,
            activeType: Text,
            titleStyle: Text

        },
        watch: {
            lyricText: {
                handler: async function (newVal) {
                },
                deep: true
            }
        },
        created() {

        }
    }
</script>
<template>
    <div class="box">
        <img class="background" :src="imageSrc" alt="" srcset="">
        <div class="icon">
            <slot name="headicon"></slot>
        </div>
        <div :style="{
            fontSize: (titleStyle=='small')?'1.1em':undefined
        }" class="title">{{ title }}</div>
        <div class="describe">
           <slot name="describe"></slot>
        </div>
    <div class="activeIcon">
            <i v-if="activeType=='router'||activeType==undefined" class="bi bi-caret-right-square-fill"></i>
        </div>
    </div>
</template>
<style scoped>
    .box{
        min-width: 120px;
        min-height: 120px;
        height: 120px;
        width: fit-content;
        max-width: 150px;
        position: relative;
        /* padding: 10px; */
        /* align-items: flex-end; */
        box-shadow: 0 0 0.3vmin #0001;
        overflow: hidden;
        border-radius: 5px;
        border: #0001 solid 1px;
        transition: 0.3s;
        user-select: none;
        padding-right: 20px;
        box-sizing: border-box;
    }
    .box:hover{
        transform: translateY(-3px);
        box-shadow: 0 .2vmin 1vmin #0003;
        border: #0004 solid 1px;
    }

    .background{
        position: absolute;

        min-width: 120%;
        width: 100%;
        height: 100%;
        min-height: 120%;
        top: -10%;
        left: -10%;
        z-index: -1;
        filter: blur(1.5vmin) brightness(.9);
        object-fit: cover;
    }
    .activeIcon{
        position: absolute;
        right: 10px;
        bottom: 10px;
        color: #fffd;
    }
    .title{
        margin: 0.1em 1em 0.4em 0.4em;
        font-size: 1.4em;
        color: #fff;
        text-shadow: 0 0 1.5vmin #0005;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .describe{
        margin: 0.1em 0 0.4em 0.4em;
        font-size: 0.8em;
        box-shadow: 0 0 1.5vmin #0001;
        background-color: #00000009;
        width: fit-content;
        display: -webkit-box;
        color: #fff6;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;

    }
    .icon{
        color: white;
        text-shadow: 0 0 1.5vmin #0005;
        /* position: absolute; */
        margin: 10px 6px 0 10px;
        top: 0.4em;
        left: 0.4em;
        font-size: 1em;

    }
</style>