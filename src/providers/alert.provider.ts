/*
import { HttpClient } from '@angular/common/http';
*/
import { Injectable } from '@angular/core';

import { AlertController } from 'ionic-angular';


@Injectable()
export class AlertProvider {

  constructor(private alertCtrl: AlertController) {
  }
  
  presentAlert(title, subTitle, btn_txt) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [btn_txt]
    });
    alert.present();
  }
  
  confirmRestart(title, playing, that) {
    const self = this
    let message = playing === that.player.is ? "Le joueur "+playing+" gagne" : "L'ordinateur gagne"
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: "Continuer",
          handler: () => {
            self.selectSymbol(that)
          }
        }
      ]
    });
    alert.present();
  }
  selectSymbol(that) {
    let alert = this.alertCtrl.create({
      title: "Début de partie",
      message: "Choisissez un symbole",
      buttons: [
        {
          text: "X",
          handler: () => {
            that.selectSymbol("X")
            that.restart()
          }
        },
        {
          text: "O",
          handler: () => {
            that.selectSymbol("O")
            that.restart()
          }
        }
      ]
    });
    alert.present();
  }
}