import { PortFolioService } from './../../../services/portfolio.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Portfolio } from './../../../models/portfolio.model';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core/public-api';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { UserService } from 'src/app/services/user.service';
import { DialogData, FreelancerProfilComponent } from '../freelancer-profil/freelancer-profil.component';

@Component({
	selector: 'app-pop-up-create-folio',
	templateUrl: './pop-up-create-folio.component.html',
	styleUrls: ['./pop-up-create-folio.component.scss']
})
export class PopUpCreateFolioComponent implements OnInit {

	folioForm: FormGroup;
	imageUrl: any;
	uploadPercent: Observable<number>;
	value: Observable<number>;

	color: ThemePalette = 'primary';
	mode: ProgressSpinnerMode = 'determinate';

	constructor(public dialogRef: MatDialogRef<FreelancerProfilComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder,
		private storage: AngularFireStorage, private userService: UserService, private afs: AngularFirestore,
		private portFolioService: PortFolioService) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.folioForm = this.formBuilder.group({
			miniature: [''],
			titre: [''],
			description: ['']
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
	}

	onNoClick(): void {
		this.dialogRef.close();
	}


	createFolio() {
		const formValue = this.folioForm.value;
		this.imageUrl.subscribe((url) => {
			const id = this.afs.createId();
			const newFolio = new Portfolio(
				id,
				url,
				formValue['titre'],
				formValue['description'],
				[]
			)
			this.portFolioService.createPortfolio(newFolio, this.data.uid);
		})
	}


}
