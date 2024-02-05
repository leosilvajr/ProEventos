import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Palestrante } from '@app/models/Palestrante';
import { PalestranteService } from '@app/services/palestrante.service';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-palestrante-detalhe',
  templateUrl: './palestrante-detalhe.component.html',
  styleUrls: ['./palestrante-detalhe.component.css']
})
export class PalestranteDetalheComponent implements OnInit {
  public form!: FormGroup;
  public situacaoDoForm = '';
  public corDaDescricao = '';

  constructor(
    private fb: FormBuilder,
    public palestranteService : PalestranteService,
    private toaster : ToastrService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {
    this.validation(); //Validaçao do Form
    this.verificaForm();
    this.carregarPalestrante();
  }

  private validation(): void{
    this.form = this.fb.group({
      miniCurriculo: ['']
    })
  }
  
  public get f(): any {
    return this.form.controls;
  }

  private verificaForm(): void{
    this.form.valueChanges
    .pipe(
      map(() => {
        this.situacaoDoForm = 'Minicurrícul está sendo atualizado!';
        this.corDaDescricao = 'text-warning';
      }),
      debounceTime(2000),
      tap(() => this.spinner.show())
    ).subscribe(() =>{
      this,this.palestranteService
      .put({...this.form.value})
      .subscribe( () => {
        this.situacaoDoForm = 'Minicurriculo foi atualizado!';
        this.corDaDescricao = 'text-success';

        setTimeout(() => {
          this.situacaoDoForm = 'Minicurriculo foi carregado!';
          this.corDaDescricao = 'text-muted';
        }, 1000);
      },
      () => {
        this.toaster.error('Erro ao tentar atualizar Minicurriculo.', 'Erro')
      }
   )
   .add(() => this.spinner.hide())

    })
  }
  private carregarPalestrante(): void{
    this.spinner.show();
    this.palestranteService.getPalestrante()
      .subscribe(
        (palestrante: Palestrante) => {
          this.form.patchValue(palestrante);
        },
        (error) => {
          this.toaster.error('Erro ao carregar o Palestrante.', 'Erro')
        }
      )

  }
}
