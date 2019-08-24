import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  patient: Patient;

  constructor(private route: ActivatedRoute,
              private contactsService: ContactsService,
              private ngZone: NgZone) { }

  ngOnInit() {
    this._getPatient();
  }

  private _getPatient() {
    this.route.paramMap.subscribe(params => {
      const resourceName = params.get('id');
      this.ngZone.runOutsideAngular(() => {
        this.contactsService.getContact(resourceName).then((patient: Patient) => {
          this.ngZone.run(() => {
            this.patient = patient;
          });
        });
      });
    });
  }
}
