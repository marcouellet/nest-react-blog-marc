import React from 'react';
import { ImageData } from '../../types';

interface ImageProps {
  imageData: ImageData;
  onError?: (error: any) => void;
}

const Image = (props: ImageProps) => {

  return  (
    <img 
      src={ `data:${props.imageData.contentType};base64,` + props.imageData.base64}
      alt="not found" 
      onError={(error) => {
        props.onError && props.onError(error);
      }}
    />
  );
}

export default Image;