import { Consumer, Producer } from "kafka-node";

export interface KafkaProducers {
    [topic: string]: Producer
}

export interface KafkaConsummers {
    [topic: string]: Consumer
}