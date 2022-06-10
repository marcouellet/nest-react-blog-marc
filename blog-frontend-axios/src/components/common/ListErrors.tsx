import React from 'react';
import { IErrors } from '../../types';

const ListErrors = ({ errors }: { errors: IErrors }) => {
  return (
    <ul className="error-messages">
      {Object.entries(errors).map(([key, keyError], index) =>  
        (
          <li key={index}>
            {key} {keyError}
          </li>
        )
      )}
    </ul>
    
  );
}

export default ListErrors;