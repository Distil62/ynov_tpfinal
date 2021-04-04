import { readFile, unlinkSync } from 'fs';
import { VideoUploadOption } from '../types/Video';
import KafkaSingleton from './KafkaSingleton';
import { VIDEO_TOPIC_NAME } from '../constantes';

export default class VideoController {
    async fetchAll() {

    }

    async fetch() {

    }

    upload(options: VideoUploadOption) {
        return new Promise(async (resolve, reject) => {
            readFile(options.filePath, async (err, data) => {
                if (err) {
                    return reject(err);
                }

                const fileContent = data;

                // couper le contenu en plusieurs petit morceaux. Défini la taille d'un chunck.
                // CF : https://gitlab.com/dimimpov/streaming-video-apache-kafka/-/blob/master/kafka/producer.js
                // ligne 30

                const mimeType = options.originalName.split(".")[1];

                let index = 0;
                for (let i = 0, j = data.length; i < j; i += KafkaSingleton.chunkSize) {
                    const dataPart = fileContent.slice(i, i + KafkaSingleton.chunkSize);
                    await KafkaSingleton.publish({
                        data: dataPart,
                        topic: VIDEO_TOPIC_NAME,
                        partition: index,
                        key: options.tempName + "." + mimeType
                    });
                    index++;
                }

                // Créer l'entrée dans Mongo

                // Supprimer le fichier temporaire dans l'API.

                unlinkSync(options.filePath);
                return resolve(true);
            });

        });
    }
}