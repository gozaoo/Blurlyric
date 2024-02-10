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
            describe: Text
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
            <slot></slot>
        </div>
        <div class="title">{{ title }}</div>

    </div>
</template>
<style scoped>
    .box{
        min-width: 120px;
        min-height: 120px;
        width: fit-content;
        position: relative;
        /* padding: 10px; */
        /* align-items: flex-end; */
        box-shadow: 0 0 0.3vmin #0001;
        overflow: hidden;
        border-radius: 5px;
        border: #0001 solid 1px;
        transition: 0.3s;
        user-select: none;
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
    .title{
        margin: 0.1em 1em 0.4em 0.4em;
        font-size: 1.4em;
        color: #fff;
        text-shadow: 0 0 1.5vmin #0005;

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