import * as cors from 'cors'

import { ExpressBasedServer } from "./server";
import { MongoDatabase } from "./database";

export class ChitoGritoServer extends ExpressBasedServer {

    private readonly collectionNames: string[] = ['users'];

    public database: MongoDatabase;

    constructor(host: string, port: number,
                staticDirectory: string, database: MongoDatabase) {
        super(host, port, staticDirectory);
        this.database = database;
    }

    public listen(): void {
        this.database.connect(() => { 
            this.expressInstance.use(cors());
            super.listen();
        }, this.collectionNames);
    }
}