import React from 'react';
import { ImageData } from '../../types';

interface ImageProps {
  imageData: ImageData;
  onError?: () => void;
}

const Image = (props: ImageProps) => {

  return  (
    <img 
      src={ `data:${props.imageData.contentType};base64,` + props.imageData.data} 
      onError={() => {
        props.onError && props.onError();
      }}
    />
  );
}

export default Image;