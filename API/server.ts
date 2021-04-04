import express, { json, Response} from 'express';
import router from './router';

import MongoSingleton from './src/MongoSingleton';

async function main() {

    await MongoSingleton.connectMongo();
    const port = 3000;
    const app = express();

    app.use("/api", router());
    app.use(json());

    app.get('/', (_, response: Response) => {
        response.sendFile(__dirname + '/index.html')
    });

    app.listen(port, () => {
        console.log("The server is listen on http://localhost:" + port);
    });

    return 0;
}


main();