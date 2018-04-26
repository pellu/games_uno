import { Injectable } from '@angular/core';
/*import { AlertProvider } from '../alert/alert'*/

import { LoadingController } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class Models {

  constructor(
    /*private alert: AlertProvider,*/ 
    private afs: AngularFireStorage,
    private db: AngularFireDatabase,
    private loadingCtrl : LoadingController) {
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    return new Promise((resolve, reject) => {
      contentType = contentType || 'image/png';
      sliceSize = sliceSize || 512;
      let byteCharacters = atob(b64Data);

      let byteArrays = [];

      for (let offset = 0, l = byteCharacters.length; offset < l; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0, len = slice.length; i < len; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        let byteArray = new Uint8Array(byteNumbers);
    
        byteArrays.push(byteArray);
      }
    
      const blob = new Blob(byteArrays, {type: contentType});
  
      resolve(blob)
    
    }).catch( e => {
      throw e
      /*const error = JSON.stringify(e)
      //this.alert.presentAlert("Erreur", e, "OK" );*/
    })   
  }

  presentLoadingDefault() { // loader de ionic appelé le temps que l'image s'affiche
    let loading = this.loadingCtrl.create({
      content: 'Chargement, veuillez patienter...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  fbSearchFor(items) {
    return new Promise (resolve => {
      const itemsRef$ = this.db.list('/'+items)
      
      itemsRef$.valueChanges().subscribe(listOfItems => {
        listOfItems ? resolve(listOfItems) : resolve([])
      })
    }).catch(err => {
      throw err
    })
  }

  getFirebaseImageUrl(imageId) {
    return new Promise (resolve => {
      this.afs.ref(imageId).getDownloadURL().subscribe(url => {
        resolve(url);
      })
    }).catch(err => {
      throw err
    })
  }
  
  fbStorageUpload(address, blob, needUrl) {
    return new Promise(resolve => {
      this.afs.upload(address, blob).snapshotChanges().subscribe(res => {
        if (needUrl) {
          this.getFirebaseImageUrl(address).then(url_ => {
            let url = <any>{}
            url = url_
            resolve(url)
          })
        } else {
          resolve(false)
        } 
      })
    })  
  }

  createRandomKey(length){
  let text = "", i = 0
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    while(i < length){
      text += possible.charAt(Math.round(Math.random() * possible.length-0.51))
      i ++
    }
    return text;
  }

  
}  
