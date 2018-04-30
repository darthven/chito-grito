import { MongoClient, MongoError, Db,
    InsertOneWriteOpResult, InsertWriteOpResult, Collection, Cursor } from 'mongodb';
import * as assert from 'assert';
   
interface Model {
    _id?: string;
}

export class MongoDatabase {   

    private connectionUrl: string;
    private databaseName: string;
    private collections: Map<string, Collection>;
    
    public client!: MongoClient;
    public dbInstance!: Db;

    constructor(connectionUrl: string, databaseName: string) {
        this.connectionUrl = connectionUrl;
        this.databaseName = databaseName;
        this.collections = new Map<string, Collection>();
    }

    private closeConnection(): Promise<void> {
        return new Promise(() => Array.from(this.collections.keys()).forEach((name) => {
            this.dbInstance.dropCollection(name)
        })).then(() => this.client.close());  
    }

    public connect(callback: Function, collectionNames: string[]): void {
        MongoClient.connect(this.connectionUrl, (err: MongoError, client: MongoClient) => {
            assert.equal(null, err);
            this.client = client;
            this.initDatabase(this.client, collectionNames);
            console.log('Connected successfully to database server'); 
            process.on('SIGINT', () => {  
                this.closeConnection();    
            });      
            process.on('SIGTERM', () => {  
                this.closeConnection();    
            });     
            callback();
        });
    }
    
    public createCollection(collectionName: string, db: Db): void {
        this.collections.set(collectionName, db.collection(collectionName));
    }

    public getCollection<T extends Model>(collectionName: string): Collection<T> {
        return <Collection<T>> this.collections.get(collectionName);
    }

    public getAllDocuments<T extends Model>(collection: Collection<T>): Cursor<T> {
        return collection.find({});
    }

    public getDocumentById<T extends Model>(docId: string, collection: Collection<T>): Promise<T> {
        return <Promise<T>> collection.findOne({_id: docId});
    }
    
    public insertDocument<T extends Model>(entity: T, collection: Collection<T>,
            client: MongoClient): void {
        collection.insertOne(entity, (err, result) => {
            console.log('Inserted: ', result);
        })
    }

    public updateDocument<T extends Model>(entity: T, collection: Collection<T>,
            client: MongoClient): void {
        collection.findOneAndUpdate({_id: entity._id}, entity, (err, result) => {
            console.log('Updated: ', result);
        })
    }

    public deleteDocument<T extends Model>(entity: T, collection: Collection<T>, client: MongoClient): void {
        collection.deleteOne({_id: entity._id}, (err, result) => {
            console.log('Removed: ', result);
        })
    }

    private initDatabase(client: MongoClient, collectionNames: string[]): void {
        this.dbInstance = this.client.db(this.databaseName);
        collectionNames.forEach((name) => {
            this.createCollection(name, this.dbInstance)
        })
    }
}