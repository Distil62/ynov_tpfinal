from KafkaSingleton import KafkaSingleton
import json
from collections import Counter
import os
from HDFSService import HDFSSErvice

import contextlib


def main():
    arr = bytearray()
    upload_consummer = KafkaSingleton().listen("video")
    message_counter = Counter()
    hdfs_service = HDFSSErvice()

    for message in upload_consummer:
        json_message = json.loads(str(bytes(message.value).decode("utf-8")))
        jpg_data = bytearray(json_message["data"])
        target_file_name = str(bytes(message.key).decode("utf-8"))
        message_counter[target_file_name] += 1

        file_path = "/" + target_file_name

        print(file_path + " : " + str(message_counter[target_file_name]))

        hdfs_service.append(file_path, jpg_data)


def hdfs_stream():
    streaming_consummer = KafkaSingleton().listen("streaming-request")
    hdfs_service = HDFSSErvice()

    for message in streaming_consummer:
        try:
            target_file_name = str(bytes(message.key).decode("utf-8"))
            content_generator = hdfs_service.get("/" + target_file_name)
            number_of_message_for_file = hdfs_service.get_messages_number("/" + target_file_name)

            print("number of message preview : " + str(number_of_message_for_file))

            nb_msg = 0
            for data in content_generator:
                KafkaSingleton().publish("streaming", data, key=target_file_name + "-" + str(number_of_message_for_file), message_number=number_of_message_for_file)
                nb_msg += 1
            
            print("number of message senden " + str(nb_msg))
        except e:
            print("## ERROR ##")
            pass


def test():
    hdfs_service = HDFSSErvice()
    file_gen = hdfs_service.get("/aae06ff93adbbe0246f4fc1ba4939fb1.mp4")

    with open("result.mp4", "ab+") as f:
        for data in file_gen:
            f.write(data)
        f.close()
    print("end")



if __name__ == "__main__":
    print("Application started.")
    main()
    # hdfs_stream()

