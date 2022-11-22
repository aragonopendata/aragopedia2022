import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { GeneralComponent } from './pages/general/general.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { ResultComponent } from './pages/result/result.component';
import { ResultsComponent } from './pages/results/results.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'persona', component: PersonaComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'results/:temas', component: ResultsComponent },
  { path: ':tipoLocalidad/:municipio', component: ResultComponent },
  // {path: '/result', loadChildren: () =>
  // import('./pages/result/result.component').then(m => m.ResultComponent), data: { breadcrumb: { skip: true } }},
  // { path: 'persona', loadChildren: () => import('./pages/persona/persona.module').then(m => m.PersonaModule) },
  // { path: 'eventos', loadChildren: () => import('./pages/eventos/eventos.module').then(m => m.EventosModule) },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
