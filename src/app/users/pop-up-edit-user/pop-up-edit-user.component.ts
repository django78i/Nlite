import { of } from 'rxjs/internal/observable/of';
import { UserService } from './../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, switchMap } from 'rxjs/operators';
import { DialogData, FreelancerProfilComponent } from '../freelancers/freelancer-profil/freelancer-profil.component';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';

@Component({
	selector: 'app-pop-up-edit-user',
	templateUrl: './pop-up-edit-user.component.html',
	styleUrls: ['./pop-up-edit-user.component.scss']
})
export class PopUpEditUserComponent implements OnInit {

	freelancerForm: FormGroup;
	imageUrl : any;
	downLoadUrl : any;
	uploadPercent: Observable<number>;

	constructor(public dialogRef: MatDialogRef<FreelancerProfilComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder,
		private storage: AngularFireStorage, private userService : UserService) { }

	ngOnInit(): void {
		this.initForm();
		// this.imageUrl = this.data.photo;
	}

	initForm() {

		this.freelancerForm = this.formBuilder.group({
			uid: [''],
			name: [''],
			photo: [''],
			description: [''],
			categories: this.formBuilder.array([])
		})
		this.freelancerForm.patchValue(this.data);
		this.freelancerForm.setControl('categories', this.setExistingCateg(this.data.categories));
	}

	getCategories() {
		return this.freelancerForm.get('categories') as FormArray;
	}

	onAddCategories() {
		const newrowControl = this.formBuilder.control(null);
		this.getCategories().push(newrowControl);
	}

	setExistingCateg(categ): FormArray {
		const formArray = new FormArray([]);
		categ.forEach((r) => {
			formArray.push(this.formBuilder.control(r));
		});
		return formArray;
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


	sendMofication() {

		this.imageUrl.subscribe((images)=>{
			const formValue = this.freelancerForm.value;
			const freelancerHead = {
				uid: this.data.uid,
				name: formValue['name'],
				image: images,
				description: formValue['description'],
				categories: formValue['categories']
			}
			this.userService.upDateUser(freelancerHead);
		})

	}

}
