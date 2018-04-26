import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { ListMasterPage } from '../../pages/list-master/list-master';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public afAuth: AngularFireAuth,
    private alertCtrl: AlertController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  alert(message: string){
    this.alertCtrl.create({
      title: 'Info!',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  toast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top'
    }).present();
  }

  // Attempt to login in through our User service
  doLogin(user: User) {
    this.user.email = "ugo.quelhas@devinci.fr";
    this.user.password = "lolxdlolxd";
    this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
    .then(data =>{
      // this.toast('Success! You\'re logged in');
      this.navCtrl.setRoot(MainPage);
    })
    .catch(error =>{
      console.error(error);
      this.toast(error.message);
    });

    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //   this.navCtrl.push(MainPage);
    //   // Unable to log in
    //   let toast = this.toastCtrl.create({
    //     message: this.loginErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }

  // devMode(){
  //   this.toast('Connexion pour dev!');
  //   this.navCtrl.push(MainPage);
  // }

  goSignUp(){
    this.navCtrl.push('SignupPage');
  }
}
