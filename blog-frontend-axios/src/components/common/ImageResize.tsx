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
        const resize = async (): Promise<void> => {
            resizeImage(props.imageData, props.resize.maxWidth, props.resize.maxHeight)
                .then(imageData => setImage(imageData));
          }
        resize();  
      // eslint-disable-next-line
      }, []);
    
    return (
        <>
        { image && <Image imageData={image}/> }
        </>
    )
}

export default ImageResize;
