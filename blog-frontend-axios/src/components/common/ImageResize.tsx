import React, { useState, useEffect } from 'react';

import { ImageSizeProps } from '@Types';
import { resizeImageData } from '@Utils';
import { Image } from '@Common';
import { ImageData } from "@blog-common/interfaces";

export interface ImageResizeProps {
    imageData: ImageData,
    resize: ImageSizeProps,
    className?: string;
}

export const ImageResize = (props: ImageResizeProps) => {

    const [image, setImage] = useState<ImageData | undefined>(undefined); 

    useEffect(() => {
        const propImage: ImageData = {...props.imageData};
        
        if (propImage) {
            resizeImageData(propImage, props.resize.maxWidth, props.resize.maxHeight)
            .then(imageData => { 
                setImage(imageData); 
            })
            .catch(error => {
                throw new Error(error);
            }); 
        }
      // eslint-disable-next-line
      }, [props.imageData]);

    const handleOnError = (error: any) => {
        throw new Error(error);
    }
    
    return ( 
        <>
            {image && <Image imageData={image} onError={handleOnError} className={props.className}/>}         
       </>
    ) 
}

