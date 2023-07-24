import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  public get spinner(): NgxSpinnerService {
    return this._spinner;
  }
  public set spinner(value: NgxSpinnerService) {
    this._spinner = value;
  }

  modalRef!: BsModalRef;
  //Usar dentro do HTML usando <p>{{evento.Tema}}</p>
  public eventos: Evento[] = []; //Possui Espaços
  public eventosFiltrados: Evento[] = [];

  //Propriedade Binding
  public larguraImagem = 50;
  public margemImagem = 2;
  public exibirImagem = true;

  private filtroListado = ''; //Variaveis tem que ser lowercase

  public eventoId = 0;
  public eventoTema = "";

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
    private _spinner: NgxSpinnerService,
    private router : Router
    ){}


  //Metodo chamado antes de inicializar a aplicação
  public ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

                          //void porque nao retorna nada
  public alterarImagem() : void{ //Toda vez que executar essa ação, atribui para alterarImagem o oposto.
    this.exibirImagem = !this.exibirImagem;
  }

  public carregarEventos(): void {
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

  openModal(event: any, template: TemplateRef<any>, eventoId : number, eventoTema: string) { //Componente do Modal
    event.stopPropagation();
    this.eventoId = eventoId;
    this.eventoTema = eventoTema;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {//Componente do Modal
    this.modalRef.hide();
    this.spinner.show();
    
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result : any) => {
        console.log(result)
          this.toastr.success('O Evento foi deletado com Sucesso.', 'Deletado !');       
          this.carregarEventos();       
      },
      (error: any) => {
        console.error(error)
        this.toastr.error(`Erro ao tentar deletar o Evento ${this.eventoId}.`, 'Erro');
      }
    ).add( () => this.spinner.hide());

  }

  decline(): void {//Componente do Modal
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate ([`eventos/detalhe/${id}`]);
  }
}

  

