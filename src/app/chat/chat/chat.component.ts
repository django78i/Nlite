import { Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

  userList: Observable<any[]>;
  roomList: Observable<any[]>;

  constructor(public userService: UserService, private router: Router, public auth: AngularFireAuth) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        const user$ = this.userService.getCurrentUSer(user);
        this.roomList = this.userService.getRooms(user$);
      }
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  discuss(id) {
    this.router.navigate(['/chatCom', id]);
  }
}
