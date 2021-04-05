import { readFile, unlinkSync, createWriteStream, createReadStream, ReadStream } from 'fs';
import { VideoBase, VideoBaseInsertResult, VideoStreamingOption, VideoUploadOption } from '../types/Video';
import KafkaSingleton from './KafkaSingleton';
import MongoSingleton from './MongoSingleton';
import { VIDEO_TOPIC_NAME, MONGO_COLLECTION_VIDEO, STREAMING_TOPIC_NAME, STREAMING_REQUEST_TOPIC_NAME } from '../constantes';
// import { v4 } from 'uuid';


export default class VideoController {
    async fetchAll() {
        return await MongoSingleton.fetchAll<VideoBase>(MONGO_COLLECTION_VIDEO);
    }

    async fetch(id: string) {
        return await MongoSingleton.getById<VideoBase>(MONGO_COLLECTION_VIDEO, id);
    }

    upload(options: VideoUploadOption) {
        return new Promise(async (resolve, reject) => {
            readFile(options.filePath, async (err, data) => {
                try {
                    if (err) {
                        return reject(err);
                    }

                    const fileContent = data;
                    const mimeType = options.originalName.split(".")[1];

                    for (let i = 0, j = data.length; i <= j; i += KafkaSingleton.chunkSize) {
                        const dataPart = fileContent.slice(i, i + KafkaSingleton.chunkSize);
                        await KafkaSingleton.publish({
                            data: dataPart,
                            topic: VIDEO_TOPIC_NAME,
                            partition: 0,
                            key: options.tempName + "." + mimeType
                        });
                    }


                    const dataToInsert: VideoBase = {
                        name: options.originalName,
                        owner: options.owner,
                        views: 0,
                        hdfs_id: options.tempName
                    }

                    // Créer l'entrée dans Mongo
                    await MongoSingleton.insert<VideoBaseInsertResult>(MONGO_COLLECTION_VIDEO, dataToInsert);

                    unlinkSync(options.filePath);
                    return resolve(true);
                } catch (e) {
                    console.log('e ==>', e);
                    return reject(e);
                }
            });

        });
    }

    streamVideo(options: VideoStreamingOption) {
        return new Promise<ReadStream>((resolve, reject) => {
            let messageCount = 0;
            let writeStream = createWriteStream("tmp/" + options.hdfsFileName, {
                encoding: "binary"
            });
            KafkaSingleton.listen({topic: STREAMING_TOPIC_NAME}, (message) => {
                const keyAndMessageNumber = (message.key as Buffer).toString("utf8");
                const parsedKey = keyAndMessageNumber.split("-");
                const key = parsedKey[0];
                const messageNumbers = parseInt(parsedKey[1]);

                console.log('message key ==>', key);
                
                if (key === options.hdfsFileName) {
                    messageCount++;
                    console.log('messageCount ==>', messageCount);
                    console.log('messageNumbers ==>', messageNumbers);
                    try {
                        writeStream.write(message.value);
                        resolve(createReadStream("tmp/" + options.hdfsFileName, {encoding: 'binary'}));
                        console.log("...")
                        if (messageCount === messageNumbers) {
                            console.log("Write of : " + options.hdfsFileName + " is end");
                            return writeStream.end();
                        }
                    } catch (e){
                        console.log("ERROR ECRITURE");
                        console.log(e)
                    }


                }
            });
    
            KafkaSingleton.publish({
                data: 0,
                topic: STREAMING_REQUEST_TOPIC_NAME,
                key: options.hdfsFileName,
                partition: 0
            });

            // setTimeout(() => {
            //     return reject(new Error("Time out"));
            // }, 5 * 1000)

        });
        
    }
}