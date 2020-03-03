import express, { Express, Router } from 'express';

export class Server {
    app: Express;
    port: number;

    constructor(router: Router, port?: number) {
        this.app = express();
        this.app.use(router);
        this.port = port || 3000;
    }

    start() {
        this.app.listen(this.port, () => console.log(`App listening on port ${this.port}!`))
    }
}
