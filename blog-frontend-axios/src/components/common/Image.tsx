import React from 'react';
import { ImageData } from '../../types';

interface ImageProps {
  imageData: ImageData;
  onError?: () => void;
}

const Image = (props: ImageProps) => {

  const base64 = Buffer.from(props.imageData.data.valueOf()).toString('base64');

  return  (
    <img 
      src={ `data:${props.imageData.contentType};base64,` + base64} 
      onError={() => {
        props.onError && props.onError();
      }}
    />
  );
}

export default Image;