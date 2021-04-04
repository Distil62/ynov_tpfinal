import { Router, Request, Response } from 'express';
import multer from 'multer';
import VideoController from './src/VideoController';

export default function videoRouter() {
    const router = Router();
    const upload = multer({dest: "upload/"});
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

    return router;
}
