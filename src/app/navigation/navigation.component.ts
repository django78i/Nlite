import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignService } from '../services/sign.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isAuth: boolean = false;

  user: Observable<any>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private router: Router, private afs: AngularFirestore, private breakpointObserver: BreakpointObserver, public auth: AngularFireAuth, public signService: SignService, public userService: UserService) {
  }


  ngOnInit(): void {
    this.state();
    // this.user = this.userService.user;
  }

  logout() {
    this.signService.logout();
  }

  state() {
    this.auth.onAuthStateChanged((user) => {
      this.isAuth = user ? true : false;
      console.log(user);
      if(user){
        this.user = this.afs.collection<User>('users').doc(user.uid).valueChanges();
      }
    })
  }

  profil(user){
    console.log(user);
    user === 'freelancer' ?  this.router.navigate(['freelancerProfil']) : this.router.navigate(['clientProfil']) 
  }


}
