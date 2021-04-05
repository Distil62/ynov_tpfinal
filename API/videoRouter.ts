import { Router, Request, Response } from 'express';
import multer from 'multer';
import VideoController from './src/VideoController';
import { createReadStream } from 'fs'

export default function videoRouter() {
    const router = Router();
    const upload = multer({ dest: "upload/" });
    const videoController = new VideoController();


    router.get("/fetchAll", async (_, response: Response) => {
        try {
            const videos = await videoController.fetchAll();

            return response.status(200).json(videos);
        } catch (e) {
            return response.status(500).send(e.message);

        }
    });

    router.get("/fetch", async (request: Request, response: Response) => {
        try {
            const videoId = request.query.id as string;

            const selectedVideo = await videoController.fetch(videoId);

            if (!selectedVideo) {
                return response.status(404).send(videoId + " not found");
            }

            return response.status(200).json(selectedVideo);
        } catch (e) {
            return response.status(500).send(e.message);

        }
    });

    router.post("/upload", upload.single("video"), async (request: Request, response: Response) => {
        try {
            await videoController.upload({
                filePath: request.file.path,
                originalName: request.file.originalname,
                tempName: request.file.filename,
                owner: "Jean-coucou"
            });

            console.log(request.file.originalname + " send !");

            return response.redirect("/");
        } catch (e) {
            return response.status(500).send(e.message);
        }
    });

    router.get("/streaming", async (request: Request, repsonse: Response) => {
        //acc84adfb858f46ba594b8b8bcbc2ac4.mp4
        const hdfsPath = request.query.hdfs as string;
        const readStream = videoController.streamVideo({ hdfsFileName: hdfsPath });

        setTimeout(() => {
            createReadStream("tmp/" + hdfsPath, { encoding: 'binary' })
            // //@ts-ignore
            // const range = request.header.range as string;
            // const parts = range.replace('bytes=', '').split('-');
            // const start = parseInt(parts[0])

            repsonse.set("Content-Range", `bytes 0-`);
            repsonse.set('Accept-Ranges', `bytes`)
            repsonse.status(206).send(readStream);
        }, 3000)


    });

    return router;
}
