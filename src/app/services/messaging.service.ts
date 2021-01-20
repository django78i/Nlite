import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import { Subject } from 'rxjs';
import '@firebase/messaging';

@Injectable({
	providedIn: 'root'
})
export class MessagingService {

	private messaging = firebase.messaging();
	private messageSource = new Subject();
	currentMessage = this.messageSource.asObservable();

	constructor(private afs: AngularFirestore) { }


	getPermission(user) {
		Notification.requestPermission()
			.then(() => {
				console.log('Notification permission granted');
				return this.messaging.getToken()
			})
			.then(token => this.saveToken(user, token))
			.catch(err => console.log(err, 'Unable to get permission'))
	}

	receiveMessages(){
		this.messaging.onMessage(payload=>{
			console.log('Message received', payload);
			this.messageSource.next(payload)
		});
	}

	private saveToken(user, token):void{
		const currentTokens = user.fcmTokens || {}
		console.log(currentTokens, token)

		if(!currentTokens[token]){
			const userRef = this.afs.collection('users').doc(user.uid)
			const tokens = {...currentTokens, [token]:true}
			userRef.update({fcmTokens : tokens})
		}

	}
}
