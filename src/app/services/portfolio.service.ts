import { UserService } from './user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { Portfolio } from './../models/portfolio.model';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PortFolioService {

    portfoliosList: Observable<any[]>
    photosSubject: Subject<any>;
    photos: Observable<any>;

    constructor(private afs: AngularFirestore, private userService: UserService) {

    }


    getUserPortfoliosList(user: Observable<Portfolio>) {
        console.log(user);
        return this.portfoliosList = user.pipe((
            switchMap(user => {
                console.log(user);
                return this.afs.collection('portfolios').doc<Portfolio>(user.uid).collection('projets').valueChanges();
            })
        ))
    }

    createPortfolio(folio, uid) {
        console.log(folio);
        this.afs.collection('portfolios').doc(uid).collection('projets').doc(folio.uid).set(Object.assign({}, folio));
    }

    getPhotos(userUid, folioUid): Observable<any> {
        console.log('getUser');
        this.photosSubject = new BehaviorSubject(null);
        this.photosSubject.next('');
        this.photos = this.photosSubject.pipe(
            switchMap(projets => this.afs.collection('portfolios').doc(userUid).collection('projets').doc<Portfolio>(folioUid).valueChanges())
            , map(projet => projet.photos)
            , tap(data => console.log(data))
        )
        return this.photos;
    }






}