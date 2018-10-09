import { NgModule } from '@angular/core';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuthModule } from 'angularfire2/auth';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        AngularFireAuthModule
    ],
    exports: [],
    declarations: [ 
        SignupComponent,
        LoginComponent,
    ]
})
export class AuthModule { }
