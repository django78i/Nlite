import { Router } from '@angular/router';
import { SignService } from 'src/app/services/sign.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-pop-up-connect',
	templateUrl: './pop-up-connect.component.html',
	styleUrls: ['./pop-up-connect.component.scss']
})
export class PopUpConnectComponent implements OnInit {

	constructor(public signService: SignService, public dialogRef: MatDialogRef<PopUpConnectComponent>, private router: Router) { }

	ngOnInit(): void {
	}


	login() {
		this.signService.login();
		this.dialogRef.close();
	}

	mail() {
		this.dialogRef.close();
		this.router.navigate(['/mail']);
	}
}
