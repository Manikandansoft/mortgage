import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AlertComponent } from './alert/alert.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { Service } from '../service/service';
import { AdminGuard } from '../service/admin-guard';
import { UrlConfig } from '../service/url-config';
import { GridComponent } from './grid/grid.component';
import { PrimeModule } from './primeng-module';
import { CustomValidation } from '../helper/validation';
import { CutomerGuard } from '../service/customer-guard';

@NgModule({
  declarations: [AlertComponent, SpinnerComponent, GridComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimeModule
  ],
  providers: [Service, AdminGuard, CutomerGuard, UrlConfig, CustomValidation],
  exports: [ FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    SpinnerComponent,
    GridComponent,
    PrimeModule ]
})
export class SharedModuleModule { }
