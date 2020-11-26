import { switchMap, map, tap, finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { PortFolioService } from './../../../services/portfolio.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { DialogData, FreelancerProfilComponent } from '../freelancer-profil/freelancer-profil.component';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
	selector: 'app-pop-edit-folios',
	templateUrl: './pop-edit-folios.component.html',
	styleUrls: ['./pop-edit-folios.component.scss']
})
export class PopEditFoliosComponent implements OnInit {


	photos: Observable<any[]>;
	donnees: any = {
		photos: [
			{
				titre: "nouveaux",
				url: "https://firebasestorage.googleapis.com/v0/b/testmail-ecf8d.appspot.com/o/matmut.jpg?alt=media&token=225a3ac1-0306-4e65-985e-26f3b5e25312",

			}
		]
	}
	photoUpdates: Observable<any>;
	photosSubject: BehaviorSubject<any[]>;
	imageUrl : any;
	uploadPercent: Observable<number>;

	constructor(public dialogRef: MatDialogRef<FreelancerProfilComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder,
		private storage: AngularFireStorage, private userService: UserService, private portfoflioService: PortFolioService) {
	}

	ngOnInit(): void {
		this.photos = this.portfoflioService.getPhotos(this.data.uid, this.data.autre); 

	}


	onNoClick(): void {
		this.dialogRef.close();
	}

	sendModification(url : Observable<any>) {
		url.subscribe(url => {
			console.log(url)
		})
	}


	uploadFile(event) {
		const file = event.target.files[0];
		const filePath = file.name;
		const ref = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);
		this.uploadPercent = task.percentageChanges();
		task.snapshotChanges().pipe(
			finalize(() => this.imageUrl = ref.getDownloadURL())
		 )
		.subscribe()
		this.sendModification( this.imageUrl)
	}




}
