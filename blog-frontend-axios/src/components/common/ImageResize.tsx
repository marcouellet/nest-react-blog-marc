import React, { useState, useEffect } from 'react';
import { ImageData, ImageSizeProps } from '../../types';
import { resizeImage } from '../../utils/image.utils';
import Image from '../common/Image';

export interface ImageResizeProps {
    imageData: ImageData,
    resize: ImageSizeProps,
}

const ImageResize = (props: ImageResizeProps) => {

    const [image, setImage] = useState<ImageData>(); 

    useEffect(() => {
        const propImage: ImageData = {...props.imageData};
        
        if (propImage) {
            resizeImage(propImage, props.resize.maxWidth, props.resize.maxHeight)
            .then(imageData => { 
                setImage(imageData); 
            })
            .catch(error => {
                throw new Error(error);
            }); 
        }
      // eslint-disable-next-line
      }, []);

    const handleOnError = (error: any) => {
        throw new Error(error);
    }
    
    return ( 
        <>
            {image && <Image imageData={image} onError={handleOnError}/> }         
       </>
    ) 
}

export default ImageResize;
