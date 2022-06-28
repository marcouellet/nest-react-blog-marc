import { ImageData } from '../types';

export function resizeImage(imageData:ImageData, maxWidth:number, maxHeight:number): Promise<ImageData> {

    return new Promise<ImageData>((resolve, reject) => {

        let image = new Image();
        image.src = 'data:' + imageData.contentType.trim() + ';base64,' + imageData.base64;
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
                        const base64 = Buffer.from(array).toString('base64');
                        const newImageData : ImageData = {base64: base64, contentType: imageData.contentType.trim() };
                        resolve(newImageData);
                    });
            });
        };
        image.onerror = reject;
    });
}
