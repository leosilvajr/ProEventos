import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import { NavComponent } from './nav/nav.component';

import { CollapseModule } from 'ngx-bootstrap/collapse'; //Importante Efeito Collapse

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    NavComponent,
   ],
  imports: [
    BrowserModule,
    AppRoutingModule, //Rotas
    HttpClientModule, //Possibilidade de usar no component a referencia
    BrowserAnimationsModule,
    CollapseModule.forRoot() //Usando o Collapse Importado
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
