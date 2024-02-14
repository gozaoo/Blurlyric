<template>

  <div style="margin-bottom:60px;flex-direction: column;display:flex"
    v-if="!app.data.user.account || app.data.user.profile == undefined">
    <h2 style="margin:0;padding: 0px;">您当前还未登录</h2>
    <p>登录体验更佳。当然，您也可以先体验一下</p>
    <div class="linkbox bigger">

      <a @click="app.data.ui.loginElement = 'display'">点击我去登录</a>
    </div>
  </div>

  <div v-if="app.data.user.account && app.data.user.profile" class="topBlock">
    <div class="topBlockPicture">
      <img height="100%" v-bind:src="app.data.user.profile.avatarUrl" alt="" srcset="">
    </div>
    <div class="topBlockText">
      <h2>{{app.data.user.profile.nickname}}</h2>
      <h1>的音乐库</h1>

    </div>
    <div class="topBlockRightButtom">
      <div class="linkbox bigger">
        <a style="user-select:none" @click="loginOut()"><svg xmlns="http://www.w3.org/2000/svg" style="height: 1.25em"
            fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
            <path fill-rule="evenodd"
              d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
          </svg>退出登录</a>
      </div>
    </div>

  </div>
  <div></div>
  <div class="muLib-MainBox">
    <!--我喜欢的Block-->
    <!-- <div v-if="app.data.user.account && app.data.user.profile"
      style=";
;background-color:#5080ff;overflow:hidden; ">
      <p style="user-select:none ;position: relative;box-shadow: rgb(80 128 255) 0px 9px 14px 7px;z-index: 5;">我喜欢的
      </p>

    </div> -->
    <card_wide v-if="app.data.myMusicList[0]"
      @click="this.$router.push({name:'detail',query:{id:app.data.myMusicList[0].id }})"
      :imageSrc="app.data.myMusicList[0].coverImgUrl+'?param=16y16'" :title="'喜欢的音乐'">
      <template v-slot:headicon>
      
      <i class="bi bi-box2-heart-fill"></i>
      </template>
    </card_wide>
    <card_wide v-if="app.data.recommendSongs[0]" @click="this.$router.push({name:'dailySongs'})"
      :imageSrc="app.data.recommendSongs[0].al.picUrl+'?param=16y16'" :title="'每日推荐'">
      <template v-slot:headicon>
      <i class="bi bi-box2-fill"></i>
      </template>
    </card_wide>
    <card_wide v-if="app.data.musicListInfor.personalFM.tracks[app.data.musicListInfor.personalFM.trackNum]"
      @click="app.usePersonalFM()"
      :imageSrc="app.data.musicListInfor.personalFM.tracks[app.data.musicListInfor.personalFM.trackNum].al.picUrl+'?param=16y16'"
      :title="'私人电台'">
      <template v-slot:headicon>
      <i class="bi bi-broadcast"></i></template>
    </card_wide>

  </div>
  <br>
  <div class="linkbox">
    <span style="font-size:1.6em">收藏夹</span>
    <a :class="(sublistDisplayType=='musiclist')?'active':''" @click="sublistDisplayType='musiclist'">歌单</a>
    <a  :class="(sublistDisplayType=='albumlist')?'active':''" @click="sublistDisplayType='albumlist'">专辑</a>
  </div>
 
  <div v-if="sublistDisplayType=='musiclist'&&app.data.myMusicList[0] != undefined">
    <div class="muLib-MainBox">

      <card_wide v-for="(item,i) in app.data.myMusicList" :key="item.id" :title-style="'small'"
        @click="this.$router.push({name:'detail',query:{id:item.id }})" :imageSrc="item.coverImgUrl + '?param=16y16'"
        :activeType="'router'"
        :title="item.name">
        <template v-slot:headicon>
            <i class="bi bi-music-note-list"></i>
        </template>
        <template v-slot:describe>
          <i class="bi bi-archive-fill"></i><span> {{ ' '+item.trackCount+' ' }} </span>
          <i class="bi bi-ear-fill"></i><span> {{' '+ (item.playCount/10000).toFixed(1) }}w</span>
        </template>
      </card_wide>
    </div>
  </div>

  <div v-if="sublistDisplayType=='albumlist'&&app.data.albumSublist[0] != undefined">
    <div class="muLib-MainBox">

      <card_wide v-for="(item,i) in app.data.albumSublist" :key="item.id" :title-style="'small'"
        @click="this.$router.push({name:'album',query:{id:item.id }})" :imageSrc="item.picUrl + '?param=16y16'"
        :activeType="'router'"
        :title="item.name">
        <template v-slot:headicon>
          <i class="bi bi-disc-fill"></i>
        </template>
        <template v-slot:describe>
          by <span v-for="(artist,index2) in item.artists">{{ artist.name }}<span v-if="index2<item.artists.length-1">&</span></span>
        </template>
      </card_wide>
    </div>
  </div>
</template>
<script>
  import cookies from 'js-cookie'
  import reTools from '../network/getData'
  import message from '../js/message.js'
  import app from '../main.js'
  import card_wide from '../components/card-wide.vue'
  export default {
    name: 'muLib',
    data() {
      return {
        app,
        sublistDisplayType: 'musiclist'
      }
    },

    watch: {
      data: function (val) {
        this.data = val
      }
    },
    components: {
      card_wide
    },
    methods: {
      loginOut() {
        reTools.getData('/logout', {})
        document.cookie = ''
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);

        if (keys) {

          for (var i = keys.length; i--;)

            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()

        }
        location.reload()
      },
      removePl(id, i) {
        if (i == 0) {
          message.create('不可以删除 我喜欢的 歌单')
          return
        }
        reTools.getData('/playlist/subscribe', {
          id: id,
          t: 2
        })
        message.create('已删除 ' + app.data.myMusicList[i].name + ' 歌单\n')

        app.data.myMusicList.splice(i, 1)

      }
    },
  }
</script>
<style scoped>
  /* 

    顶部头像方块

*/
  .topBlock {
    display: flex;
    height: 6em;
    padding: 10px 0;
    gap: 15px;
  }

  .topBlockPicture {
    height: 6em;
  }

  .topBlockPicture>img {
    height: 6em;
    border-radius: 50%;

  }

  .topBlockRightButtom {
    display: flex;
    text-align: right;
    margin-inline-start: auto;
  }

  .topBlockText>* {
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }

  .topBlockText h2 {
    margin: .5em 0 0 0;
    font-size: 1.6em;
  }

  .topBlockText h1 {
    margin: 0em 0;
    font-size: 2.3em;

  }

  @media (max-width:750px) {
    .topBlock {
      display: flex;
      height: 5em;
      padding: 5px 0;
      gap: 8px;
    }

    .topBlockPicture {
      height: 5em;
    }

    .topBlockPicture>img {
      height: 5em;
      border-radius: 50%;

    }

    .topBlockText h2 {
      margin: 5px 0;
      font-size: 1.3em;
    }

    .topBlockText h1 {
      margin: 13px 0;
      font-size: 1.8em;

    }
  }

  @media (max-width:500px) {
    .topBlock {
      display: flex;
      height: 4em;
      padding: 3px 0;
      gap: 5px;

    }

    .topBlockPicture>img {
      height: 4em;

    }

    .topBlockPicture {
      height: 4em;
    }



    .topBlockText h2 {
      margin: 5px 0;
      font-size: 1em;

    }

    .topBlockText h1 {
      margin: 7px 0;
      font-size: 1.4em;

    }

    .linkbox.bigger>a {
      font-weight: bold;
      font-size: 14px;
      color: #2c3e50;
      text-decoration: none;
      padding: 6px 8px;
    }
  }

  /* 

    END：顶部头像方块
    start：中部模块
*/
  .muLib-MainBox {
    padding: 10px 0;
    height: max-content;
    display: flex;
    gap: 2.5vmin;
    flex-wrap: wrap;
  }

  /* 
  .muLib-MainBox>div {
    position: relative;
    font-size: 28px;
    border-radius: 1.2em;
    color: white;
    padding: 20px 30px;
    height: calc(8vh + 5vw);
    width: max-content;
    min-width: min-content;
  } */

  .muLib-MainBox>div>p {
    margin: 5px 0;
  }

  @media (max-width: 450px) {
    .muLib-MainBox>div {
      font-size: 24px;
    }
  }

  @media (max-width: 550px) {
    .muLib-MainBox>div>p {
      font-size: 20px;


    }
  }
</style>