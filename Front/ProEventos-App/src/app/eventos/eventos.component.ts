import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html', //Associção entre o html e o tipescript
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit{

  modalRef!: BsModalRef;
  //Usar dentro do HTML usando <p>{{evento.Tema}}</p>
  public eventos: Evento[] = []; //Possui Espaços
  public eventosFiltrados: Evento[] = [];

  //Propriedade Binding
  public larguraImagem = 50;
  public margemImagem = 2;
  public exibirImagem = true;

  private filtroListado = ''; //Variaveis tem que ser lowercase

  public get filtroLista(): string{
    return this.filtroListado;
  }

  //Atribuindo valor para a variavel _filtroLista
  public set filtroLista(value: string){
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  //Filtro que vai pra dentro do input de busca
  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: {tema: string; local: string}) =>
      evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }



    //Injetando o HttpClient no contrutorpara usar em getEventos
  constructor(
    private eventoService : EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
    ){}

  //Metodo chamado antes de inicializar a aplicação
  public ngOnInit():void{
    this.getEventos();
  }
                          //void porque nao retorna nada
  public alterarImagem() : void{ //Toda vez que executar essa ação, atribui para alterarImagem o oposto.
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos,
        this.eventosFiltrados = this.eventos
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os Eventos.', 'Erro!')
      },
      complete: () => this.spinner.hide()
    });
  }

  openModal(template: TemplateRef<any>) { //Componente do Modal
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {//Componente do Modal
    this.modalRef.hide();
    this.toastr.success('O Evento foi deletado com Sucesso.', 'Deletado !')
  }

  decline(): void {//Componente do Modal
    this.modalRef.hide();
  }
}

