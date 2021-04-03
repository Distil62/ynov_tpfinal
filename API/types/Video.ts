export interface VideoBase {
    name: string;
    views: number;
}

export interface VideoUploadOption {
    tempName: string;
    filePath: string;
    originalName: string;
}