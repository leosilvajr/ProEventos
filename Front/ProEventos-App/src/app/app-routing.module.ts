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
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'user/perfil', pathMatch: 'full'}, //Se nao informar nada vai para home

  //Criando um agrupamento onde todos os filhos dessa configuração tem que ser autentidado
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', redirectTo: 'user/perfil'},
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
      { path: 'contatos', component: ContatosComponent}
    ]
  },

  {
    path : 'user' , component: UserComponent,
    children:[//Rotas Filhas
      {path: 'login' , component: LoginComponent},
      {path: 'registration' , component: RegistrationComponent},
    ]
  },

  { path: 'home', component: HomeComponent},
  { path: '**', redirectTo: 'home', pathMatch: 'full'}, //Se nao informar nada vai para dashboard


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
