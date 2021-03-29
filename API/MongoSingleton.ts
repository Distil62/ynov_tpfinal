import MongoClient from "mongodb/lib/mongo_client";


class MongoSingleton {
    public static _instance : MongoSingleton;

    public connectionString = "mongodb+srv://dbuser:dbuser@cluster0.pwegt.mongodb.net/AdminBddProject?retryWrites=true&w=majority" 
    public client = new MongoClient(this.connectionString)

    private constructor() { }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new MongoSingleton();
        }
        return this._instance;
    }

    insert(collectionName: string, data: object) {

    }

    get(collectionName: string, filter: object) {

    }

    update(collectionName: string, filter: object, data: object) {

    }
    
}