import { MongoClient } from "mongodb";

class MongoSingleton {
    public static _instance : MongoSingleton;

    public connectionString = "mongodb+srv://dbuser:dbuser@cluster0.pwegt.mongodb.net/AdminBddProject?retryWrites=true&w=majority" 
    public client = new MongoClient(this.connectionString)
    public db = this.client.db("AdminBddProject");

    private constructor() { }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new MongoSingleton();
        }
        return this._instance;
    }

    async insert(collectionName: string, data: object) {
        return this.db.collection(collectionName).insertOne(data);
    }

    async get(collectionName: string, filter: object): Promise<object> {
        return this.db.collection(collectionName).findOne(filter)
    }

    async update(collectionName: string, filter: object, data: object) {
        return this.db.collection(collectionName).updateOne(filter, data);
    }
    
}

export default MongoSingleton.getInstance();