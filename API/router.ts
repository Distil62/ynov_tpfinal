import { Router } from 'express';

import videoRouter from './videoRouter';
import userRouter from './userRouter';

export default function router() {
    const router = Router();

    router.use("/video", videoRouter());
    router.use("/user", userRouter());

    return router;
}
