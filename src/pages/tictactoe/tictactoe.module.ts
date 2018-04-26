import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TictactoePage } from './tictactoe';

@NgModule({
  declarations: [
    TictactoePage,
  ],
  imports: [
    IonicPageModule.forChild(TictactoePage),
  ],
})
export class TictactoePageModule {}
