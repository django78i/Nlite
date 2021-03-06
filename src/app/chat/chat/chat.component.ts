import { Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap, share } from 'rxjs/operators';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {

	user: Observable<any>;
	roomList: Observable<any[]>;
	userFormat: any[] = [];

	constructor(public userService: UserService, private router: Router, public auth: AngularFireAuth) {
		this.auth.onAuthStateChanged((user) => {
			if (user) {
				this.user = this.userService.getCurrentUSer(user);
				this.roomList = this.userService.getRooms(this.user)
					.pipe(
						tap(user => {
							this.userFormat = user.map(user => user.user.split(" ").map(n => n[0]).join(""));
							console.log(this.userFormat);
						}),share()
					);
			}
		})
	}

	ngOnInit(): void {
	}

	ngAfterViewInit() {

	}

	discuss(id) {
		console.log(id);
		const val = {
			freeUid: id.freeUid,
			clientId: id.clientUid,
			client: id.user,
			freelance: id.freelancer,
			uid: id.uid,
			photo: id.freePhoto

		}
		this.router.navigate(['/chatCom'], { state: { data: { val } } });
	}


}
