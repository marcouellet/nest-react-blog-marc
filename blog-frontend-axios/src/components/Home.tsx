import React, { useState, useEffect } from 'react';
import { ImageSizeProps, ImageData } from '../types';
import ImageResize from './common/ImageResize';
import { resizeImage } from '../utils/image.utils';

const Home = () => {

  const [homeDefaultImage, sethomeDefaultImage] = useState<ImageData>();

  useEffect(() => {
    if (!homeDefaultImage) {
      const fetchData = async (): Promise<void> => {
        getDefaultHomeImage()
        .then(imageData => { 
          sethomeDefaultImage(imageData);
        }) 
        .catch(error => {
          throw new Error(error);
        });
      }
      fetchData();  
    }
  // eslint-disable-next-line
  }, []);

  const getDefaultHomeImage = (): Promise<ImageData> => {
    return resizeImage('/default-home-image.jpg', 'image/jpg', imageMaxSize.maxWidth, imageMaxSize.maxHeight);
  }

  const imageMaxSize: ImageSizeProps = {maxWidth:500, maxHeight:500}

  return (  
    <div className="Home"> 
      <div className="container-fluid">
        <div className="row">
            <div className="col-md-4">
              { homeDefaultImage && <ImageResize imageData={homeDefaultImage} resize={imageMaxSize}/>}
            </div>
            <div className="col-md-7">
              <h2>
                Welcome to Marc's Blog
              </h2>
              <br/>            
              <h4>
               This simple blog application is build on most recent technology. The server is based on NestJs which has a Angular like architecture. MongoDB is used to store data. Web UI has been developped with React using the most recent techniques.
              </h4>
              <br/>
              <h4>
               Functionalities:
              </h4>  
              <br/>
              <h5>
                <ul>
                  <li>Multi users</li>
                  <li>Post Categories</li>
                  <li>Filter for posts list on post title</li>
                  <li>Filter for users list on user name</li>
                  <li>User and post pictures</li>
                  <li>User profile update</li>
                </ul>
              </h5>
              <br/>
              <h4>
               List of technologies used:
              </h4>  
              <br/>
              <h5>
                <div>Server: NestJs, typescript, mongoose, passport, guards, dtos, generic data repositories, jest for unit and integration tests</div>
                <div>Client: React, hooks, axios, dtos, jwt, bootstrap, typescript</div>
              </h5>
              <h4>
              <br/>
               Play with the application
              </h4>  
              <br/>
              <h5>
                <div>To test the site, you can login with user as "admin@email.com" and password as "password"</div>
              </h5>
            </div>
          </div> 
        </div>
      </div>  
  );  
}

export default Home;
