import { Router, Request, Response } from 'express';
import multer from 'multer';
import VideoController from './src/VideoController';

export default function videoRouter() {
    const router = Router();
    const upload = multer({dest: "upload/"});
    const videoController = new VideoController();


    router.get("/fetchAll", (request: Request, response: Response) => {
        return response.send("Hello, world !");
    });

    router.get("/fetch", (request: Request, response: Response) => {
        return response.send("Hello, world !");
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
