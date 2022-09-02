import { ImageData } from "shared/interfaces";

const getArrayBuffer = (file: File) => {
    return new Promise<ArrayBuffer>((resolve,reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result as ArrayBuffer);
       reader.onerror = error => reject(error);
       reader.readAsArrayBuffer(file);
    });
}

export type GetImageCallback = (imageData: ImageData) => void;
export type GetImageErrorCallback = (error: any) => void;

export function getImageFromFile(file: File, callback: GetImageCallback, errorHandler: GetImageErrorCallback) {

    getArrayBuffer(file).then(data => {
        const imageData: ImageData = { base64: Buffer.from(data).toString('base64'), contentType: file.type };
        callback(imageData);
    })
    .catch((error) => errorHandler(error));
}

export function readImageFileAsImageData(filePath: string, maxWidth:number, maxHeight:number): Promise<ImageData> {

    return new Promise<ImageData>((resolve,reject) => {

        let image = new Image();
        image.src = filePath;
        image.onload = () => {
    
            let canvas = document.createElement('canvas');
            canvas.width =image.width;
            canvas.height = image.height;
    
            let context = canvas.getContext('2d');
    
            context!.drawImage(image, 0, 0);
            canvas.toBlob(blob => {
                blob?.arrayBuffer()
                    .then((array) => {
                        const base64 = Buffer.from(array).toString('base64');
                        const newImageData : ImageData = {base64: base64, contentType: 'base64'};
                        resolve(newImageData);
                    });
            });
        };
        image.onerror = reject;      
    });  
 }

 export function resizeImageData(imageData:ImageData, maxWidth:number, maxHeight:number): Promise<ImageData> {
    const imageSrc = 'data:' + imageData.contentType.trim() + ';base64,' + imageData.base64;
    return resizeImage(imageSrc, imageData.contentType, maxWidth, maxHeight);
 }

export function resizeImage(imagePath:string, contentType: string, maxWidth:number, maxHeight:number): Promise<ImageData> {

    return new Promise<ImageData>((resolve, reject) => {

        let image = new Image();
        image.src = imagePath;
        image.onload = () => {
            let width = image.width;
            let height = image.height;
   
            let newWidth;
            let newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            let canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            let context = canvas.getContext('2d');

            context!.drawImage(image, 0, 0, newWidth, newHeight);

            canvas.toBlob(blob => {
                blob?.arrayBuffer()
                    .then((array) => {
                        const base64 = Buffer.from(array).toString('base64');
                        const newImageData : ImageData = {base64: base64, contentType: contentType.trim() };
                        resolve(newImageData);
                    });
            });
        };
        image.onerror = reject;
    });
}
