import { AngularFirestore } from '@angular/fire/firestore';
import { MessgesService } from './../../services/messages.service';
import { SignService } from 'src/app/services/sign.service';
import { User } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { Message } from './../../models/message.model';
import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
	selector: 'app-chat-com',
	templateUrl: './chat-com.component.html',
	styleUrls: ['./chat-com.component.scss']
})
export class ChatComComponent implements OnInit, AfterViewInit {


	contact$: Observable<User>;
	messages: Observable<Message[]>;
	params: any;

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

		this.route.params.subscribe((params) => {
			this.params = params.id,
				this.contact$ = this.userService.getSingleContact(params.id);
			this.auth.onAuthStateChanged((user) => {
				this.messages = this.messageService.getMessages(params.id);
				this.userService.user.subscribe((user) => {
					this.users = user;
				})
			})
		})
	}

	ngOnInit(): void {


	}

	ngAfterViewInit() {
	}

	envoyer() {

		this.contact$.pipe(
			tap(contact => {
				const keyPair = this.users.status == 'freelancer' ? this.users.uid + contact.uid : contact.uid + this.users.uid;
				console.log(keyPair);
				const discuss = new Message(
					this.users.uid,
					contact.displayName,
					contact.uid,
					this.users.displayName,
					this.discussion,
					this.tempsEnMs,
					keyPair,
					''
				)
				console.log(discuss);
				this.messageService.saveMessage(discuss, this.params, this.users.uid);
				this.discussion = '';
			})
		).subscribe();
	}

	position(message) {
		if (message == this.users.uid) {
			return 'flex-start';
		} else return 'flex-end';
	}

}
