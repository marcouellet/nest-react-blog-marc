import { ImageData } from '../types';

export function resizeImage(imageData:ImageData, maxWidth:number, maxHeight:number): Promise<ImageData> {

    return new Promise<ImageData>((resolve, reject) => {
        const base64 = Buffer.from(imageData.data.valueOf()).toString('base64');
        const imageContentType = imageData.contentType.trim();
        const imageSrc =  'data:' + imageContentType + ';base64,' + base64
        let image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            let width = image.width;
            let height = image.height;
            
            if (width <= maxWidth && height <= maxHeight) {
                resolve(imageData);
            }

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
                        const buffer = Buffer.from(array);
                        const newImageData : ImageData = {data: buffer, contentType: imageContentType };
                        resolve(newImageData);
                    });
            });
        };
        image.onerror = reject;
    });
}
