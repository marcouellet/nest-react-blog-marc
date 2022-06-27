import React from 'react';
import { ImageData } from '../../types';

export interface ImageUploadProps {
    onImageUpload: (imageData: ImageData) => void;
}

const ImageUpload = (props: ImageUploadProps) => {

    const getArrayBuffer = (file: File) => {
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
            getArrayBuffer(img).then(data => {
                const buffer =  Buffer.from(data);
                const imageData: ImageData = { data: buffer, contentType: img.type};
                props.onImageUpload(imageData);
            });
        }
    };

    return (
            <input className="col-md-3" type="file" id="imageFile" name='imageFile' accept=".jpeg, .png, .jpg"  
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onImageChange(e)} />
    )

}

export default ImageUpload;
