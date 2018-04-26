import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Models } from '../../models/models';

@IonicPage()
@Component({
  selector: 'page-search-tictactoe-players',
  templateUrl: 'search-tictactoe-players.html',
})
export class SearchTictactoePlayersPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private models: Models) {
  }

  players = []
  
  invite(player){
    this.viewCtrl.dismiss(player.uid)
  }
  
  goBack() {
    this.viewCtrl.dismiss()
  }

  async displayPlayers() {
    const myId = this.navParams.get('uid')
    const result = await this.models.fbSearchFor("users")
    let players = <any>{}
    players = result
    for (let player of players) {
      if (player.uid !== myId) {
        this.players.push(player)
      }
    }
  }

  ionViewDidEnter(){
   this.displayPlayers()
  }

}
