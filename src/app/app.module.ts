import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';

import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { TimeLineModule } from './components/timeline/timeline.component';
import { PersonaModule } from './pages/persona/persona.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { SelectLocationComponent } from './components/select-location/select-location.component';
import { TemasComponent } from './components/temas/temas.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SelectProvinciaComponent } from './components/select-location/provincias/provincias.component';
import { SelectComarcaComponent } from './components/select-location/comarcas/comarcas.component';
import { SelectMunicipioComponent } from './components/select-location/municipios/municipios.component';
import { ResultsComponent } from './pages/results/results.component';
import { ResultComponent } from './pages/result/result.component';
import { ResultService } from './pages/result/result.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PiramidePoblacionComponent } from './components/piramide-poblacion/piramide-poblacion.component';
import { FilterPipe } from './pipes/filter.pipe';
import { AragopediaComponent } from './pages/aragopedia/aragopedia.component';
import { AragopediaSelectorTemasComponent } from './components/aragopedia-selector-temas/aragopedia-selector-temas.component';
import { AragopediaTablaDatosComponent } from './components/aragopedia-tabla-datos/aragopedia-tabla-datos.component';
import { FichaAragonComponent } from './pages/result/ficha-aragon/ficha-aragon.component';
import { ProvinciasComponent } from './components/aragopedia-selector-temas/location/provincias/provincias.component';
import { ComarcasComponent } from './components/aragopedia-selector-temas/location/comarcas/comarcas.component';
import { MunicipiosComponent } from './components/aragopedia-selector-temas/location/municipios/municipios.component';
import { LocationComponent } from './components/aragopedia-selector-temas/location/location.component';

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
    ResultComponent,
    NotFoundComponent,
    PiramidePoblacionComponent,
    FilterPipe,
    AragopediaComponent,
    AragopediaSelectorTemasComponent,
    AragopediaTablaDatosComponent,
    FichaAragonComponent,
    ProvinciasComponent,
    ComarcasComponent,
    MunicipiosComponent,
    LocationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TimeLineModule,             
    PersonaModule,              
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule,

    // Material
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
  ],
  providers: [ResultService],
  bootstrap: [AppComponent]
})
export class AppModule {}
