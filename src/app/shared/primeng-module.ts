import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [],
  imports: [
    TableModule,
    CalendarModule,
    DropdownModule
  ],
  providers: [],
  exports: [ CalendarModule, DropdownModule, TableModule ]
})
export class PrimeModule { }
