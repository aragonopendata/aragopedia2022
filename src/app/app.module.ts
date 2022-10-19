import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './components/search/search.component';
import { TimeLineModule } from './components/timeline/timeline.component';
import { SelectLocationComponent } from './components/select-location/select-location.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TemasComponent } from './components/temas/temas.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SelectProvinciaComponent } from './components/select-location/provincias/provincias.component';
import { SelectComarcaComponent } from './components/select-location/comarcas/comarcas.component';
import { SelectMunicipioComponent } from './components/select-location/municipios/municipios.component';
import { ResultsComponent } from './pages/results/results.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    SelectLocationComponent,
    TemasComponent,
    HeaderComponent,
    FooterComponent,
    SelectProvinciaComponent,
    SelectComarcaComponent,
    SelectMunicipioComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TimeLineModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
