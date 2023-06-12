import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html', //Associção entre o html e o tipescript
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit{

  //Usar dentro do HTML usando <p>{{evento.Tema}}</p>
  public eventos: any = []; //Possui Espaços
  public eventosFiltrados: any = [];

  //Propriedade Binding
  larguraImagem: number = 50;
  margemImagem: number = 2;
  exibirImagem: boolean = true;

  private _filtroLista: string = '';

  public get filtroLista(): string{
    return this._filtroLista;
  }

  //Atribuindo valor para a variavel _filtroLista
  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this._filtroLista) : this.eventos;
  }

  //Filtro que vai pra dentro do input de busca
  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: {tema: string; local: string}) =>
      evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }



    //Injetando o HttpClient no contrutorpara usar em getEventos
  constructor(private http: HttpClient){}

  //Metodo chamado antes de inicializar a aplicação
  ngOnInit():void{
    this.getEventos();
  }

  alterarImagem(){ //Toda vez que executar essa ação, atribui para alterarImagem o oposto.
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {

    // Função pública chamada getEventos, sem retorno (void). Responsável por buscar os eventos.
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      // Faz uma requisição HTTP GET para o endereço 'https://localhost:5001/api/eventos'.
      // O método "subscribe" permite observar a resposta da requisição.

      response => {
        this.eventos = response,
        this.eventosFiltrados = this.eventos
      },
      // Quando a resposta da requisição for recebida com sucesso, essa função será executada.
      // Aqui, atribuímos a resposta (que contém os eventos) à variável "eventos" do objeto atual.

      error => console.log(error),
    );

  }
}

