import { Consumer, KafkaClient, Message, Producer, ProduceRequest } from 'kafka-node';
import { KafkaProducers, KafkaConsummers, KafkaListenOption, KafkaPublishOption } from '../types/Kafka'

class KafkaSingleton {
    public static _instance : KafkaSingleton;

    public boostrapUrl = "localhost:9092";
    public client = new KafkaClient({
        kafkaHost: this.boostrapUrl,
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

    public listen(options: KafkaListenOption, callback: (message: Message) => void) {
        if (!Object.keys(this.consummers).includes(options.topic)) {
            this.consummers[options.topic] = new Consumer(this.client, [
                {
                    topic: options.topic, 
                    partition: 0
                }
            ],
            {
                autoCommit: false,
                groupId: options.groupId
            });
        }

        this.consummers[options.topic].addListener("message", callback);
    }

    public publish(options: KafkaPublishOption) {
        return new Promise((resolve, reject) => {
            if (!Object.keys(this.producers).includes(options.topic)) {
                this.producers[options.topic] = new Producer(this.client);
            }
    
            const message: ProduceRequest = {
                messages: JSON.stringify(options.data),
                topic: options.topic,
                
            };

            this.producers[options.topic].send([message], (error, data) => {
                if (error) return reject(error);

                return resolve(data);
            });
        });
        
    }
}

export default KafkaSingleton.getInstance();