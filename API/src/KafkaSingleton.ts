import { Consumer, KafkaClient, Message, Producer, ProduceRequest } from 'kafka-node';
import { KafkaProducers, KafkaConsummers, KafkaListenOption, KafkaPublishOption } from '../types/Kafka'
import { KAFKA_BOOTSTRAP_URL } from "../constantes";

class KafkaSingleton {
    public static _instance: KafkaSingleton;

    public boostrapUrl = KAFKA_BOOTSTRAP_URL;
    public client = new KafkaClient({
        kafkaHost: this.boostrapUrl,
    });
    public producers: KafkaProducers = {}
    public consummers: KafkaConsummers = {}
    public chunkSize = 100000; // Size of a message part in bytes. By default is 1Mb

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
                }
            ],
                {
                    groupId: options.groupId,
                    encoding: "buffer"
                });
        }

        (this.consummers[options.topic] as Consumer).addListener("message", callback);

    }

    public publish(options: KafkaPublishOption) {
        return new Promise((resolve, reject) => {
            if (!Object.keys(this.producers).includes(options.topic)) {
                this.producers[options.topic] = new Producer(this.client);
            }

            const message: ProduceRequest = {
                messages: JSON.stringify(options.data),
                topic: options.topic,
                key: options.key,
                partition: options.partition
            };

            this.producers[options.topic].send([message], (error, data) => {
                if (error) return reject(error);

                return resolve(data);
            });
        });

    }
}

export default KafkaSingleton.getInstance();