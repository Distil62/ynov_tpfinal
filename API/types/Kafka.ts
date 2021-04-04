import { Consumer, Producer } from "kafka-node";

export interface KafkaProducers {
    [topic: string]: Producer
}

export interface KafkaConsummers {
    [topic: string]: Consumer
}

export interface KafkaListenOption {
    topic: string;
    groupId?: string;
}

export interface KafkaPublishOption {
    topic: string;
    data: any;
    groupId?: string;
    partition?: number;
    key?: string;
}