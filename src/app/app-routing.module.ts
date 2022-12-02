import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GeneralComponent } from './pages/general/general.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { ResultComponent } from './pages/result/result.component';
import { ResultsComponent } from './pages/results/results.component';
import { AragopediaComponent } from './pages/aragopedia/aragopedia.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'persona/:id', component: PersonaComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'results/:temas/:years', component: ResultsComponent },
  { path: 'detalles', component: ResultComponent },
  { path: 'aragopedia', component: AragopediaComponent },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
