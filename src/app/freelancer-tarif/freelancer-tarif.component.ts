import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-freelancer-tarif',
  templateUrl: './freelancer-tarif.component.html',
  styleUrls: ['./freelancer-tarif.component.scss']
})
export class FreelancerTarifComponent implements OnInit {

  @Input()freelancer : any; 

  constructor() { }

  ngOnInit(): void {
  }

}
