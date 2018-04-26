/*import { Models } from '../../models/models'*/
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert.provider';
//import { User } from '../../providers/user';
import { MemoryProvider } from '../../providers/memory.provider';
import { MemoryCreatePage } from '../memory-create/memory-create';


@IonicPage()
@Component({
  selector: 'page-memory',
  templateUrl: 'memory.html',
})
export class MemoryPage {

  constructor(
    /* private models : Models, */
    public navCtrl: NavController, 
    public navParams: NavParams,
    //private user : User,
    private memoryProvider : MemoryProvider,
    private actionSheetCtrl : ActionSheetController,
    private alertProvider : AlertProvider
  ) {
  }

  clickCard(card) {
    if(this.canPlay) {
      const index = this.cards.indexOf(card)
      this.playedCards.push(index)
      this.cards[index].isVisible = true
      if (this.playedCards.length === 2) { 
        this.canPlay = false
        if (this.cards[this.playedCards[0]].src === this.cards[this.playedCards[1]].src) {
          this.playedCards.splice(0,2)
          this.cardsWon += 2
          if (this.cardsWon === this.cards.length) {
            this.alertProvider.presentAlert("Félicitations :)", "Vous avez trouvé en seulement "+ (10 - this.attemptsLeft) +" tentatives", "ok")
          }
          this.canPlay = true
        } else {
          setTimeout(()=> {
            this.canPlay = true
            this.cards[this.playedCards[0]].isVisible = false
            this.cards[this.playedCards[1]].isVisible = false
            this.playedCards.splice(0,2)
            if (this.attemptsLeft === 0) {
              this.alertProvider.presentAlert("Perdu :(", "Nombre maximum de tentatives utilisé", "ok")
            }
          }, 2000)
        }
        this.attemptsLeft --
      }
    }
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choisir',
      buttons: [
        {
          text: 'Jeu en ligne',
          handler: () => {
            this.loadNewGame()
          },
        },{
          text: 'Créer un nouveau jeu',
          handler: () => {
            this.navCtrl.push(MemoryCreatePage)
          },
        },{
          text: 'Annuler',
          role: 'Annuler',
        }
      ]
    });
    actionSheet.present();
  }

  cards = []//this.memoryProvider.initCards()
  emptyCards = this.memoryProvider.initCards()
  image = <any>{}
  playedCards = []
  cardsWon = 0
  canPlay = true
  attemptsLeft = 10

  initCards(cards) {
    this.cards.splice(0, this.cards.length)
    for (let card of cards) {
      this.cards.push(card)
    }
    this.runGame()
  }

  loadNewGame(){
    this.memoryProvider.loadCards().then(cards => {
      this.initCards(cards)
      this.attemptsLeft = 10
      this.cardsWon = 0
      /*let index
      for (let i in res) {
        index = parseInt(i)
        if (index < 4) {
          this.cards[0][i] = res[i]
        } else if (index < 8) {
          this.cards[1][index - 4] = res[i]
        } else if (index < 12){
          this.cards[2][index - 8] = res[i]
        } else if (index < 16) {
          this.cards[3][index - 12] = res[i]
        } else {
          this.cards[4][index - 16] = res[i]
        }  
      }*/

    })
  }

  runGame() {
    setTimeout(()=>{
      this.cards.map(card=> { card.isVisible = false })
    },5000)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemoryPage');
  }

}
