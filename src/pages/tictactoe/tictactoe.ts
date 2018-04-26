import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { AlertProvider } from '../../providers/alert.provider'
import { User } from '../../providers/user'
import { Models } from '../../models/models'

import { InvitationsPage } from '../invitations/invitations'
import { SearchTictactoePlayersPage } from '../search-tictactoe-players/search-tictactoe-players'

@IonicPage()

@Component({
  selector: 'page-tictactoe',
  templateUrl: 'tictactoe.html'
})
export class TictactoePage {
  constructor(
    public 	navCtrl: NavController, 
    public navParams: NavParams, 
	private alertProvider: AlertProvider,
	public user: User,
	private models : Models,
	private db : AngularFireDatabase,
	private modal : ModalController,
	private actionSheetCtrl : ActionSheetController
  ) {

  }
	
	ionViewDidEnter() {
		// dès que l'on ouvre la vue tictactoe, on 'écoute' les changements en base de données : ... 
		const userRef = "users/" + this.user.id

		// ... de la possibilité d'inviter un autre joueur
		this.db.object(userRef+'/ttt_invitationSent').valueChanges().subscribe(invitationSent => {
			this.user.ttt_invitationSent = <any>{}

			// si aucune invitation envoyée en attente : 'ttt_invitationSent' : false dans firebase
			this.user.ttt_invitationSent = invitationSent
		})

		// ... de l'état de notre partie en cours (si aucune partie en cours, le noeud 'ttt_currentGame' = false)
		this.db.object(userRef+'/ttt_currentGame').valueChanges().subscribe(currentGame => {
			this.currentGame = currentGame
			// si une partie est en cours, on suit son statut dans firebase
			if (this.currentGame) {
				this.startVersusGame(this.currentGame.against, this.currentGame.id)

			}

		})

		//  ... des invitations reçues
		this.db.object(userRef+'/ttt_invitationsRecieved').valueChanges().subscribe(snapshot => {
			let ttt_invitationsRecieved = <any>{}
			ttt_invitationsRecieved = snapshot

			this.user.ttt_invitationsRecieved = []
			for (let i in ttt_invitationsRecieved) {
				// on recharge notre tableau d'invitations reçues
				this.user.ttt_invitationsRecieved.push(ttt_invitationsRecieved[i])
			}
		})

		// notre classe User est donc mise à jour à chaque changement de ces 2 valeurs
	}

	ionViewWillLeave() {
		// avant de quitter la vue, on désactive les listeners
		const userRef = "users/" + this.user.id
		this.db.database.ref(userRef+'/ttt_invitationSent').off()
		this.db.database.ref(userRef+'/ttt_invitationsRecieved').off()
		if (this.currentGame)  {
			this.db.database.ref('tictactoe/games/'+this.currentGame.id+'/state').off()
		}
	}
		
	presentActionSheet() {	
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Choisir',
			buttons: [
			{
				// partie contre l' I.A.
				text: 'Entrainement solo',
				handler: () => {
				this.alertProvider.selectSymbol(this)
				},
			},{
				text: 'Trouver un adversaire',
				handler: () => {
				this.searchTictactoePlayers()
				},
			},{
				// entre parenthèses : le nombre d'invitations reçues
				text: 'Invitations reçues ('+ this.user.ttt_invitationsRecieved.length +')',
				handler: () => {
				this.checkForInvitationsRecieved()
				},
			}
			]
		});
		actionSheet.present();	  
	}
 
 	checkForInvitationsRecieved() {
		let data = {invitations: this.user.ttt_invitationsRecieved, uid: this.user.id}
		let modal = this.modal.create(InvitationsPage, data)
		modal.present()
		/*modal.onDidDismiss(invitationAccepted => {
			if (invitationAccepted) {
				const game = 'tictactoe/games/'+invitationAccepted.id
				this.listenGameState(game)
			}
		})*/

	}

	searchTictactoePlayers(){
		const data = {uid: this.user.id}
		let modal = this.modal.create(SearchTictactoePlayersPage, data)
		modal.present()
		modal.onDidDismiss(player => {
			if (player) {
				this.sendInvitationForNewGame(player)
			}
		})
	}
 
 	 sendInvitationForNewGame(otherPlayer) {
		// on ne peut envoyer qu'une seule invitation à la fois : on vérifie donc que 'ttt_invitationSent' est à false
		if (!this.user.ttt_invitationSent) {
			// on crée une nouvelle id unique de partie composée de 12 caratères aléatoires
			const gameRef = this.models.createRandomKey(12)
			// une fois l'invitation envoyée, on ne peut plus créer de nouvelle partie puisque notre 'gameRef'
			// ne peut prendre qu'une seule valeur à la fois
			const ref = "users/" + otherPlayer + '/ttt_invitationsRecieved'
			// on met à jour le noeud firebase de l'utilisateur qui reçoit l'invitation
			// on lui ajoute dans ses invitations reçus, une nouvelle invitation
			this.db.object(ref).update({
				[gameRef] : {
					sender : {
						uid: this.user.id,
						alias: this.user.alias,
					},
					id: gameRef,
				}
			})
			// on modifie le noeud 'invitationSent' de l'utilisateur qui envoie l'invitation
			const invitationSentRef = 'users/'+this.user.id+'/ttt_invitationSent',
				  invitationsSentObj = this.db.object(invitationSentRef)
			
				  invitationsSentObj.set({
				[gameRef] : {
					id: gameRef, 
					accepted: false,
				}
			})
			this.gameRef = gameRef
		}
	}
	
	startVersusGame(otherPlayer, gameRef) {
		
		const game   = 'tictactoe/games/',
				// on choisit de façon aléatoire  qui pourra commencer à jouer
			  player = Math.random() < 0.5 ? this.user.id : otherPlayer,
			  // on choisit de façon aléatoire le symbole de chacun
			  otherPlayerSymbol = Math.random() < 0.5 ? 'X' : 'O',
			  uid = this.user.id

		this.player.is = otherPlayerSymbol === 'X' ? 'O' : 'X' 
  
		// on crée un nouvel objet de partie dans le noeud games du noeud tictactoe 
		this.db.object(game).update({
			[gameRef] : {
				players : {
					[uid] : {
						id: uid,
						is: this.player.is,
					},	
					[otherPlayer] : {
						id: otherPlayer,
						is: otherPlayerSymbol,
					}	
				},	
				state : {
					// par exemple si la première case en haut à gauche est jouée avec une croix, et que la case du milieu est un rond
					// le nouveau currentState sera : "X---O----"
					currentState: "---------",
					// "playing" correspond au joueur qui peut jouer le prochain coup
					playing: player,
					moves: 0,
					scores : {
						[uid] : 0,
						[otherPlayer] : 0,
					}	
				}
			}
		})

		const currentGame = {id: gameRef, against: otherPlayer}
		this.listenGameState (currentGame)
	}

	listenGameState (currentGame) {
		const gameStateRef = 'tictactoe/games/'+ currentGame.id
		this.db.database.ref(gameStateRef).once('value', res => {
			let playerSymbol = <any>{}
			console.log(res.val())
			playerSymbol = res.val().players[this.user.id].is
			this.player.is = playerSymbol
		})
		// on met un listenner sur l'état d'avancement de la partie
		this.db.object(gameStateRef+'/state').valueChanges().subscribe(res => {
			// dès qu'un nouveau coup est joué, que l'état est donc modifié...
			let gameState = <any>{}
			gameState = res
			gameState.currentState
			.split('')
			.map( (value, index) => 
				this.items[index] =  value !== '-' ? {value: value} : {value: ""} 
			)// ... on retranscrit le state en tableau et on assigne ces nouvelles valeurs à notre tableau de cases qui est rendu à l'écran
			
			// selon le joueur qui peut jouer le prochain coup, on autorise ou non le joueur à jouer
			this.canPlay = gameState.playing === this.user.id ? true : false
			
			// le nombres de cases remplies est updaté également : au bout de 9 tours ou si un des 2 joueurs gagne, la partie est remise à zéro
			if (this.hasWon() || this.moves === 10) {
				if (gameState.playing === this.user.id && this.moves < 10) {
					gameState.scores[currentGame.against] ++
					this.alertProvider.presentAlert("Défaite ;(", "Vous avez perdu...", "Ok")
				} else if (this.moves < 10) {
					gameState.scores[this.user.id] ++
					this.alertProvider.presentAlert("Victoire :D", "Vous avez gagné !!", "Ok")
				}
				
				this.moves = 0
				gameState.moves = this.moves
				gameState.currentState = '---------'
				this.db.object(gameStateRef).update(gameState)	
			} 
		})
	}
 
	invitationsRecieved = []
	currentGame = <any>{}
	gameRef = ""
	items  	=  [{},{},{},{},{},{},{},{},{}]
	player 	=  {is: "", score: 0}
	cpu    	=  {is: "", score: 0}
	moves  	=  0
	canPlay =  true
	lines  	=  [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	
	initItems () {
		this.moves = 0
		let output = [], i = 0
		while (i < 9) {
		
			output.push({})
			i++
		
		}

		this.items = output
		
		if ( !this.canPlay && !this.currentGame) {
			this.ai()	
		}
	}
	
	selectSymbol(symbol) {
		this.player.is = symbol
		this.cpu.is = symbol === "X" ? "O" : "X"
	}
 
	playSquare(event) {
		if (this.canPlay) {
			let items = <any>{}
			items = this.items
			// si la case jouée n'a encore aucun symbole
			if(!items[event.target.id].value) {
				items[event.target.id].value = this.player.is
				// si on est en train de jouer avec un adversaire à distance 
				if (this.currentGame) {
					let currentState = ""
					items.map((item, index) => 
					currentState += item.value !== "" ? item.value : "-"
					)// on réinitialise l'état de la partie  '---------' avec les bonnes valeurs
					// toutes les cases encore non jouées sont sybolisées par '-', les autres par O ou X
					
					this.db.object('tictactoe/games/' + this.currentGame.id + '/state').update({
						// on actualise la base de donnée à chaque nouveau coup joué
						currentState: currentState,
						// "playing" correspond au joueur qui peut jouer le prochain coup
						playing: this.currentGame.against,
						moves : this.moves + 1,
					})
				} else {
					// si on est en traind e jouer contre l' I.A.	
					this.canPlay = false
					this.items = items
					this.runGame(this.player.is)
				}	
			}
		}
	}

	hasWon() {
		let items = <any>{}
		items = this.items	
		for (let i = 0, len = this.lines.length; i < len; i++) {
			const [a, b, c] = this.lines[i];
			if (items[a].value && items[a].value === items[b].value && items[a].value === items[c].value) {
			return true;
			}
		}
		return false;	
	}

	runGame(playing){
		this.moves++
		if (this.hasWon()) {

			this.alertProvider.confirmRestart("Fin de partie !", playing, this)
			
			if (playing === this.player.is) {	
				this.player.score ++
			} else {
				this.cpu.score ++
			}

		} else if (this.moves < 9) {
			
			if ( playing === this.player.is ) {
				this.ai()
			}
	
		} else  {
			
			this.initItems()
			
		}
	}

	cancelGame() {
		console.log("hey")
		this.canPlay = true
		this.initItems()
		this.db.object('users/'+this.user.id+'/ttt_currentGame').set(false)
	}

	restart() {
		this.initItems()	
	}

	ai() {		
		setTimeout( () => {
			let i  
			let items = <any>{}
			items = this.items
			do {
				i = Math.round(Math.random() * items.length - 0.51)
			} while(items[i].value)

			items[i].value = this.cpu.is
			this.items = items
			this.runGame(this.cpu.is)
			this.canPlay = true

		}, 800);	
  	}
}
