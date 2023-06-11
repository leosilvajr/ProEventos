import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit{

  //Usar dentro do HTML usando <p>{{evento.Tema}}</p>
  public eventos: any;

    //Injetando o HttpClient no contrutorpara usar em getEventos
  constructor(private http: HttpClient){}

  //Metodo chamado antes de inicializar a aplicação
  ngOnInit():void{
    this.getEventos();
  }

  public getEventos(): void {
    // Função pública chamada getEventos, sem retorno (void). Responsável por buscar os eventos.

    this.http.get('https://localhost:5001/api/eventos').subscribe(
      // Faz uma requisição HTTP GET para o endereço 'https://localhost:5001/api/eventos'.
      // O método "subscribe" permite observar a resposta da requisição.

      response => this.eventos = response,
      // Quando a resposta da requisição for recebida com sucesso, essa função será executada.
      // Aqui, atribuímos a resposta (que contém os eventos) à variável "eventos" do objeto atual.

      error => console.log(error),
    );
  }
}

