import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchTictactoePlayersPage } from './search-tictactoe-players';

@NgModule({
  declarations: [
    SearchTictactoePlayersPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchTictactoePlayersPage),
  ],
})
export class SearchTictactoePlayersPageModule {}
