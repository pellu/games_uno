/* import { ViewCache } from '@firebase/database/dist/esm/src/core/view/ViewCache'; */

import { Component/*, ViewChild*/ } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,/*, Content, Platform*/ 
ViewController} from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { CameraProvider } from '../../providers/camera.provider';
import { AlertProvider } from '../../providers/alert.provider';
import { MemoryProvider } from '../../providers/memory.provider';

import { User } from '../../providers/user'
import { Models } from '../../models/models'
import { MEMORY_SIZE } from '../../providers/globals';

@IonicPage()

@Component({
  selector: 'page-memory-create',
  templateUrl: 'memory-create.html',
})

export class MemoryCreatePage {
  /*@ViewChild(Content) content: Content*/
  
  constructor(
    public  navCtrl         : NavController, 
    public  navParams       : NavParams,
    private memoryProvider  : MemoryProvider,
    private camera          : CameraProvider,
    private actionSheetCtrl : ActionSheetController, 
    private alert           : AlertProvider,
    private models          : Models,
    private user            : User,
    public  events          : Events,
    public viewCtrl         : ViewController
  ) {}
  
  cards = this.initCards()
  cardsToSend = this.memoryProvider.initCardsToSend()
  canUploadPackage = true
  
  initCards(){
    return this.memoryProvider.initCards()
  }
  ionViewDidLoad() {
    /*this.events.subscribe("loadingStatus" ,i => {
      this.loadingStatus = (i * 5 / 100) + "/100"
    })*/
    this.viewCtrl.setBackButtonText('');
  }
  
  addCard (cardIndex, rowIndex) {
    this.presentActionSheet(cardIndex, rowIndex);
  }
  
  presentActionSheet(cardIndex, rowIndex) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ajouter une "memoryCard"',
      buttons: [
        {
          text: 'Nouvelle image',
          handler: () => {
            this.models.presentLoadingDefault()
            this.camera.getPicture(1, false, false).then(img => {
              this.handleImg(img, cardIndex, rowIndex)
            })
          },
        },{
          text: 'Depuis la bibliothèque',
          handler: () => {
            this.models.presentLoadingDefault()
            this.camera.getPicture(0, false, false).then(img => {
              this.handleImg(img, cardIndex, rowIndex)
            })
          },
        },{
          text: 'Annuler',
          role: 'Annuler',
        }
      ]
    });
    actionSheet.present();
  }

  handleImg (img_, cardIndex, rowIndex) {
    let img       = <any>{}
    img = img_    // on récupère l'image au format blob
    
    this.cards[rowIndex][cardIndex - (MEMORY_SIZE.cols * rowIndex)].src = img 
    // exemple : si la carte a pour index 7, sachant que les lignes font 4 éléments, 
    // la carte sera située à l'index ('la ligne') 1 du tableau this.cards, à l'index 3 de ce deuxième tableau de this.cards
    // pour déduire index = 3, on lui retire autant de lignes ('de paquets') de 4 cartes précédentes 
    
    this.cardsToSend[cardIndex] = this.cards[rowIndex][cardIndex - (MEMORY_SIZE.cols * rowIndex)]

    // on update le tableau final d'images, numérotées de 0 à 19
    
    this.camera.readURL(img, '#img'+cardIndex) 
    //on attribut l'image à la souce de l'élément html ayant pour id "img7" (si cette carte a pour index 7 bien sûr :b)
  }

  addCards () { //une fois que les 20 cartes sont ajoutées, on peut les envoyer dans le storage de firebase
    if (this.isReadyToSend()) {
      this.models.presentLoadingDefault()
      this.memoryProvider.uploadNewPackage(this.cardsToSend, this.user.id)
      this.canUploadPackage = false
    } else {
      let title, message
      
      if(this.canUploadPackage) {
        title   = "Jeu de cartes incomplet",
        message = "Vous devez ajouter 20 images pour constituer un jeu et pouvoir le poster."
      } else {
        title   = "Jeu de carte déjà créé",
        message = "Vous devez quitter cette page avant de pouvoir poster un nouveau jeu."
      }
      this.alert.presentAlert(title, message, "Ah d'accord !")
    }
  }

  isReadyToSend() {
    if(this.canUploadPackage) {
      for (let card of this.cardsToSend) {
        if (!card.src) {
          return false
        }
      }
      return true
    } else {
      return false
    }  
  }
}
