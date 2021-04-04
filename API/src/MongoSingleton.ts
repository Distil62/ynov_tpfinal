import { Db, FilterQuery, InsertOneWriteOpResult, MongoClient, UpdateQuery, ObjectID } from "mongodb";
import { MONGO_DB, MONGO_URI } from '../constantes'

class MongoSingleton {
    public static _instance : MongoSingleton;

    public connectionString = MONGO_URI; 
    public client = new MongoClient(this.connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
    //@ts-ignore
    public db: Db;

    private constructor() { }

    public async connectMongo() {
        this.client = await this.client.connect();
        this.db = this.client.db(MONGO_DB);
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new MongoSingleton();
        }
        return this._instance;
    }

    async insert<T extends { _id: any }>(collectionName: string, data: object): Promise<InsertOneWriteOpResult<T>> {
        if (!this.db) await this.connectMongo();
        return this.db.collection(collectionName).insertOne(data);
    }

    async fetchAll<T>(collectionName: string): Promise<T[]> {
        if (!this.db) await this.connectMongo();
        const cursor = this.db.collection<T>(collectionName).find();
        return await cursor.toArray()
    }

    async get<T>(collectionName: string, filter: FilterQuery<T>): Promise<T> {
        if (!this.db) await this.connectMongo();
        return this.db.collection(collectionName).findOne(filter)
    }

    async getById<T>(collectionName: string, id: string): Promise<T> {
        if (!this.db) await this.connectMongo();

        const o_id = new ObjectID(id);
        return this.db.collection(collectionName).findOne({'_id': o_id});
    } 

    async update<T>(collectionName: string, filter: FilterQuery<T>, data: UpdateQuery<T>) {
        if (!this.db) await this.connectMongo();
        return this.db.collection(collectionName).updateOne(filter, data, {upsert: true});
    }
    
}

export default MongoSingleton.getInstance();