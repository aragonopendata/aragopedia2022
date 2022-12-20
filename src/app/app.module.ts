import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
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
import { ResultComponent } from './pages/result/result.component';
import { ResultService } from './pages/result/result.service';
import { MatTabsModule } from '@angular/material/tabs';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PiramidePoblacionComponent } from './components/piramide-poblacion/piramide-poblacion.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { FilterPipe } from './pipes/filter.pipe';
import { AragopediaComponent } from './pages/aragopedia/aragopedia.component';
import { AragopediaSelectorTemasComponent } from './components/aragopedia-selector-temas/aragopedia-selector-temas.component';
import { AragopediaTablaDatosComponent } from './components/aragopedia-tabla-datos/aragopedia-tabla-datos.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { PersonaModule } from './pages/persona/persona.module';
import { FichaAragonComponent } from './pages/result/ficha-aragon/ficha-aragon.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
    AppRoutingModule,
    BrowserAnimationsModule,
    TimeLineModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    JwPaginationModule,
    PersonaModule,
    MatCheckboxModule,
  ],
  providers: [ResultService],
  bootstrap: [AppComponent]
})
export class AppModule { }
