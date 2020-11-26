import { FormBuilder } from '@angular/forms';
import { SignService } from './../../services/sign.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
	firstFormGroup: any;


	constructor(private _formBuilder: FormBuilder, public signService: SignService, 
				public auth: AngularFireAuth, private router: Router) { }

	ngOnInit(): void {
		this.initForm();
	}


	initForm() {
		this.firstFormGroup = this._formBuilder.group({
			displayName: [''],
			email: [''],
			password: ['']
		});

	}

	createUser() {
		const formValue = this.firstFormGroup.value;
		this.signService.userEmailPassword(formValue);
		this.router.navigate(['']);
	}

	logout() {
        this.auth.signOut();
    }



}
