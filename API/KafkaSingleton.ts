import { Consumer, KafkaClient, Message, Producer, ProduceRequest } from 'kafka-node';
import { KafkaProducers, KafkaConsummers } from './types/Kafka'

class KafkaSingleton {
    public static _instance : KafkaSingleton;

    public boostrapUrl = "localhost:9092";
    public client = new KafkaClient({
        kafkaHost: this.boostrapUrl
    });
    public producers: KafkaProducers = {}
    public consummers: KafkaConsummers = {}

    private constructor() { }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new KafkaSingleton();
        }
        return this._instance;
    }

    public listen(topic: string, callback: (message: Message) => void) {
        if (!Object.keys(this.consummers).includes(topic)) {
            this.consummers[topic] = new Consumer(this.client, [
                {
                    topic, partition: 0
                }
            ],
            {
                autoCommit: false
            });
        }

        this.consummers[topic].addListener("message", callback);
    }

    public publish(topic: string, data: object) {
        return new Promise((resolve, reject) => {
            if (!Object.keys(this.producers).includes(topic)) {
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

export default KafkaSingleton.getInstance();