import { switchMap } from 'rxjs/operators';
import { Message } from './../models/message.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class MessgesService {

    messageList: Observable<Message[]>;
    user: any;

    constructor(private userService: UserService, private afs: AngularFirestore, public auth: AngularFireAuth) {
    }

    getMessages(contact):Observable<Message[]> {
        this.messageList = this.userService.user.pipe(
            switchMap(user=>{
                return this.afs.collection('users').doc(user.uid).collection('rooms').doc(contact).collection<Message>('messages', ref => ref.orderBy('timestamp')).valueChanges()
            })
        )
        return this.messageList;
    }


    saveMessage(message, contactId, userId) {
        const id = this.afs.createId();
        this.afs.collection('users').doc(userId).collection('rooms').doc(contactId).collection('messages').doc(id).set(Object.assign({}, message));
        this.afs.collection('users').doc(contactId).collection('rooms').doc(userId).collection('messages').doc(id).set(Object.assign({}, message));
    }


}

