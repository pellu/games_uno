/*
import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { FIREBASE_CONFIG } from '../../pages/firebase';
import { AlertProvider } from './alert.provider';
*/

import { Injectable } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera';

import * as $ from "jquery";

import { Models } from '../models/models';

@Injectable()
export class CameraProvider {

  constructor(
    /*private db: AngularFireDatabase,
    private platform : Platform,
    private alert : AlertProvider
    */
    private camera: Camera, 
    private models : Models  
  ) {}
  
  getPicture(sourceType, uid, packNumber) {
    return new Promise(resolve => {
      
      const options: CameraOptions = {
        quality: 10,
        sourceType: sourceType,
        allowEdit: true,
        targetHeight: 100,
        targetWidth: 100,
        destinationType: 0,
        encodingType: 1,
        mediaType: this.camera.MediaType.PICTURE,
      }
    
      this.camera.getPicture(options).then((imageDataURL) => {
       
        this.models.b64toBlob(imageDataURL, false, false).then(blob => {
         
          if (uid) {
            const address = '/images/' + uid
            this.models.fbStorageUpload(address, blob, true).then(url => {
              resolve(url)
            })
          } else {
            resolve(blob)
          } 
        })
      }).catch(err => {
        throw err
      })
    })      
  }
  
  readURL(_file, str) {
    const hw = 270
    let reader = new FileReader();
    reader.onload = function (e:Event) {
      $(str)
        .attr('src', reader.result)
        .width(hw)
        .height(hw);
    };
    reader.readAsDataURL(_file);
  }
}
