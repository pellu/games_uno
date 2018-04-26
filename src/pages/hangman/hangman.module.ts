import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HangmanPage } from './hangman';

@NgModule({
  declarations: [
    HangmanPage
  ],
  imports: [
    IonicPageModule.forChild(HangmanPage),
  ],
})
export class HangmanPageModule {}
