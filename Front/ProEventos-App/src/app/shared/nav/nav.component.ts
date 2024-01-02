import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isCollapsed = true; //Chamada do COmponente Collapse

  constructor(
    public accountService: AccountService,
    private router : Router){}

  ngOnInit(){
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/user/login');
  }

  showMenu(): boolean {
    return this.router.url != '/user/login';
  }
}
