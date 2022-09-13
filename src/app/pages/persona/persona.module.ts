import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonaRoutingModule } from './persona-rounting.module';

import { PersonaComponent } from './persona.component';

@NgModule({
    imports: [
        CommonModule,
        PersonaRoutingModule
    ],
    exports: [PersonaComponent],
    declarations: [PersonaComponent],
    providers: [],
})
export class PersonaModule { }
