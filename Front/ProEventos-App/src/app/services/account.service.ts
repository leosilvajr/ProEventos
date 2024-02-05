import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@app/models/identity/User';
import { UserUpdate } from '@app/models/identity/UserUpdate';
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

  getUser(): Observable<UserUpdate> {
    return this.http.get<UserUpdate>(this.baseUrl + 'getUser').pipe(take(1));
  }

  updateUser(model: UserUpdate): Observable<void> {
    return this.http.put<UserUpdate>(this.baseUrl + 'updateUser', model).pipe(
      take(1),
      map((user: UserUpdate) => {
          this.setCurrentUser(user);
        }
      )
    )
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

  postUpload(file: any): Observable<UserUpdate> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);
  
    return this.http
    .post<UserUpdate>(`${this.baseUrl}upload-image`, formData)
      .pipe(take(1));
  }

  public register(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(   
      take(1), 
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user); 
        }
      })
    );
  }
    
  }
  