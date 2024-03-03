import app from '../App.vue'
import reTools from './network/getData'

export default {
    downloadTrack:(track)=>{
        app.download = {
            ...app.download,
            ...track
        }
    },
    stop:()=>{

    },
    work:()=>{
        
    }
}