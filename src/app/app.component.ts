import { Formulaire } from './models/form.model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FormulaireService } from './services/formulaire.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'testMailing';

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;
  isChecked = false;
  checkedSubject = Subject;
  checkSubcription = Subscription;


  constructor(private _formBuilder: FormBuilder, private formService: FormulaireService) {

  }

  ngOnInit(): void {
  }



}
