import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-invitations',
  templateUrl: 'invitations.html',
})
export class InvitationsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public db: AngularFireDatabase,
  ) {
  }

  /*ionViewDidEnter() {
    console.log(this.invitations)
  }*/

  invitations = this.navParams.get('invitations')
  uid = this.navParams.get('uid')

  goBack() {
    this.viewCtrl.dismiss()
  }

  accept(invitation) {
    // l'objet invitation correspond à un élément du tableau invitations reçues
    // on se positionne dans firebase, au niveau du 'currentGame' des 2 utilisateurs qu'on update avec la référence de la partie dans 'tictactoe/games/'
    const otherPlayerId = invitation.sender.uid,
          user1Ref = 'users/'+otherPlayerId,
          user2Ref = 'users/'+this.uid
    // la seule chose qui change pour chaque joueur, c'est l'id de l'opposant      
    let update = { ttt_currentGame: { id: invitation.id, against: this.uid, } }
    this.db.object(user1Ref).update(update)
    
    update.ttt_currentGame.against = otherPlayerId

    this.db.object(user2Ref).update(update)
    this.viewCtrl.dismiss(/*invitation*/)
  }
}
