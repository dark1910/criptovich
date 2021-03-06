import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AngularFireAuth} from "angularfire2/auth";
import {Router} from "@angular/router";

import {ValidationsService} from "../shared/services/validations.service";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'ccc-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  submitted = false;
  registrationForm: FormGroup;

  constructor(
      private router: Router,
      private validationsService: ValidationsService,
      public firebaseAuth: AngularFireAuth,
      private authService: AuthService
  ) {
    authService.isAuthorized();
  }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }


  isFieldValid(field: string) {
    return this.validationsService.validateFields(this.registrationForm.get(field));
  }

  onSubmit() {

    const name = this.registrationForm.value.name,
        email = this.registrationForm.value.email,
        password = this.registrationForm.value.password;

    this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((success) => {
          console.log(success);
          success.updateProfile({
            displayName: name
          });
          this.router.navigate(['/system','rich-list']);
        })
        .catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode,errorMessage);
          if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
  }
}
