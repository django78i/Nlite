import { UserService } from './user.service';
import { map, share, switchMap, tap } from 'rxjs/operators';
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
    rdvSubject: BehaviorSubject<any>;
    rdv: Observable<any>;

    constructor(private afs: AngularFirestore, private userService: UserService) {
        this.rdvSubject = new BehaviorSubject(null);
        this.rdv = this.rdvSubject;

    }


    getUserPortfoliosList(user: Observable<Portfolio>) {
        return this.portfoliosList = user.pipe(
            switchMap(user => {
                return this.afs.collection('portfolios').doc<Portfolio>(user.uid).collection('projets').valueChanges();
            }), share()
        )
    }

    getFreelancerFolio(uid): Observable<any[]> {
        return this.afs.collection('portfolios').doc<Portfolio>(uid).collection('projets').valueChanges().pipe(
            tap(rdv => console.log(rdv))
        );

    }

    createPortfolio(folio, uid) {
        this.afs.collection('portfolios').doc(uid).collection('projets').doc(folio.uid).set(Object.assign({}, folio));
    }

    getPhotos(userUid, folioUid): Observable<any[]> {
        this.photosSubject = new BehaviorSubject(null);
        this.photosSubject.next('');
        this.photos = this.photosSubject.pipe(
            switchMap(projets => this.afs.collection('portfolios').doc(userUid).collection('projets').doc<Portfolio>(folioUid).valueChanges())
            , map(projet => projet.photos)
            , tap(data => console.log(data))
        )
        return this.photos;
    }


    updateFolio(userUid, folioUid, folio) {
        this.afs.collection('portfolios').doc(userUid).collection('projets').doc(folioUid).update(Object.assign({}, folio));

    }




}