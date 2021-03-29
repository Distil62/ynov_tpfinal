import { Producer } from "kafka-node";

export interface KafkaProducers {
    [topic: string]: Producer
}