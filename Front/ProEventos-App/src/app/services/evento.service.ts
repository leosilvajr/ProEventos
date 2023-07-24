import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs'; //Observable
import { Evento } from '../models/Evento';
import { Constants } from '@app/util/constants';


//Injeção de Dependencia do Angular: Exitem 3 maneiras
//Essa é a padrao que o Angular ja Atribui
// @Injectable({
//   providedIn: 'root'
// })

//A outra maneira mais usada é injetando direto no app.madules.ts
@Injectable() //Injeçao feita no app.madules.ts


export class EventoService {
  baseURL = Constants.URL_ENDPOINT+'api/eventos';
  constructor(private http: HttpClient) { }

public getEventos(): Observable<Evento[]> { //Retorna um Observable com um array de Eventos
  return this.http
  .get<Evento[]>(this.baseURL)
  .pipe(take(1));
}

public getEventosByTema( tema : string): Observable<Evento[]> {
  return this.http
  .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
  .pipe(take(1));
}

public getEventoById(id : number): Observable<Evento> {
  return this.http
  .get<Evento>(`${this.baseURL}/${id}`)
  .pipe(take(1));
}  

public post(evento: Evento): Observable<Evento> {
  return this.http
  .post<Evento>(this.baseURL, evento)
  .pipe(take(1));
}

public put(evento: Evento): Observable<Evento> {
  return this.http
  .put<Evento>(`${this.baseURL}/${evento.id}`, evento)
  .pipe(take(1)).pipe(take(1));
}

public deleteEvento(id : number): Observable<any> {
  return this.http
  .delete(`${this.baseURL}/${id}`)
  .pipe(take(1));
}


}
