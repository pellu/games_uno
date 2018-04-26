import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoryPage } from './memory';

@NgModule({
  declarations: [
    MemoryPage,
  ],
  imports: [
    IonicPageModule.forChild(MemoryPage),
  ],
})
export class MemoryPageModule {}
