import fs from "fs";
import Jimp = require("jimp");
import axios from "axios";
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
        await axios({
          method: 'get',
          url: inputURL,
          responseType: 'arraybuffer'
          }).then(function({data: imageBuffer}){
              Jimp.read(imageBuffer).then(photo =>{
                const outpath =
                "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
                photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(__dirname + outpath, (img) => {
                  resolve(__dirname + outpath);
                });
            })
        })
        } catch (error) {
          reject(error);
          }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

// validateIfUrlPointsToAnImage
// helper function to validate if the imageURL indeed points to an image
// INPUTS
//    imageUrl: the image URL that needs to be validated
export function validateIfUrlPointsToAnImage(imageUrl: String) {
  return(imageUrl.match(/\.(jpeg|jpg|gif|png)$/) != null);
}
