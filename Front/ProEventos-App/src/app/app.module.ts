import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse'; //Importante Efeito Collapse
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module'; //Rotas

import { AppComponent } from './app.component';
import { ContatosComponent } from './components/contatos/contatos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavComponent } from './shared/nav/nav.component';
import { TituloComponent } from './shared/titulo/titulo.component';

import { EventoService } from './services/evento.service';

import { DateTimeFormatPipe } from './helpers/DateTimeFormat.pipe';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';


@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    ContatosComponent,
    DashboardComponent,
    PerfilComponent,
    NavComponent,
    TituloComponent,
    DateTimeFormatPipe,
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent //Adicionado o DateFormatPipe do helpers
   ],
  imports: [
    BrowserModule,
    FormsModule, //Importado para usar a busca.
    ReactiveFormsModule,
    AppRoutingModule, //Rotas
    HttpClientModule, //Possibilidade de usar no component a referencia
    BrowserAnimationsModule,
    CollapseModule.forRoot(), //Usando o Collapse Importado
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),

    ToastrModule.forRoot({
    timeOut: 3000,
    positionClass: 'toast-bottom-right',
    preventDuplicates: true,
    progressBar: true,
    progressAnimation: 'increasing'
  }),
  NgxSpinnerModule

  ],
  providers: [
    EventoService //Injeção de Dependencia
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
