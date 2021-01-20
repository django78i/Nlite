import { UserService } from './../../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';

interface Unite {
  value: string;
  viewValue: string;
}
interface Mode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-rdv',
  templateUrl: './edit-rdv.component.html',
  styleUrls: ['./edit-rdv.component.scss']
})

export class EditRdvComponent implements OnInit {

  @Input() freelancer: any;
  dateForm: FormGroup;
  unite: Unite[] = [
    { value: 'minute', viewValue: 'minutes' },
    { value: 'heure', viewValue: 'heures' },
  ];
  mode: Mode[] = [
    { value: 'domicile uniquement', viewValue: 'domicile uniquement' },
    { value: 'déplacement uniquement', viewValue: 'déplacement uniquement' },
    { value: 'domicile et déplacement', viewValue: 'domicile et déplacement' },
  ];

  jourFerie: string[] = ['lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];


  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
    // this.JourFerie = stringify() ;
  }

  initForm() {
    this.dateForm = this.formBuilder.group({
      valeur: '',
      unite: '',
      jourFerie: '',
      valDelai: '',
      uniteDelai: '',
      validationAuto: '',
      mode: ''
    })
    this.initValue();
  }

  initValue() {
    this.dateForm.patchValue({
      valeur: this.freelancer.creneau.valeur,
      unite: this.freelancer.creneau.unite,
      valDelai: this.freelancer.delai ? this.freelancer.delai.valeur : [],
      uniteDelai: this.freelancer.delai ? this.freelancer.delai.unite : [],
      jourFerie: this.freelancer.jourRepos,
      validationAuto: this.freelancer.validationAuto ? this.freelancer.validationAuto : false,
      mode: this.freelancer.modeRdv
    });
    // this.dateForm['jourFerie'].patchValue(this.freelancer.jourRepos)
  }

  sendMofication() {
    const formVal = this.dateForm.value;
    const free = {
      ...this.freelancer,
      creneau: {
        valeur: formVal.valeur,
        unite: formVal.unite
      },
      delai: {
        valeur: formVal.valDelai,
        unite: formVal.uniteDelai
      },
      jourRepos: formVal.jourFerie,
      validationAuto: formVal.validationAuto,
      modeRdv: formVal.mode
    }
    console.log(free);
    this.userService.upDateUser(free);
  }



}
