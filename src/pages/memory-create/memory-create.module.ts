import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemoryCreatePage } from './memory-create';

@NgModule({
  declarations: [
    MemoryCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(MemoryCreatePage),
  ],
})
export class MemoryCreatePageModule {}
