import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { EventoService} from '@app/services/evento.service';
import { Evento } from '@app/models/Evento';


@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  
  evento = {} as Evento; //Criando objeto vazio do tipo evento;
  form: FormGroup = this.fb.group({});
  estadoSalvar = 'post';
  
  get f(): any{ //Toda vez que eu chamar o f ele vai chamar os controls
    return this.form.controls;
  }
  
  get bsConfig(): any {
    return { 
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers : false    
    }
  }
  
  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService : EventoService,
    private spinner : NgxSpinnerService,
    private toastr : ToastrService
    
    ){
      this.localeService.use('pt-br')
    }
    
    public carregarEvento(): void {
      const eventoIdParam = this.router.snapshot.paramMap.get('id');
      
      //Variavel Definir modo de Salvar ou Atualizar
      this.estadoSalvar = 'put';
      
      if (eventoIdParam !== null) {
        this.spinner.show();
        this.eventoService.getEventoById(+eventoIdParam).subscribe(
          (evento: Evento) => {
            this.evento = { ...evento };
            this.form.patchValue(this.evento);
          },
          (error: any) => {
            this.spinner.hide(),
            this.toastr.error('Erro ao tentar carregar evento.', 'Erro !')
            console.error(error);
          },
          () => this.spinner.hide(),
          );
        }
      }
      
      ngOnInit(): void {
        this.validation();
        this.carregarEvento();
      }
      
      public validation(): void{
        this.form = this.fb.group({
          tema: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
          
          local: ['', Validators.required],
          
          dataEvento: ['', Validators.required],
          
          qtdPessoas: ['',[Validators.required, Validators.max(120000)]],
          
          telefone: ['', Validators.required],
          
          email: ['',[Validators.required, Validators.email]],
          
          imagemURL: ['', Validators.required]});
        }
        
        
        public resetForm() : void{
          this.form.reset();
        }
        
        public cssValidator(campoForm: FormControl): any{
          return {'is-invalid' : campoForm.errors && campoForm.touched};
        }
        
        public salvarAlteracao(): void{
          this.spinner.show();
          if(this.form.valid){ //Se meu formulario for valido
            
            if(this.estadoSalvar == 'post'){
              this.evento = {...this.form.value}; //Form.value sao todos os campos do formulario //spread operator             
            } else if (this.estadoSalvar == 'put') {
              this.evento = {id: this.evento.id, ...this.form.value}; //Form.value sao todos os campos do formulario //spread operator
            }

            this.eventoService[this.estadoSalvar](this.evento).subscribe( //next / error/ complete
            () => this.toastr.success('Evento salvo com sucesso.', 'Sucesso.'),
            (error: any) => {
              console.error(error);
              this.spinner.hide();
              this.toastr.error('Erro ao salvar o Evento.' , 'Erro')
            },
            () => this.spinner.hide()
            );            
          }
        }
      }
      