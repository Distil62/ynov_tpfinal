import { Db, FilterQuery, InsertOneWriteOpResult, MongoClient, UpdateQuery } from "mongodb";
import { MONGO_DB, MONGO_URI } from '../constantes'

class MongoSingleton {
    public static _instance: MongoSingleton;

    public connectionString = MONGO_URI;
    public client = new MongoClient(this.connectionString, { useUnifiedTopology: true })
    //@ts-ignore
    public db: Db;

    private constructor() { }

    public connectMongo() {
        return new Promise((resolve, reject) => {
            console.log("## A ##");
            MongoClient.connect(this.connectionString, { useUnifiedTopology: true, useNewUrlParser: true }, (err, cli) => {
                if (err) {
                    console.error("MONGO CONNECT ERR");
                    console.error(err);
                    return reject(err);
                }
                console.log("## B ##");

                this.client = cli;
                this.db = this.client.db(MONGO_DB);
                console.log("## C ##");
                resolve(true);

            });
        });
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

    async get<T>(collectionName: string, filter: FilterQuery<T>): Promise<T> {
        if (!this.db) await this.connectMongo();
        return this.db.collection(collectionName).findOne(filter)
    }

    async update<T>(collectionName: string, filter: FilterQuery<T>, data: UpdateQuery<T>) {
        if (!this.db) await this.connectMongo();
        return this.db.collection(collectionName).updateOne(filter, data, { upsert: true });
    }

}

export default MongoSingleton.getInstance();