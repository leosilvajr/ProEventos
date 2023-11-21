import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/identity/User';
import { environment } from '@environments/environment';
import { Observable, ReplaySubject, map, take } from 'rxjs';

@Injectable({ providedIn: 'root'})
export class AccountService {
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  
  baseUrl = environment.apiURL + 'api/account/';
  constructor(private http: HttpClient) { }
  
  public login(model: any): Observable<void> {
    // Faz uma requisição HTTP POST para a URL de login usando o modelo fornecido
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(   
      take(1), // Garante que apenas o primeiro valor emitido será considerado
      map((response: User) => {
        const user = response;
        // Verifica se há uma resposta válida (atualmente sem lógica dentro do bloco condicional)
        if (user) {
          this.setCurrentUser(user); // Armazenar informações do usuário, redirecionar para outra página, etc.
        }
      })
    );
  }
  logout(): void {
    localStorage.removeItem('user'); // Remove informações do usuário do armazenamento local
    this.currentUserSource.next(null); // Notifica os assinantes que o usuário foi removido
    this.currentUserSource.complete(); // Completa o subject
  }

  // Método para definir o usuário atual
  public setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user)); // Armazena as informações do usuário no armazenamento local
    this.currentUserSource.next(user); // Notifica os assinantes sobre a atualização do usuário
  }
    
  }
  