import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormulaireService } from '../services/formulaire.service';
import { Subject, Subscription } from 'rxjs';
import { Formulaire } from '../models/form.model';


@Component({
  selector: 'app-mail-sending',
  templateUrl: './mail-sending.component.html',
  styleUrls: ['./mail-sending.component.scss']
})
export class MailSendingComponent implements OnInit {
  firstFormGroup: any;
  isChecked: any;
  

  constructor(public _formBuilder: FormBuilder, public formService : FormulaireService) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      nom: [''],
      subscribedToMailingList: ['', Validators.required],
      mail: ['']
    });

  }

  activer() {
    const formValue = this.firstFormGroup.value;
    this.isChecked = formValue['mailActive'];
  }


  onSubmitForm() {
    const formValue = this.firstFormGroup.value;
    const form = new Formulaire(
      formValue['nom'],
      formValue['subscribedToMailingList'],
      formValue['mail']
    )
    // this.formService.onSubmitForm(form);
  }


  

}
