from KafkaSingleton import KafkaSingleton
import json

def main():
    video_consummer = KafkaSingleton().listen("video")

    for message in video_consummer:
        json_message = json.loads(str(bytes(message.value).decode("utf-8")))
        jpg_data = bytearray(json_message["data"])
        target_file_name = str(bytes(message.key).decode("utf-8"))
        current_index = str(bytes(message.index).decode("utf-8"))

        # Des gros lag sur des gros messages.
        # print(message)

        print(target_file_name + " : " +current_index)

        with open("./img/" + target_file_name, "ab") as f:
            f.write(jpg_data)
            f.close()



if __name__ == "__main__":
    main()