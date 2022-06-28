import React from 'react';
import { ImageData } from '../../types';

interface ImageProps {
  imageData: ImageData;
  onError?: () => void;
}

const Image = (props: ImageProps) => {

  return  (
    <img 
      src={ `data:${props.imageData.contentType};base64,` + props.imageData.base64} 
      onError={() => {
        props.onError && props.onError();
      }}
    />
  );
}

export default Image;