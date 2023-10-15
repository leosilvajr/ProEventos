import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { BsLocaleService } from 'ngx-bootstrap/datepicker';
  import { ToastrService } from 'ngx-toastr';
  import { NgxSpinnerService } from 'ngx-spinner';
  
  import { LoteService } from './../../../services/lote.service';
  import { EventoService } from '@app/services/evento.service';
  import { Evento } from '@app/models/Evento';
  import { Lote } from '@app/models/Lote';
  import { DatePipe } from '@angular/common';
  
  @Component({
    selector: 'app-evento-detalhe',
    templateUrl: './evento-detalhe.component.html',
    styleUrls: ['./evento-detalhe.component.scss'],
    providers: [ DatePipe ]
  })
  export class EventoDetalheComponent implements OnInit {
    
    modalRef: BsModalRef;
    eventoId: number;
    evento = {} as Evento;
    form: FormGroup;
    estadoSalvar = 'post';
    loteAtual = {id: 0, nome: '', indice: 0}; //Lote atual é id a igual a 0, nome vazio e indice 0 
    imagemURL = 'assets/img/upload.png'   
    
    get modoEditar(): boolean {
      return this.estadoSalvar == 'put';
    }
    
    get lotes(): FormArray {
      return this.form.get('lotes') as FormArray;
    }
    
    get f(): any {
      return this.form.controls;
    }
    
    
    get bsConfig(): any {
      return {
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY hh:mm a',
        containerClass: 'theme-default',
        showWeekNumbers: false
      };
    }
   
    constructor(
      private fb: FormBuilder,
      private localeService: BsLocaleService,
      private activatedRouter: ActivatedRoute,
      private eventoService : EventoService,
      private spinner : NgxSpinnerService,
      private toastr : ToastrService,
      private router : Router,
      private loteService : LoteService,
      private modalService : BsModalService
      
      ){
        this.localeService.use('pt-br')
      }
      
      public carregarEvento(): void {
        this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');
        
        //Variavel Definir modo de Salvar ou Atualizar
        this.estadoSalvar = 'put';
        
        if (this.eventoId !== null && this.eventoId !== 0) {
          this.spinner.show();
          this.eventoService.getEventoById(this.eventoId).subscribe(
            (evento: Evento) => {
              this.evento = { ...evento };
              this.form.patchValue(this.evento);
              //this.carregarLotes();
              this.evento.lotes.forEach( lote => {
                this.lotes.push(this.criarLote(lote));
              });
            },
            (error: any) => {
              this.toastr.error('Erro ao tentar carregar evento.', 'Erro !')
              console.error(error);
            }
            ).add(()=>this.spinner.hide());
          }
        }
        
        public carregarLotes(): void{
          this.loteService.getLotesByEventoId(this.eventoId).subscribe(
            (lotesRetorno: Lote[]) => {
              lotesRetorno.forEach(lote => {
                this.lotes.push(this.criarLote(lote));
              })
            },
            (erro: any) => {
              this.toastr.error('Erro ao tentar carregar lote.', 'Erro !');
              console.error(erro);
            }
            ).add(()=>this.spinner.hide());
          }
          
          ngOnInit(): void {
            
            this.validation();
            const eventoIdParam = this.activatedRouter.snapshot.paramMap.get('id');
            if (eventoIdParam !== null) {
              this.eventoId = +eventoIdParam;
              this.carregarEvento();
            }
          }
          
          public validation(): void{
            this.form = this.fb.group({
              tema: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
              local: ['', Validators.required],
              dataEvento: ['', Validators.required],    
              qtdPessoas: ['',[Validators.required, Validators.max(120000)]],         
              telefone: ['', Validators.required],       
              email: ['',[Validators.required, Validators.email]],         
              imagemURL: ['', Validators.required],
              
              //Lotes: Array de varios lotes
              lotes: this.fb.array([]) //adicionando lote em um array    
            });
          }
          
          adicionarLote(): void {
            this.lotes.push(this.criarLote({id: 0} as Lote)); //A cada vez que for executado cria um novo form pra adicionar lote
          }
          
          criarLote (lote : Lote): FormGroup { //Vai retornar um FormGroup
            return this.fb.group({
              id : [lote.id],
              nome: [lote.nome, Validators.required],
              quantidade: [lote.quantidade, Validators.required],
              preco: [lote.preco, Validators.required],
              dataInicio: [lote.dataInicio],
              dataFim: [lote.dataFim]
            })
          }

          public mudarValorData(value: Date, indice: number, campo: string): void{
            this.lotes.value[indice][campo] = value;
          }

          public retornaTituloLote(nome: string): string{
             return nome === null || nome === '' ? 'Nome do Lote' : nome; 
          }
          
          public resetForm() : void{
            this.form.reset();
          }
          
          public cssValidator(campoForm: FormControl | AbstractControl): any{
            return {'is-invalid' : campoForm.errors && campoForm.touched}; //Usar para preencher campos dentro do Input
          }
          
          public salvarEvento(): void{
            this.spinner.show();
            if(this.form.valid){ //Se meu formulario for valido
              
              if(this.estadoSalvar == 'post'){
                this.evento = {...this.form.value}; //Form.value sao todos os campos do formulario //spread operator             
              } else if (this.estadoSalvar == 'put') {
                this.evento = {id: this.evento.id, ...this.form.value}; //Form.value sao todos os campos do formulario //spread operator
              }
              
              this.eventoService[this.estadoSalvar](this.evento).subscribe( //next / error/ complete
              (eventoRetorno: Evento) => {
                this.toastr.success('Evento salvo com sucesso.', 'Sucesso.');
                this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
              },
              (error: any) => {
                console.error(error);
                this.spinner.hide();
                this.toastr.error('Erro ao salvar o Evento.' , 'Erro')
              },
              () => this.spinner.hide()
              );            
            }
          }
          
          public salvarLotes(): void{

            if (this.form.controls['lotes'].valid) { // Se lote estiver valido ou nao.
            this.spinner.show();         
              this.loteService.saveLote(this.eventoId, this.form.value.lotes)
              .subscribe(
                () => {
                  this.toastr.success('Lotes salvos com sucesso. ', 'Sucesso !');
                  //this.lotes.reset(); 
                },
                (error: any) => {
                  this.toastr.error('Erro ao tentar salvaar lote.', 'Erro !');
                  console.error(error);
                }
                ).add(() => this.spinner.hide())
              }
            }
            
            public removerLote(template:TemplateRef<any>,
                                indice: number): void{

              //Passando os parametros para a variavel loteAtual                    
              this.loteAtual.id = this.lotes.get(indice + '.id').value;              
              this.loteAtual.nome = this.lotes.get(indice + '.nome').value;   
              this.loteAtual.indice = indice;            


              this.modalRef = this.modalService.show(template, {class:'modal-sm'  });
              //this.lotes.removeAt(indice);
            }

            public confirmDeleteLote():void{
              this.modalRef.hide();
              this.spinner.show();

              this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
                .subscribe(
                  () => {
                    this.toastr.success('Lote deletado com sucesso.', 'Sucesso 1');
                    this.lotes.removeAt(this.loteAtual.indice);
                  },
                  (error: any) => {
                    this.toastr.error(`Erro ao tentar deletar o Lote: ${this.loteAtual.id}`, 'Erro !');
                    console.error(error);
                  }
                ).add(() => this.spinner.hide())
            }

            public declineDeleteLote():void{
              this.modalRef.hide();
            }
          }
          