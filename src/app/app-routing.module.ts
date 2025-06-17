import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GeneralComponent } from './pages/general/general.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { ResultComponent } from './pages/result/result.component';
import { ResultsComponent } from './pages/results/results.component';
import { AragopediaComponent } from './pages/aragopedia/aragopedia.component';
import { FichaAragonComponent } from './pages/result/ficha-aragon/ficha-aragon.component';
import { QueryResultsComponent } from './pages/query-results/query-results.component';


const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent, title: 'Aragopedia - Inicio' },
  { path: 'persona/:id', component: PersonaComponent, title: 'Aragopedia - Personas' },
  { path: 'general', component: GeneralComponent },
  { path: 'results/:temas/:years', component: ResultsComponent, title: 'Aragopedia - Resultados de búsqueda' },
  { path: 'detalles', component: ResultComponent, title: 'Aragopedia - Detalles' },
  { path: 'detalles/aragon', component: FichaAragonComponent, title: 'Aragopedia - Detalles' },
  { path: 'query-results', component: QueryResultsComponent, title: 'Aragopedia - Resultados de consulta' },
  { path: 'aragopedia', component: AragopediaComponent, title: 'Aragopedia - Datos estadísticos' },
  { path: '**', pathMatch: 'full', component: NotFoundComponent, title: 'Aragopedia - Error 404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
