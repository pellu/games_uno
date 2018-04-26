import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginProvider } from '../../providers/login.provider';
import { User } from '../../providers/user'
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(
    public 	navCtrl: NavController, 
    private loginService: LoginProvider,
    private/*public*/ user: User,
    private storage : Storage
  ) {}

  password = ""
  
  signIn() {
    this.loginService.signIn(this.user.email, this.password)
  }
  
  signUp() {
    this.loginService.signUp(this.user.email, this.password, this.user.alias)
  }

  ionViewDidLoad(){
    this.storage.get('user').then(user => {
      if (user) {
        this.user.init(user.id, user.alias, user.email, user.ttt_canInvite, user.ttt_invitationsRecieved);
      }
    })
  }
  
}
