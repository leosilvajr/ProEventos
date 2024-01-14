import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject, debounceTime } from 'rxjs';


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
  public eventoId = 0;

  //Variavel para instanciar Model Pagination
  public pagination = {} as Pagination;

  //Propriedade Binding
  public larguraImagem = 50;
  public margemImagem = 2;
  public exibirImagem = true;
  termoBuscaChanged: Subject<string> = new Subject<string>();

  //Filtro que vai pra dentro do input de busca
  public filtrarEventos(evt: any): void {
    if (this.termoBuscaChanged.observers.length === 0) {   //Termo de busca no filtro
      this.termoBuscaChanged.pipe(debounceTime(1000)).subscribe(
        filtrarPor => {
          this._spinner.show()  
          this.eventoService.getEventos(
            this.pagination.currentPage, 
            this.pagination.itemsPerPage, 
            filtrarPor
            ).subscribe(
            (paginatedResult: PaginatedResult<Evento[]>) => {
              this.eventos = paginatedResult.result;
              this.pagination = paginatedResult.pagination;
            },
            (error: any) => {
              this.spinner.hide();
              this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
            }
          ).add(() => this.spinner.hide());
        }
      )       
    }
    this.termoBuscaChanged.next(evt.value);       

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
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
      totalPages: 1
    } as Pagination;

    this.carregarEventos();
  }

                          //void porque nao retorna nada
  public alterarImagem() : void{ //Toda vez que executar essa ação, atribui para alterarImagem o oposto.
    this.exibirImagem = !this.exibirImagem;
  }

  public mostrarImagem(imagemURL): string{
    return imagemURL != '' ? `${environment.apiURL}resources/images/${imagemURL}` : 'assets/img/semImagem.png';
    
  }

  public carregarEventos(): void {
    this.spinner.show();

    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
        }
      )
      .add(() => this.spinner.hide());
  }

  openModal(event: any, template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }


  //Iniciando processo de paginaçao
  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
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

  

