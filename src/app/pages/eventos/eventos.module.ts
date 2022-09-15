import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventosRoutingModule } from './eventos-routing.module';
import { EventosComponent } from './eventos.component';


@NgModule({
  imports: [
    CommonModule,
    EventosRoutingModule
  ],
  exports: [EventosModule],
  declarations: [EventosComponent],
})
export class EventosModule { }
