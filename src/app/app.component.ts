import { MessagingService } from './services/messaging.service';
import { Formulaire } from './models/form.model';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FormulaireService } from './services/formulaire.service'
import { AngularFireAuth } from '@angular/fire/auth';
// import './utils.rxjs.operators';

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


  constructor(public msg: MessagingService, private _formBuilder: FormBuilder, private formService: FormulaireService, public auth: AngularFireAuth) {

  }

  ngOnInit(): void {
    this.auth.user
      .subscribe(user => {
        this.msg.getPermission(user)
        this.msg.receiveMessages()
      })

  }



}
