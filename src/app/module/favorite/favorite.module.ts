import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteRoutingModule } from './favorite-routing.module';
import { ListComponent } from './list/list.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';



@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    FavoriteRoutingModule,
    SharedModuleModule
  ]
})
export class FavoriteModule { }
