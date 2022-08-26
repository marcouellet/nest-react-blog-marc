import React from 'react';

import { ImageData } from '@Types';

interface ImageProps {
  imageData: ImageData;
  className?: string;
  onError?: (error: any) => void;
}

export const Image = (props: ImageProps) => {

  const handleError = (error: any) => {
    props.onError && props.onError(error);
  }

  return  (
    <img 
      className={props.className}
      src={`data:${props.imageData.contentType};base64,` + props.imageData.base64}
      alt="not found" 
      onError={handleError}
    />
  );
}
