import React from 'react';
import { ImageData, ImageSizeProps } from '../../types';
import { resizeImage } from '../../utils/image.utils';
export interface ImageUploadProps {
    resize: ImageSizeProps,
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

    const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];

            getArrayBuffer(img).then(data => {
                let imageData: ImageData = { base64: Buffer.from(data).toString('base64'), contentType: img.type };
                if (props.resize) {
                    resizeImage(imageData, props.resize.maxWidth, props.resize.maxHeight) 
                        .then(imageData => {
                            props.onImageUpload(imageData);
                        }); 
                } else {
                    props.onImageUpload(imageData);
                }
            });
        }
    };

    return (
            <input className="col-md-3" type="file" id="imageFile" name='imageFile' accept=".jpeg, .png, .jpg"  
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onImageChange(e)} />
    )

}

export default ImageUpload;
