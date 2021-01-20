import { Portfolio } from './../../../models/portfolio.model';
import { PortFolioService } from './../../../services/portfolio.service';
import { Freelancer } from './../../../models/freelancer.model';
import { Observable } from 'rxjs';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpEditUserComponent } from '../../pop-up-edit-user/pop-up-edit-user.component';
import { PopEditFoliosComponent } from '../pop-edit-folios/pop-edit-folios.component';
import { PopUpCreateFolioComponent } from '../pop-up-create-folio/pop-up-create-folio.component';


export interface DialogData {
	uid: string,
	name: string;
	photo: string;
	description: string;
	folioUid: string;
	folio: any;
	categories: []
}


@Component({
	selector: 'app-freelancer-profil',
	templateUrl: './freelancer-profil.component.html',
	styleUrls: ['./freelancer-profil.component.scss']
})
export class FreelancerProfilComponent implements OnInit {

	user: Observable<any>
	portfolioList: Observable<any>
	freelancer: Freelancer;
	backgroundColorToggle = "primary";


	constructor(private route: ActivatedRoute, public auth: AngularFireAuth, private userService: UserService,
		private storage: AngularFireStorage, public dialog: MatDialog, private porfolioService: PortFolioService) {

		this.auth.onAuthStateChanged((user) => {
			if (user) {
				this.user = this.userService.getCurrentUSer(user);
				this.portfolioList = this.porfolioService.getUserPortfoliosList(this.user);
				this.porfolioService.portfoliosList.subscribe((data) => {
					console.log(data);
				})
			}
		})


	}

	ngOnInit(): void {

	}

	openDialog(user): void {
		console.log(user);
		const dialogRef = this.dialog.open(PopUpEditUserComponent, {
			width: '550px',
			height: '600px',
			data: { uid: user.uid, name: user.displayName, photo: user.image ? user.image : '', description: user.description ? user.description : '', categories: user.categories ? user.categories : '' }
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			//   this.animal = result;

			console.log(result)
		});
	}
	openFolio(user, folioUid, folio): void {
		console.log(user);
		const dialogRef = this.dialog.open(PopEditFoliosComponent, {
			maxWidth : '99vw',
			width: '95vw',
			height: '100vh',
			data: { uid: user, folioUid: folioUid, folio: folio }
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			//   this.animal = result;

			console.log(result)
		});
	}

	createFolio(uid) {
		const dialogRef = this.dialog.open(PopUpCreateFolioComponent, {
			width: '550px',
			// height: '600px',
			data: { uid: uid }
		});

	}

	vue(){
		const texte = document.getElementById('description');
		const plus = document.getElementById('plus');
		texte.style.height = 'auto';
		plus.style.display = 'none';
	}

}



