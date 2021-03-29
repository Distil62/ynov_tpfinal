from kafka import KafkaConsumer, KafkaProducer

class KafkaSingleton:
    __instance = None
    bootstrap_server = "localhost:9092"

    topics_consume = dict()
    topics_produce = dict()

    @staticmethod
    def getInstance():
        if KafkaSingleton.__instance == None
            KafkaSingleton.__instance = KafkaSingleton
        return KafkaSingleton.__instance

    def __init__(self):
        if KafkaSingleton.__instance != None:

    def listen(self, topic) -> KafkaConsumer:
        if topic not in self.topics_consume.keys:
            self.topics_consume[topic] = KafkaConsumer(topic)
        return self.topics_consume[topic]


    def publish(self, topic, data):
        if topic not in self.topics_produce.keys:
            self.topics_produce[topic] = KafkaProducer(bootstrap_servers=bootstrap_server)
        
        self.topics_produce[topic].send(topic, data)