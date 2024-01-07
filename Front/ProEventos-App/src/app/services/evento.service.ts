import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs'; //Observable
import { Evento } from '../models/Evento';
import { Constants } from '@app/util/constants';
import { environment } from '@environments/environment';


//Injeção de Dependencia do Angular: Exitem 3 maneiras
//Essa é a padrao que o Angular ja Atribui
// @Injectable({
//   providedIn: 'root'
// })

//A outra maneira mais usada é injetando direto no app.madules.ts
@Injectable() //Injeçao feita no app.modules.ts


export class EventoService {
  baseURL = environment.apiURL+'api/eventos';

  //Para adicionar o Interceptor, tem que remover a variavel TOKEN dos argumentos de cada metodo.
  TOKEN = new HttpHeaders({ 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }); 
  //, {headers: this.TOKEN}
  constructor(private http: HttpClient) { }

public getEventos(): Observable<Evento[]> { //Retorna um Observable com um array de Eventos
  return this.http
  .get<Evento[]>(this.baseURL, {headers: this.TOKEN}) //Remover apos resolver o problema do Interceptor CORS
  .pipe(take(1));
}

public getEventosByTema( tema : string): Observable<Evento[]> {
  return this.http
  .get<Evento[]>(`${this.baseURL}/${tema}/tema`, {headers: this.TOKEN})
  .pipe(take(1));
}

public getEventoById(id : number): Observable<Evento> {
  return this.http
  .get<Evento>(`${this.baseURL}/${id}`, {headers: this.TOKEN})
  .pipe(take(1));
}  

public post(evento: Evento): Observable<Evento> {
  return this.http
  .post<Evento>(this.baseURL, evento, {headers: this.TOKEN})
  .pipe(take(1));
}

public put(evento: Evento): Observable<Evento> {
  return this.http
  .put<Evento>(`${this.baseURL}/${evento.id}`, evento, {headers: this.TOKEN})
  .pipe(take(1)).pipe(take(1));
}

public deleteEvento(id : number): Observable<any> {
  return this.http
  .delete(`${this.baseURL}/${id}`, {headers: this.TOKEN})
  .pipe(take(1));
}

postUpload(eventoId: number, file: any): Observable<Evento> {
  const fileToUpload = file[0] as File;
  const formData = new FormData();
  formData.append('file', fileToUpload);

  return this.http
  .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData, {headers: this.TOKEN})
    .pipe(take(1));
}

}
