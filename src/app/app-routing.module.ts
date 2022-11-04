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
  { path: '', redirectTo: 'servicios/aragopedia2022', pathMatch: 'full' },
  { path: 'servicios/aragopedia2022', component: HomeComponent },
  { path: 'servicios/aragopedia2022/persona', component: PersonaComponent },
  { path: 'servicios/aragopedia2022/eventos', component: EventosComponent },
  { path: 'servicios/aragopedia2022/general', component: GeneralComponent },
  { path: 'servicios/aragopedia2022/results', component: ResultsComponent },
  { path: 'servicios/aragopedia2022/result', component: ResultComponent },
  // {path: 'servicios/aragopedia2022/result', loadChildren: () =>
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
