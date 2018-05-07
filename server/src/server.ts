import * as e from 'express';
import * as assert from 'assert';
import * as http from 'http';
import * as path from 'path';
import * as bodyParser from 'body-parser';

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put', 
    DELETE = 'delete'
}

export type HttpRequest = {
    method: HttpMethod,
    url: string
}

export class ExpressBasedServer {

    protected host: string;
    protected port: number;
    protected expressInstance: e.Express;
    protected router: e.Router;
    protected restMapping: Map<HttpRequest, e.RequestHandler>;
    protected staticDirectory: string;
    protected serverInstance!: http.Server;

    constructor(host: string, port: number, staticDirectory: string) {
        this.host = host;
        this.port = port;       
        this.staticDirectory = staticDirectory;
        this.router = e.Router();
        this.restMapping = new Map<HttpRequest, e.RequestHandler>();
        this.expressInstance = e();
        this.expressInstance.set('port', this.port);
        this.expressInstance.use(bodyParser.json())
        this.expressInstance.use(e.static(path.join(__dirname, this.staticDirectory)));
        this.expressInstance.use(this.router);
    }

    public setRestMappping(restMapping: Map<HttpRequest, e.RequestHandler>) {
        this.restMapping = restMapping;
    }

    public listen(): void {
        this.serverInstance = http.createServer(this.expressInstance);
        this.restMapping.forEach((callback, request) => {
            this.expressInstance[request.method](request.url, callback)
        })
        this.serverInstance.listen(this.port, 
            () => console.log(`Running on http://${this.host}:${this.port}`));
    }

    protected stop(callback: Function): void {
        this.serverInstance && this.serverInstance.close(callback);
    }
}
