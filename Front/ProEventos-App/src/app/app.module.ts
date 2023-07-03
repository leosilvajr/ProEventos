import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse'; //Importante Efeito Collapse
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './eventos/eventos.component';
import { PalestrantesComponent } from './palestrantes/palestrantes.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';

import { EventoService } from './services/evento.service';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';


@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    NavComponent,
    DateTimeFormatPipe //Adicionado o DateFormatPipe do helpers
   ],
  imports: [
    BrowserModule,
    FormsModule, //Importado para usar a busca.
    AppRoutingModule, //Rotas
    HttpClientModule, //Possibilidade de usar no component a referencia
    BrowserAnimationsModule,
    CollapseModule.forRoot(), //Usando o Collapse Importado
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot()

  ],
  providers: [
    EventoService //Injeção de Dependencia
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
