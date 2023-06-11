import { Component } from '@angular/core';

//Decorando a classe com os Metadados
@Component({
  selector: 'app-root', //Seletor do intex.html
  templateUrl: './app.component.html', //Chamada do Componente HTML
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ProEventos-App';
}
