import { PopUpConnectComponent } from './../pop-up-connect/pop-up-connect.component';
import { Portfolio } from './../../../models/portfolio.model';
import { PortFolioService } from './../../../services/portfolio.service';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostListener, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { FreelancerFolioSlideComponent } from '../../freelancer-folio-slide/freelancer-folio-slide.component';
import { tap } from 'rxjs/internal/operators/tap';
import { AngularFireAuth } from '@angular/fire/auth';

export interface DialogData {
	uid: number,
	photos: [],
	titre: string,
	prix: number,
}


@Component({
	selector: 'app-freelancer-profil-client',
	templateUrl: './freelancer-profil-client.component.html',
	styleUrls: ['./freelancer-profil-client.component.scss']
})
export class FreelancerProfilClientComponent implements OnInit, OnDestroy {

	public demo1TabIndex = 0;
	demo1TabIndexSubscription: Subscription;
	freelancer$: Observable<User>
	params: any;
	backgroundColorToggle = "primary";
	portfolioList: Observable<any[]>;
	data: any;
	isAuth: boolean = false;
	user: any;
	userSub: Subscription;


	constructor(public dialog: MatDialog, private eleRef: ElementRef, private route: ActivatedRoute,
		private userService: UserService, private portfolioService: PortFolioService, private router: Router,
		public auth: AngularFireAuth,) {
		this.route.params.subscribe((params) => {
			this.params = params.id;
			this.freelancer$ = this.userService.getSingleContact(params.id);
			this.portfolioList = this.portfolioService.getFreelancerFolio(params.id);
		}
		)
		this.portfolioService.rdvSubject.next(false);
		this.auth.onAuthStateChanged((user) => {
			this.isAuth = user ? true : false;
		})

	}

	ngOnInit(): void {
		this.demo1TabIndexSubscription = this.portfolioService.rdv.subscribe(num => {
			if (num != true) {
				this.demo1TabIndex = 0
			} else {
				this.demo1TabIndex = 1
			}
		});
	}


	openRoom(contactUid) {
		if (!this.isAuth) {
			this.openDialog();
		} else {
			this.userSub = this.userService.user.subscribe((user) => {
				this.userService.openRoom(contactUid);
				const val = {
					freeUid: contactUid.uid,
					clientId: user.uid,
					client: user.displayName,
					freelance: contactUid.displayName,
					uid: contactUid.uid + user.uid,
					freeImage: contactUid.image
				}
				this.router.navigate(['chatCom'], { state: { data: { val } } });
			})
		}
	}


	vue() {
		const texte = document.getElementById('description');
		const plus = document.getElementById('plus');
		texte.style.height = 'auto';
		plus.style.display = 'none';
	}

	openDialog(): void {
		const dialogRef = this.dialog.open(PopUpConnectComponent, {
			maxWidth: '90%',
			width: '90%',
			height: '303px',
			panelClass: 'custom',
		});
	}

	ngOnDestroy() {
		this.userSub ? this.userSub.unsubscribe() : '';
	}


}
