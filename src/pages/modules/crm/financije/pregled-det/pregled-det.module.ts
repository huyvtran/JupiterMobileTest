import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmFinancijePregledDetPage } from './pregled-det';

import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CrmFinancijePregledDetPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmFinancijePregledDetPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    CrmFinancijePregledDetPage
  ]
})

export class CrmFinancijePregledDetPageModule { }
