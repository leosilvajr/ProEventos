import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Lote } from '@app/models/Lote';

import { Constants } from '@app/util/constants';
import { Observable, take } from 'rxjs';

@Injectable()
export class LoteService {
  
  baseURL = Constants.URL_ENDPOINT+'api/lotes';
  constructor(private http: HttpClient) { }
  
  public getLotesByEventoId(eventoId: number ): Observable<Lote[]> { //Retorna um Observable com um array de Eventos
    return this.http
    .get<Lote[]>(`${this.baseURL}/${eventoId}`)
    .pipe(take(1));
  }
  
  
  public saveLote(eventoId: number, lotes: Lote[]): Observable<Lote> {
    return this.http
    .put<Lote>(`${this.baseURL}/${eventoId}`, lotes)
    .pipe(take(1)).pipe(take(1));
  }
  
  public deleteLote(eventoId: number, loteId : number): Observable<any> {
    return this.http
    .delete(`${this.baseURL}/${eventoId}/${loteId}`)
    .pipe(take(1));
  }
  
}
/*
Passo a passo Criando Service
1ª Remover o {provideIn: 'root'}
2ª Adicionar o Lote Service em app.module EM providers Injeção de Dependencia
*/