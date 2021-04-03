import { readFile } from 'fs';
import { VideoUploadOption } from '../types/Video';
import KafkaSingleton from './KafkaSingleton';

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

                const fileContent = new Uint8Array(data);

                // couper le contenu en plusieurs petit morceaux. Défini la taille d'un chunck.
                // CF : https://gitlab.com/dimimpov/streaming-video-apache-kafka/-/blob/master/kafka/producer.js
                // ligne 30
                await KafkaSingleton.publish({
                    data: fileContent,
                    topic: "video",
                    parition: options.tempName
                });

                // Créer l'entrée dans Mongo

                // Supprimer le fichier temporaire dans l'API.

                resolve(true);
            });

        });
    }
}