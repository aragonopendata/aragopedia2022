import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonaRoutingModule } from './persona-rounting.module';
import { PersonaComponent } from './persona.component';
import { BrowserModule } from '@angular/platform-browser';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
    imports: [
        CommonModule,
        PersonaRoutingModule,
        BrowserModule,
        JwPaginationModule,
        MatIconModule
    ],
    exports: [PersonaComponent],
    declarations: [PersonaComponent],
})
export class PersonaModule { }
