import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { GeneralComponent } from './pages/general/general.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { ResultsComponent } from './pages/results/results.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'persona', component: PersonaComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'results', component: ResultsComponent },
  // { path: 'persona', loadChildren: () => import('./pages/persona/persona.module').then(m => m.PersonaModule) },
  // { path: 'eventos', loadChildren: () => import('./pages/eventos/eventos.module').then(m => m.EventosModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
