import { KafkaClient, Producer, ProduceRequest } from 'kafka-node';
import { KafkaProducers } from './types/Kafka'

class KafkaSingleton {
    public static _instance : KafkaSingleton;

    public boostrapUrl = "localhost:9092";
    public client = new KafkaClient({
        kafkaHost: this.boostrapUrl
    });
    public producers: KafkaProducers = {}

    private constructor() { }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new KafkaSingleton();
        }
        return this._instance;
    }

    public listen() {

    }

    public publish(topic: string, data: object) {
        return new Promise((resolve, reject) => {
            if (Object.keys(this.producers)) {
                this.producers[topic] = new Producer(this.client);
            }
    
            const message: ProduceRequest = {
                messages: JSON.stringify(data),
                topic
            };

            this.producers[topic].send([message], (error, data) => {
                if (error) return reject(error);

                return resolve(data);
            });
        });
        
    }
}