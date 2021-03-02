import { CalendrierService } from 'src/app/services/calendrier.services';
import { DialogData } from './../user-profil/user-profil.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-pop-up-user-rdv',
  templateUrl: './pop-up-user-rdv.component.html',
  styleUrls: ['./pop-up-user-rdv.component.scss']
})
export class PopUpUserRdvComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<PopUpUserRdvComponent>, public calenderSer: CalendrierService) { }

  ngOnInit(): void {
    moment.locale('fr');
    console.log(this.data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  delete() {
    this.calenderSer.delete(this.data);
    this.onNoClick();
  }


}
