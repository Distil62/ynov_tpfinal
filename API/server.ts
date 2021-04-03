import express, { json, Response, Request} from 'express';
import router from './router';

function main() {
    const port = 3000;
    const app = express();

    app.use("/api", router());
    app.use(json());

    app.get('/', (request: Request, response: Response) => {
        response.sendFile(__dirname + '/index.html')
    });

    app.listen(port, () => {
        console.log("The server is lisent on http://localhost:" + port);
    });

    return 0;
}


main();