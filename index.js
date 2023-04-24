const yt = require('ytdl-core');
const yts = require('yt-search');
const express = require('express');
const app = express();  
const cors = require('cors');
const bodyParser = require('body-parser');
const server = async () => {
    // Modulos
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // Función de Busqueda

    const searchYT = async (search) => {
        const data = []
        const r = await yts( search )
        const videos = r.videos.slice( 0, 12 )
        videos.forEach( function ( v ) {
            // const views = String( v.views ).padStart( 10, ' ' )
            // console.log( `${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name } | ${ v.url} | ${ v.thumbnail}`  )
            const views = String(v.views).padStart(10, ' ');
            const videoData = {
              views: views,
              title: v.title,
              timestamp: v.timestamp,
              author: v.author.name,
              url: v.url,
              thumbnail: v.thumbnail
            };
            data.push(videoData);
        })
        return data
    }

    const searchRouter = express.Router();
    searchRouter.post('/search', async (req, res) => {
        const search = req.body.search.toLowerCase()
        const videos = await searchYT(search)
        const jsonData = JSON.stringify(videos)
        res.json(jsonData)
    })
    
    app.use('', searchRouter)

    const videoSearch = async (video) => {
        await yt.getBasicInfo(video).then( async (Info) => {
        let videos = []
        Info.formats.forEach( async (format) => {
            if (format.mimeType.includes("video/mp4")){
                await videos.push({format})
            }}
        )
        let videoSend = await videos[0].format.url
        console.log(videoSend)

        return videoSend
        }).catch((err) => {
            console.log(err)
        })
    }


    const videoYT = express.Router();
    videoYT.post('/video', async (req, res) => {
        const video = req.body.video
        await yt.getBasicInfo(video).then( async (Info) => {
            let videos = []
            Info.formats.forEach( async (format) => {
                if (format.mimeType.includes("video/mp4")){
                    await videos.push({format})
                }}
            )
            let videoSend = await videos[0].format.url
            res.send(videoSend)
            }).catch((err) => {
                console.log(err)
                res.send('Error')
            })
    })
    app.use('', videoYT)
    app.use((req, res, next) => {
        res.status(404).send('404 Not Found');
    })
    
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    })
}
server()

// const video = yt("https://youtube.com/watch?v=S1m7Lz7zmc8", { quality : 'highestvideo'})
// video.on('info', (info) => {
//     console.log(info)
// })



// yt.getBasicInfo("https://youtube.com/watch?v=S1m7Lz7zmc8").then((Info) => {
//     let videos = []
//     console.log(Info.formats.forEach(format => {
//         if (format.mimeType.includes("video/mp4")){
//             videos.push({format})
//         }}))
//     console.log(videos[0].format.url)
// }).catch((err) => {
//     console.log(err)
// })
