/*import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
*/

import { Injectable/*, Testability*/ } from '@angular/core';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AlertProvider } from './alert.provider';
import { User } from './user'



@Injectable()
export class LoginProvider {
  authState: any = null;
  
  constructor(
    /*public http: HttpClient, 
    private afs : AngularFirestore,*/
    private afAuth : AngularFireAuth,
    private db : AngularFireDatabase,
    private alertCtrl : AlertProvider,
    private user : User,
    private storage : Storage
  ){   
    /*this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });*/
  }
  
  async signIn(email, pw) {

    try {
      const connectedUser = await this.afAuth.auth.signInWithEmailAndPassword(email, pw);
      if (connectedUser) {

        const usersRef$ = this.db.object('/users/'+connectedUser.uid)
        usersRef$.valueChanges().subscribe(user_res => {     
        let user = <any>{}
        user = user_res 
        this.user.init(user.uid, user.alias, user.email, user.ttt_canInvite, user.ttt_invitationsRecieved )
        this.storage.set('user', this.user)

        })
        this.alertCtrl.presentAlert("Félicitations "+this.user.alias, "Vous êtes connecté !", "Ok")
      }  
    }
    catch (e) {
      let errorMessage = ""
      if (e.code === "auth/user-not-found") {
        errorMessage = "Adresse mail inconnue"
      } else if (e.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrecte"
      } else {
        errorMessage = "Un problème est survenu, merci de réessayer."
      }
      this.alertCtrl.presentAlert("Erreur", errorMessage, "ok")
    }
  }

  async signUp (email, pw, alias) {
    
    if (await this.aliasTaken(alias)) {
      this.alertCtrl.presentAlert("Désolé", "Ce pseudo est déjà pris :(", "Ok") 
    } else {
      this.createUser(email, pw, alias)
    }
  }
  
  aliasTaken(alias) {
    return new Promise(resolve => {
      /*
      this.db.database.ref('/users').on('value', function(snapshot) {
        for (let i in snapshot.val()) {
          if (snapshot.val()[i].alias === alias) {
            resolve(true)
          }
        }
        resolve(false)
      })
      */
      const usersRef$ = this.db.list('/users', ref => ref.orderByChild('alias').equalTo(alias))
      
      usersRef$.valueChanges().subscribe(users => {

        users.length > 0 ? resolve(true) : resolve(false)
      
      })
      /*
      users.forEach(user => {
        if (user.payload.val().alias === alias) {
          resolve(true)
        }
      })
      resolve(false)
      */
    }).catch(err => {
      console.log(err)
    });
  }

  async createUser(email, pw, alias) {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        pw
      );
      if (user.uid) {        
        const ref = this.db.object("users")
        ref.update({
          [user.uid] : {
            email : email,
            alias : alias,
            uid : user.uid,
            ttt_canInvite : true,
            ttt_invitationsRecieved : false,
          }
        })
        this.user.init(user.uid, alias, email, true, false)
        this.storage.set('user', this.user)
        this.alertCtrl.presentAlert("Félicitations", "Vous êtes connecté en tant que "+alias, "Ok")
      }
    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        this.alertCtrl.presentAlert("Erreur", "Cette adresse mail est déjà associée à un autre compte", "ok")
      }
    }
  }

  /*
  createUser2(email, pw, alias) {
    var that = this
    this.afAuth.auth.createUserWithEmailAndPassword(email, pw).then(user => {
      if (user.uid) {        
        const ref = that.db.object("users")
        ref.update({
          [user.uid] : {
            email : email,
            alias : alias,
            uid: user.uid
          }
        })
        that.alertCtrl.presentAlert("Félicitations", "Vous êtes connecté en tant que "+alias, "Ok")
      }
    }).catch(err => {
      console.log(err)
    })
  }

  async signInAnonymously(email, pw) {
    this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.authState = user
      this.afAuth.auth.onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          console.log(user)
        }
      });
    })
    .catch(error => console.log(error));
  }
  */
}