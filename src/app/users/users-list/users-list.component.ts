import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  usersList: Observable<User[]>;
  curentUser: Observable<User>;
  freelancerList: Observable<User[]>;

  constructor(private userService: UserService, private auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.curentUser = this.userService.getCurrentUSer(user)
      }
    })
    this.usersList = this.userService.getUsers();
    this.freelancerList = this.userService.getFreelancers();
  }

  openRoom(contactUid) {
    this.userService.openRoom(contactUid);
    this.router.navigate(['chatCom', contactUid.uid]);
  }

  profileNavigate(contactUid) {
    this.router.navigate(['freelanceClientProfil', contactUid.uid])
  }

}
