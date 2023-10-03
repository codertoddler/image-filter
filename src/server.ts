import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateIfUrlPointsToAnImage} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}} end point
  // endpoint to filter an image from a public url.
  // IT 
  //    1. Validates the image_url if it actually points to an image
  //    2. Filters the image
  //    3. Sends the resulting file in the response
  //    4. Deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file

  /**************************************************************************** */

  app.get( "/filteredimage/", async ( req, res ) => {
    
    let { image_url } = req.query;
    if(validateIfUrlPointsToAnImage(image_url)){
      var imagePath: string;
      var error: Error;
      filterImageFromURL(image_url)
          .then(filteredImagePath => 
              res.status(200)
                 .sendFile(filteredImagePath, error => {
                    if (error) {
                      console.log(error);
                      res.status(500)
                         .send(`An error occured while tranferring the filtered image`);;
                    }
                    deleteLocalFiles([filteredImagePath]);
                  }))
          .catch(error => 
              res.status(500)
                 .send(`Internal error occured while filtering the image`));
    }
    else{
      return res.status(400)
                .send(`Invalid image URL passed:${image_url}`)
    }
   
  } );
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();