import React from 'react';
import { ImageData } from '../../types';

export interface ImageUploadProps {
    onImageUpload: (imageData: ImageData) => void;
}

const ImageUpload = (props: ImageUploadProps) => {

    const getBase64 = (file: File) => {
        return new Promise<ArrayBuffer>((resolve,reject) => {
           const reader = new FileReader();
           reader.onload = () => resolve(reader.result as ArrayBuffer);
           reader.onerror = error => reject(error);
           reader.readAsArrayBuffer(file);
        });
    }

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            getBase64(img).then(data => {
                const imageData: ImageData = { data: Buffer.from(data), contentType: img.type};
                props.onImageUpload(imageData);
            });
        }
    };

    return (
            <input className="col-md-3" type="file" id="imageFile" name='imageFile' accept="image/png, image/jpeg" 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onImageChange(e)} />
    )

}

export default ImageUpload;
