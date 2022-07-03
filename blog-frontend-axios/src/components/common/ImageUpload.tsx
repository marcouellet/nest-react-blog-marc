import React from 'react';
import { ImageData, ImageSizeProps } from '../../types';
import { getImageFromFile, resizeImageData } from '../../utils/image.utils';
export interface ImageUploadProps {
    resize: ImageSizeProps,
    onImageUpload: (imageData: ImageData) => void;
    onImageUploadError: (error: any) => void;
}

const ImageUpload = (props: ImageUploadProps) => {

     const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];

            const imageUploaded = (imageData: ImageData) => {
                if (props.resize) {
                    resizeImageData(imageData, props.resize.maxWidth, props.resize.maxHeight) 
                        .then(imageData => {
                            props.onImageUpload(imageData);
                        }); 
                } else {
                    props.onImageUpload(imageData);
                }
            }

            const imageUploadFailed = (error: any) => {
                    props.onImageUploadError(error);
            }

            getImageFromFile(img, imageUploaded, imageUploadFailed);
         }
    };

    return (
            <input 
                className="col-md-3" 
                type="file" 
                id="imageFile" 
                name='imageFile' 
                accept=".jpeg, .png, .jpg"  
                onChange={onImageChange}
            />
    )
}

export default ImageUpload;
