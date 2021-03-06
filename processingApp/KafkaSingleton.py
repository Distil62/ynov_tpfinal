from kafka import KafkaConsumer, KafkaProducer
from typing import Optional
import logging

class Singleton(type):
    _instance: Optional[type] = None

    def __call__(self) -> type:
        if self._instance is None:
            self._instance = super().__call__()
        return self._instance

class KafkaSingleton(metaclass=Singleton):

    bootstrap_server = "localhost:9092"

    topics_consume = dict()
    topics_produce = dict()

    def listen(self, topic: str) -> KafkaConsumer:
        if topic not in self.topics_consume.keys():
            self.topics_consume[topic] = KafkaConsumer(topic, group_id="video_grp")

        return self.topics_consume[topic]

    def publish(self, topic: str, data: bytes, key: str = None, message_number: int = None):
        if topic not in self.topics_produce.keys():
            self.topics_produce[topic] = KafkaProducer(bootstrap_servers=self.bootstrap_server)
        
        return self.topics_produce[topic].send(topic, data, key=bytes(key, encoding="utf-8"), partition=0)