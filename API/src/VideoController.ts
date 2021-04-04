import { readFile, unlinkSync } from 'fs';
import { VideoBase, VideoBaseInsertResult, VideoUploadOption } from '../types/Video';
import KafkaSingleton from './KafkaSingleton';
import MongoSingleton from './MongoSingleton';
import { VIDEO_TOPIC_NAME, MONGO_COLLECTION_VIDEO } from '../constantes';

export default class VideoController {
    async fetchAll() {

    }

    async fetch() {

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

                    // Envoyer les données dans KAFKA
                    let index = 0;
                    for (let i = 0, j = data.length; i < j; i += KafkaSingleton.chunkSize) {
                        const dataPart = fileContent.slice(i, i + KafkaSingleton.chunkSize);
                        await KafkaSingleton.publish({
                            data: dataPart,
                            topic: VIDEO_TOPIC_NAME,
                            partition: index % 2 == 0 ? 0 : 1,
                            key: options.tempName + "." + mimeType
                        });
                        index++;
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
}