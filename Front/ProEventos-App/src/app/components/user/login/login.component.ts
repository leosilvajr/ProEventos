import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from '@app/models/identity/UserLogin';
import { AccountService } from '@app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model= {} as UserLogin;

  constructor(private accountService: AccountService,
              private router: Router,
              private toaster: ToastrService){}
  ngOnInit(): void {}

  public login () : void {
    this.accountService.login(this.model).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
        this.toaster.success(`Usuário ${this.model.userName} logado com sucesso.`);
      },
      (error: any) => {

        if (error.status == 401 ) {
          this.toaster.error('Usuário ou senha inválido.');
        } else {
          this.toaster.error('Falha ao se conectar com Servidor.');
        }
      }
    )
 
  }

}
