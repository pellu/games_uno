import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DICTIONARY } from '../../providers/globals'
import { AlertProvider } from '../../providers/alert.provider';

@IonicPage()
@Component({
  selector: 'page-hangman',
  templateUrl: 'hangman.html',
})
export class HangmanPage {
  mot = ""
  lettres = []
  lettreEntree = ""
  tentative = 11
  pendu = ""
  lettreDejaJouee = []
  lettreTrouve = []
  joue = false
  partieTerminee=true
  tentatives=0

  constructor(public navCtrl: NavController, public navParams: NavParams, private alerte: AlertProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HangmanPage');
    this.newGame()
  }

  newGame() {
    this.lettres = []
    this.tentative = 11
    this.tentatives=0
    this.pendu = ""
    this.joue= false
    this.partieTerminee=true;
    this.lettreDejaJouee = []
    let motATrouver = Math.round(Math.random() * DICTIONARY.length)
    this.mot = DICTIONARY[motATrouver].key
    let motDecoupe = this.mot.split("")
    console.log(this.mot)
    for (let lettre of motDecoupe) {
      this.lettres.push(
        { valeur: lettre, trouve: false }
      )
    }
  }

  jeu() {
    console.log(this.lettreEntree)
    if (this.lettreEntree.match(/[a-zA-Z-]/) && this.tentative > 0) {
      this.tentatives++
      console.log(this.tentatives)
      let trouve = false
      let dejaUtiliser = false
      this.lettres.map(lettre => {
        if (lettre.valeur.toLowerCase() === this.lettreEntree.toLowerCase()) {
          lettre.trouve = true
          trouve = true
          this.lettreTrouve.push(this.lettreEntree)
          console.log(this.tentative)
          if(this.lettreTrouve.length === this.lettres.length){
            this.partieTerminee=false;
            this.alerte.presentAlert("Bravo", "Vous avez gagné, vous avez trouvé le mot " + this.mot + " en " + this.tentatives + " tentatives", "OK")
            this.newGame();
          }
        }
      })
      for(var i=0; i<this.lettreDejaJouee.length;i++){
        if(this.lettreDejaJouee[i].valeur===this.lettreEntree){
          dejaUtiliser = true
        }
      }
      if (dejaUtiliser) {
        this.alerte.presentAlert("Lettre déjà jouée", "Veuillez saisir un autre caractère", "OK")
      } else {
        if (trouve === false) {
          this.tentative--
          this.joue= true
          if (this.tentative === 0) {
            this.partieTerminee=false;
            this.alerte.presentAlert("Perdu", "Vous avez réalisé " + this.tentatives + " tentatives pour trouver le mot " + this.mot, "OK")
            this.newGame()
          }
          this.pendu = "../../../assets/imgs/hangman/hung" + (11 - this.tentative) + ".png"
        }
        this.lettreDejaJouee.push({ valeur: this.lettreEntree, trouve: trouve })
      }
    } else {
      if (this.tentative === 0) {
        this.partieTerminee=false;
        this.alerte.presentAlert("Partie fini", "Veuillez recommencer", "OK")
        this.newGame()
      } else {
        this.alerte.presentAlert("Caractere incorrect", "Veuillez saisir un autre caractère", "OK")
      }
    }
    this.lettreEntree = ""
  }
}