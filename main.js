const path = require('path')

// 加载vite
const { createServer } = require('vite')
var loadURL = 'http://localhost:18775/'
// require('vite').build()
var loadVite= async()=>{

  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: path.join(__dirname, 'vite.config.js'),
    root: __dirname,
  })
  
  server.listen().then(()=>{
    server.printUrls()
  })
}
// 加载NeteaseCloudMusicAPI
const NeteaseCloudMusicApi = require('./app.js')

NeteaseCloudMusicApi.start()
    
loadVite()

