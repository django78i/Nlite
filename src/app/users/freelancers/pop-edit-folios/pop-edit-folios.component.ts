import { switchMap, map, tap, finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { PortFolioService } from './../../../services/portfolio.service';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { DialogData, FreelancerProfilComponent } from '../freelancer-profil/freelancer-profil.component';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { ThrowStmt } from '@angular/compiler';

@Component({
	selector: 'app-pop-edit-folios',
	templateUrl: './pop-edit-folios.component.html',
	styleUrls: ['./pop-edit-folios.component.scss']
})
export class PopEditFoliosComponent implements OnInit {
	@ViewChild('usefulSwiper', { static: false }) usefulSwiper: SwiperComponent;
	@ViewChild('takeInput', { static: true })

	photoss: any[] = [];
	imageUrl: any;
	uploadPercent: Observable<number>;
	url: any;
	config: SwiperOptions = {
		pagination: { el: '.swiper-pagination', clickable: true },
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
	};
	disabled: boolean = true;
	folio: FormGroup;
	photosTemp: any[] = [];

	InputVar: ElementRef;

	constructor(public dialogRef: MatDialogRef<FreelancerProfilComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder,
		private storage: AngularFireStorage, private userService: UserService, private portfoflioService: PortFolioService) {
	}

	ngOnInit(): void {
		const donn = this.portfoflioService.getPhotos(this.data.uid, this.data.folioUid);
		donn.pipe(
			tap(photo => this.photoss = photo)
		).subscribe();
		this.initForm();
	}

	initForm() {
		this.folio = this.formBuilder.group({
			nom: '',
			prixMinimum: '',
			description: ''
		})
		this.initValue();
	}

	initValue() {
		this.folio.patchValue({
			nom: this.data.folio.titre,
			prixMinimum: this.data.folio.prixMinimum,
			description: this.data.folio.description
		})
	}

	deletePhoto(url) {
		console.log(url);
		var photo: any[] = [];
		const index = this.photoss.findIndex(photos => photos == url);
		this.photoss.splice(index, 1);
	}


	onNoClick(): void {
		this.photosTemp.forEach(photo => this.storage.storage.refFromURL(photo).delete());
		this.dialogRef.close();
	}

	saveUrl(url: Observable<any>) {
		url.subscribe(url => {
			this.url = url;
		})
	}

	savePhoto() {
		var photoList: any[] = []
		let folio;
		this.photoss.push(this.url);
		this.photosTemp.push(this.url);
		console.log(folio);
		this.InputVar.nativeElement.value = "";
	}


	uploadFile(event) {
		const file = event.target.files[0];
		const filePath = file.name;
		const ref = this.storage.ref(filePath);
		const task = this.storage.upload(filePath, file);
		this.uploadPercent = task.percentageChanges();
		task.snapshotChanges().pipe(
			finalize(() => {
				this.imageUrl = ref.getDownloadURL();
				this.disabled = false;
				this.saveUrl(this.imageUrl);
			})
		)
			.subscribe()
	}
	sendMofication() {
		const formVal = this.folio.value;
		const folio = {
			...this.data.folio,
			photos: this.photoss,
			titre: formVal.nom,
			prixMinimum: formVal.prixMinimum,
			description: formVal.description
		}
		console.log(folio);
		this.portfoflioService.updateFolio(this.data.uid, this.data.folioUid, folio)
	}




}
