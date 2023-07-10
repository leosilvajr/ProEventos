import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/Evento';
import { TituloComponent } from '../../shared/titulo/titulo.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html', //Associção entre o html e o tipescript
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit{
  ngOnInit(): void {
    
  }
  
}

