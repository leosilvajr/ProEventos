import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PalestrantesComponent } from './components/palestrantes/palestrantes.component';

//Importando Componentes da Rota
import { EventosComponent } from './components/eventos/eventos.component';
import { EventoDetalheComponent } from './components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from './components/eventos/evento-lista/evento-lista.component';

import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { PerfilComponent } from './components/user/perfil/perfil.component';

import { ContatosComponent } from './components/contatos/contatos.component';

const routes: Routes = [
  {
    path : 'user' , component: UserComponent,
    children:[//Rotas Filhas
      {path: 'login' , component: LoginComponent},
      {path: 'registration' , component: RegistrationComponent},
    ]
  },
  { 
    path: 'user/perfil', component: PerfilComponent
  },

  { path: 'eventos' , redirectTo: 'eventos/lista' }, //Redirecionando o Evento para eventos/lista
  { 
    path: 'eventos', component: EventosComponent,
    children: [ //Rotas Filhas
      { path: 'detalhe/:id', component: EventoDetalheComponent},
      { path: 'detalhe', component: EventoDetalheComponent},
      { path: 'lista', component: EventoListaComponent}
    ]
  },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'palestrantes', component: PalestrantesComponent},
  { path: 'contatos', component: ContatosComponent},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'}, //Se nao informar nada vai para dashboard
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}, //Se  informar qualquer coisa vai para dashboard


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
