import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; //Observable
import { Evento } from '../models/Evento';

//Injeção de Dependencia do Angular: Exitem 3 maneiras
//Essa é a padrao que o Angular ja Atribui
// @Injectable({
//   providedIn: 'root'
// })

//A outra maneira mais usada é injetando direto no app.madules.ts
@Injectable() //Injeçao feita no app.madules.ts


export class EventoService {
  baseURL = 'https://localhost:44338/api/eventos';
  constructor(private http: HttpClient) { }

public getEventos(): Observable<Evento[]> { //Retorna um Observable com um array de Eventos
  return this.http.get<Evento[]>(this.baseURL);
}

public getEventosByTema( tema : string): Observable<Evento[]> {
  return this.http.get<Evento[]>(`${this.baseURL}/${tema}/tema`);
}

public getEventoById(id : number): Observable<Evento[]> {
  return this.http.get<Evento[]>(`${this.baseURL}/${id}`);
}

}
