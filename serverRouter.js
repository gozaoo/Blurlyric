const express = require('express');
const router = express.Router()
const axios = require('axios')
const user = require('./blurlyric/user');
const match = require('@unblockneteasemusic/server');
const fs = require("fs")
const path = require("path")
const fetchModulePromise = import('node-fetch');
const NodeID3 = require('node-id3')
router.get('/createUser', (req, res) => {

    user.createUser((data) => {
        jsonTool('200', data, req, res)
        return
    })

})

router.get('/unblockmusic', async (req, res) => {
    //,['kugou','migu','kuwo']
    // res.json({})
    match(req.query.id, ['kugou', 'kuwo', 'migu']).then(text => {
        // console.log(text);
        res.json(text)
    })
})

router.get('/getUser', (req, res) => {
    if (!req.query.id) {
        jsonTool('200', {
            "msg": '请填入ID',
        }, req, res)
        return
    }

    user.getUser(req.query.id, (data) => {
        jsonTool(200, data, req, res)
    })
})

router.get('/writeUser', (req, res) => {
    console.log(req.query)
    if (!req.query.id || !req.query.res) {
        jsonTool('405', null, req, res)
        return
    }
    let dataSize = strSize(req.query.res.toString())
    if (strSize(dataSize, 'utf8') > 20000000) {
        jsonTool('405', {
            msg: '文件过大 (>20mb)'
        }, req, res)
        return
    }
    user.upsetConfig(req.query, (data) => {
        jsonTool('200', data, req, res)
    })
})

router.post('/writeUserPlaylist', (req, res) => {

    console.log(req);
    jsonTool('200', req, '', res)

    // user.upsetPlaylist(req.query,(data)=>{
    //     jsonTool('200',data,req,res)
    // })
})

function jsonTool(code, data, req, res) {
    res.json({
        "code": code || 200,
        "date": new Date(),
        "data": '' || data,
        "ip": '' || req.ip
    })
}

function strSize(str, charset) {
    let total = 0;
    charset = charset?.toLowerCase() || '';
    for (i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);
        if (charset === 'utf-16' || charset === 'utf16') {
            total += charCode <= 0xffff ? 2 : 4;
        } else {
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
    }
    return total;
}

async function getFileByUrl(url, fileName, tags) {
    console.log(`[${downloadTrack.now + 1}/${downloadTrack.list.length}] 请求下载 ${fileName}`);
    const fetchModule = await fetchModulePromise;
    const fetch = fetchModule.default;
    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    }).then(res => res.arrayBuffer()).then(buffer => {
        let filePath = path.join(__dirname, './blurlyric/download/', fileName);
        fs.writeFile(filePath, Buffer.from(buffer), 'binary', function (err) {
            downloadTrack.freeThread++;
            downloadTrack.try();
            if (err) {
                console.log(`[${downloadTrack.now + 1}/${downloadTrack.list.length}] 下载失败 ${fileName}`);
            } else {
                console.log(`[${downloadTrack.now + 1}/${downloadTrack.list.length}] 完成下载 ${fileName}`);
                // 在写入文件成功后，再写入 ID3 标签
                console.log(tags);
                NodeID3.write( tags,filePath,function(err) {
                    if (err) {
                        console.error('Error writing ID3 tags:', err);
                    } else {
                        console.log('ID3 tags written successfully');
                    }
                });
            }
        });
    }).catch((error) => {
        downloadTrack.freeThread++;
        downloadTrack.try();
        console.error(`[${downloadTrack.now + 1}/${downloadTrack.list.length}] 下载出错 ${fileName}:`, error);
    });
}

async function editorMusicTag(file, tags){
    NodeID3.write(tags,file)
}
var downloadTrack = {
    list: [],
    now: 0,
    maxThread: 8,
    freeThread: 8,
    async try () {
        if (this.list.length > this.now) {
            getFileByUrl(this.list[this.now].url,this.list[this.now].fileName,this.list[this.now].ids)
            this.freeThread--
            this.now++
        }
        if (this.freeThread != 0 && this.list.length - this.now > 1) {
            this.try()
        }
    }
}


router.get('/downloadUrl', (req, res) => {
    console.log(req.query)
    if (!req.query.url || !req.query.fileName) {
        jsonTool('405', null, req, res)
        return
    }
    console.log({
        url: req.query.url,
        fileName: req.query.fileName
    });
    downloadTrack.list.push({
        url: req.query.url,
        fileName: req.query.fileName,
        ids: JSON.parse(req.query.ids)
    })
    downloadTrack.try()
})
module.exports = router