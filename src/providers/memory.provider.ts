/*
import { AlertProvider } from './alert.provider';
import { Alert, Events, Content, Platform } from 'ionic-angular';
*/

import { Injectable } from '@angular/core';
import { Models } from '../models/models';
import { MEMORY_SIZE } from './globals'

@Injectable()
export class MemoryProvider {

  constructor(
    /* 
    private alert : AlertProvider,
    public events: Events
     */
    private models: Models
  ) {
  }

  initCards () {
    let rows, cols, row, col, index
      rows  = []
      cols  = []
      row   = 0
      col   = 0
      index = 0

    while(row < MEMORY_SIZE.rows) {     
      while(col < MEMORY_SIZE.cols) {
        cols.push({index: index})
        col++
        index ++
      }
      col = 0
      rows.push(cols)
      cols = []
      row ++
    }
    return rows
  }

  initCardsToSend () {
    let i      = 0,
        output = []
    while(i < MEMORY_SIZE.cards) {
      output.push({index: i})
      i++
    }
    return output
  }

  uploadNewPackage(cards, uid) {
    return new Promise(resolve=>{
      let address
      for (let card of cards) {   
        address = 'images/'+ uid + '/' + card.index
        this.models.fbStorageUpload(address, card.src, false).then(res=>{
          resolve(res)
        })
        //this.events.publish('loadingStatus', i)
      }
    }).catch(err => {
      throw "Problème uploadNewPackage ... " + err
    }) 
  }

  async getUrls() { 
    let urls = [], i = 0, url
    while(i < MEMORY_SIZE.cards){
      url = await this.models.getFirebaseImageUrl('/images/autre_id_d_utilisateur/'+i+'.png')
      urls.push(url)
      i++
    }
    return urls
  }

  setUpCardsSrc(urls) {
    let cards  = [], i = 0
    return new Promise(resolve => {
      for (let url of urls) {
        cards.push({src: url, isVisible: true})
        i++
      } 
      resolve(cards)
    }).catch(err => {
      throw "Problème setUpCardsSrc ... " + err
    })
  }

  loadCards() {
    this.models.presentLoadingDefault() 
    return new Promise(resolve => {     
      this.getUrls().then(urls => {  
        this.setUpCardsSrc(urls).then(cards => {      
          this.randomizeCards(cards).then(result => {
            resolve(result)
          })
        })
      })
    }).catch(err => {
      throw 'Problème loadCards ... ' + err
    })  
  }
  
  randomizeCards(cards) {
    return new Promise(resolve => {
      
      let expandableCards = cards,
      toBeRandomized = [],
      output = [],
      card,
      newCard,
      i = 0

      const randomIndex = (length) => ( Math.round( Math.random() * (length) - 0.51) )

      while (expandableCards.length > MEMORY_SIZE.cards/2) {
        expandableCards.splice( randomIndex(expandableCards.length) , 1) 
      }

      while (expandableCards.length > 0) {
        card = expandableCards.splice( randomIndex(expandableCards.length) , 1)
        newCard = {src: card[0].src, isVisible: true, index: i}
        card[0].index = i + 1
        toBeRandomized.push(newCard)
        toBeRandomized.push(card[0])
        i += 2
      }

      while (toBeRandomized.length > 0) {
        card = toBeRandomized.splice( randomIndex(toBeRandomized.length) , 1)
        output.push(card[0])
      }
      
      resolve(output)
    }).catch(err => {
      throw "Problème randomizeCards  ... " + err
    })
  }
}

