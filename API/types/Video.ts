export interface VideoBase {
    name: string;
    views: number;
    owner: string;
    hdfs_id: string;
}

export interface VideoBaseInsertResult extends VideoBase {
    _id: any;
}

export interface VideoUploadOption {
    tempName: string;
    filePath: string;
    originalName: string;
    owner: string;
}