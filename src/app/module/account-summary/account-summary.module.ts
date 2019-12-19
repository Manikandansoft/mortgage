import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountSummaryRoutingModule } from './account-summary-routing.module';
import { AccountSummaryComponent } from './component/account-summary.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';



@NgModule({
  declarations: [AccountSummaryComponent],
  imports: [
    CommonModule,
    AccountSummaryRoutingModule,
    SharedModuleModule
  ]
})
export class AccountSummaryModule { }
