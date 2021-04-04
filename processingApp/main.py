from KafkaSingleton import KafkaSingleton
import json
from collections import Counter
import os 

def main():
    video_consummer = KafkaSingleton().listen("video")
    message_counter = Counter()

    for message in video_consummer:
        json_message = json.loads(str(bytes(message.value).decode("utf-8")))
        jpg_data = bytearray(json_message["data"])
        target_file_name = str(bytes(message.key).decode("utf-8"))
        message_counter[target_file_name] += 1

        # Attention ! Provoque des gros lag sur des gros messages.
        # print(message)

        print(target_file_name + " : " + str(message_counter[target_file_name]))

        file_path = "./img/" + target_file_name

        if not os.path.exists(file_path):
            with open(file_path, 'w'): pass


        with open(file_path, "ab") as f:
            f.write(jpg_data)
            f.close()



if __name__ == "__main__":
    print("Application started.")
    main()