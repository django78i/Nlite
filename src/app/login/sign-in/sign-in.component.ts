import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { SignService } from 'src/app/services/sign.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  constructor(public auth: AngularFireAuth, private router: Router, public signService: SignService) { }

  user: any;

  ngOnInit(): void {
  }

  login() {
    this.signService.login();
    this.router.navigate(['']);
  }

}
