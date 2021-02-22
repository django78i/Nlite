import { AngularFirestore } from '@angular/fire/firestore';
import { MessgesService } from './../../services/messages.service';
import { User } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { Message } from './../../models/message.model';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/internal/operators/map';


@Component({
	selector: 'app-chat-com',
	templateUrl: './chat-com.component.html',
	styleUrls: ['./chat-com.component.scss']
})
export class ChatComComponent implements OnInit, AfterViewInit {


	contact$: Observable<User>;
	messages: Observable<Message[]>;
	params: any;
	donnee: any;
	discussion: any;
	discussionList: any;
	discusSubject = new Subject;
	uid: string;
	users: any;
	tempsEnMs = Date.now()
	container: HTMLElement;

	constructor(private route: ActivatedRoute, public auth: AngularFireAuth,
		public messageService: MessgesService, public userService: UserService, private afs: AngularFirestore,
		private elem: ElementRef) {

		this.auth.onAuthStateChanged((user) => {
			this.userService.user.subscribe((user) => {
				console.log(user);
				this.users = user;
				
			})
		});

		this.params = this.route.paramMap
			.pipe(map(() => window.history.state),
				tap(param => {
					this.donnee = param.data.val;
					this.messages = this.messageService.getMessages(this.donnee.uid);
				})
			);
	}

	ngOnInit(): void {


	}

	ngAfterViewInit() {
	}

	envoyer() {
		const keyPair = this.users.status == 'freelancer' ? this.users.uid + this.donnee.clientId : this.donnee.freeUid + this.users.uid;
		console.log(keyPair);
		const discuss = new Message(
			this.users.uid,
			this.users.status == 'freelancer' ? this.donnee.freelance : this.donnee.client,
			this.users.status == 'freelancer' ? this.donnee.clientId : this.donnee.freeUid,
			this.users.displayName,
			this.discussion,
			this.tempsEnMs,
			keyPair,
			''
		)
		console.log(discuss);
		this.messageService.saveMessage(discuss, this.params, this.users.uid);
		this.discussion = '';
	}

	position(message) {
		if (message == this.users.uid) {
			return 'flex-start';
		} else return 'flex-end';
	}

}
