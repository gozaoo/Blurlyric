
<script>
        export default {
        data() {
            return {
            }
        },
        props: {
            src: Text,
        }}
</script>
<template>
    <div class="relativeRow">

        <img class="blur" :src="src + '?param=32y32'" alt="" srcset="">
        <img ref="highQualityView" class="highQualityView" :src="src + '?param=1024y1024'">

    </div>
</template>
<style  scoped>
    
    .relativeRow{
        position: relative;
    }
    .relativeRow img.blur {
        position: absolute;
        z-index: -1;
        filter: blur(1vmin) saturate(200%)
    }
    
     .relativeRow img {
        border-radius: 1%;
        height: inherit;
        z-index: -1;
        -webkit-user-drag: none;
    }
    .relativeRow img.highQualityView {
        border: #0001 solid 1px;
        z-index: 999;
     }

</style>