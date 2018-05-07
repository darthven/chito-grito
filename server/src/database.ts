import { MongoClient, MongoError, Db,
    InsertOneWriteOpResult, InsertWriteOpResult, Collection, Cursor, MongoCallback, ObjectId } from 'mongodb';
import * as assert from 'assert';
   
interface Model {
    _id: string;
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

    public connect(callback: Function, collectionNames: string[]): void {
        MongoClient.connect(this.connectionUrl, (err: MongoError, client: MongoClient) => {
            assert.equal(null, err);
            this.client = client;
            this.initDatabase(this.client, collectionNames);
            console.log('Connected successfully to database server'); 
            callback();
        });
    }

    public close(): Promise<void> {
        return this.cleanup()
            .then(() => this.client.close())
            .then(() => console.log('Connection to database was closed'))
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

    public getDocumentById<T extends Model>(docId: string,
            collection: Collection<T>, callback: MongoCallback<T | null>): void {
        collection.findOne({_id: new ObjectId(docId)}, callback);
    }
    
    public insertDocument<T extends Model>(entity: T, collection: Collection<T>,
            client: MongoClient): void {
        collection.insertOne(entity, (err, result) => {
            console.log('Inserted: ', result.insertedId);
        })
    }

    public updateDocument<T extends Model>(id: string, entity: T, collection: Collection<T>,
            client: MongoClient): void {
        collection.findOneAndUpdate({_id: new ObjectId(id)}, { $set: entity }, { upsert: true }, (err, result) => {
            console.log('Updated: ', result.ok);
        })
    }

    public deleteDocument<T extends Model>(id: string, collection: Collection<T>,
            client: MongoClient): void {
        collection.findOneAndDelete({_id: new ObjectId(id)}, (err, result) => {
            console.log('Removed: ', result.ok);
        })
    }

    protected cleanup(): Promise<void> {
        return this.dbInstance.collections().then((colls) => {
            this.collections.forEach((col) => col.drop(() => {
                console.log(`Collection "${col.collectionName}" was dropped`);
            }));
        })
    }

    private initDatabase(client: MongoClient, collectionNames: string[]): void {
        this.dbInstance = this.client.db(this.databaseName);
        collectionNames.forEach((name) => {
            this.createCollection(name, this.dbInstance)
        })
    }
}