import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs'; //Observable
import { Evento } from '../models/Evento';
import { Constants } from '@app/util/constants';
import { environment } from '@environments/environment';
import { PaginatedResult } from '@app/models/Pagination';


//Injeção de Dependencia do Angular: Exitem 3 maneiras
//Essa é a padrao que o Angular ja Atribui
// @Injectable({
//   providedIn: 'root'
// })

//A outra maneira mais usada é injetando direto no app.madules.ts
@Injectable() //Injeçao feita no app.modules.ts


export class EventoService {
  baseURL = environment.apiURL+'api/eventos';
  constructor(private http: HttpClient) { }

  //Para adicionar o Interceptor, tem que remover a variavel TOKEN dos argumentos de cada metodo.
  //TOKEN = new HttpHeaders({ 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }); 
  //, {headers: this.TOKEN}

  /*Antes de Paginar
public getEventos(): Observable<Evento[]> { //Retorna um Observable com um array de Eventos
  return this.http
  .get<Evento[]>(this.baseURL) //Remover apos resolver o problema do Interceptor CORS
  .pipe(take(1));
}*/

///Toda vez que eu chamar um evento eu tenho que informar qual a pagina dele, a pagina atual e quantos itens por pagina 
public getEventos(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Evento[]>> {
  const paginatedResult: PaginatedResult<Evento[]> = new PaginatedResult<Evento[]>();

  let params = new HttpParams;

  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemsPerPage.toString());
  }

  if (term != null && term != ''){
    params = params.append('term', term);
  }

  return this.http
    .get<Evento[]>(this.baseURL, {observe: 'response', params })
    .pipe(
      take(1),
      map((response) => {
        paginatedResult.result = response.body;
        if(response.headers.has('Pagination')) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
}

// public getEventosByTema( tema : string): Observable<Evento[]> {
//   return this.http
//   .get<Evento[]>(`${this.baseURL}/${tema}/tema`)
//   .pipe(take(1));
// }

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

postUpload(eventoId: number, file: any): Observable<Evento> {
  const fileToUpload = file[0] as File;
  const formData = new FormData();
  formData.append('file', fileToUpload);

  return this.http
  .post<Evento>(`${this.baseURL}/upload-image/${eventoId}`, formData)
    .pipe(take(1));
}

}
