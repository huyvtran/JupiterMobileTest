import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmFinancijePregledZadnjeDetPage } from './pregled-zadnje-det';

import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CrmFinancijePregledZadnjeDetPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmFinancijePregledZadnjeDetPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    CrmFinancijePregledZadnjeDetPage
  ]
})

export class CrmFinancijePregledZadnjeDetPageModule { }
