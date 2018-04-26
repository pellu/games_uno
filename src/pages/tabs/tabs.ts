import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { TictactoePage } from '../tictactoe/tictactoe';
import { MemoryPage } from '../memory/memory';
import { HangmanPage } from '../hangman/hangman';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = TictactoePage;
  tab3Root = MemoryPage;
  tab4Root = HangmanPage;

  constructor() {

  }
}
