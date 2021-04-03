import { Router, Request, Response } from 'express';

export default function videoRouter() {
    const router = Router();

    router.get("/", (request: Request, response: Response) => {
        return response.send("Hello, world !");
    });

    return router;
}
