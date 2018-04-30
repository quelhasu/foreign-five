import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';


import { User } from '../../providers/providers';
import { MainPage } from '../pages';
import { storage } from 'firebase/app';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  item: any;
  form: FormGroup;

  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test',
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private afAuth: AngularFireAuth,
    public afDatabse: AngularFireDatabase,
    public camera: Camera,
    public formBuilder: FormBuilder, 
  public file: File, public fileChooser: FileChooser) {

      this.form = formBuilder.group({
        profilePic: ['']
      });

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
    
  }

  toast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }

  createProfile() {
    this.afAuth.authState.take(1).subscribe(auth => {
      this.afDatabse.object(`profile/${auth.uid}`).set(this.user)
        .then(() => this.navCtrl.setRoot(MainPage));
    })
  }

  doSignup(user: User) {
    // Attempt to login in through our User service
    this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(data => {
        // this.toast('Success! You\'re signing up');
        this.createProfile();
        // this.navCtrl.push(MainPage);
      })
      .catch(error => {
        console.error(error);
        this.toast(error.message);
      });

    // this.user.signup(this.account).subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {

    //   this.navCtrl.push(MainPage);

    //   // Unable to sign up
    //   let toast = this.toastCtrl.create({
    //     message: this.signupErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }
  getPicture(){
    this.fileChooser.open().then((uri)=>{
      alert(uri);
      
      this.file.resolveLocalFilesystemUrl(uri).then((newUrl)=>{
        alert(JSON.stringify(newUrl));
        
        let dirPath = newUrl.nativeURL;
        let dirPathSegment = dirPath.split('/');
        dirPathSegment.pop();
        dirPath = dirPathSegment.join('/');
        this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async (buffer)=>{
          await this.upload(buffer, newUrl.name);
          alert("File upload.");
        })
      })
    })
  }

  async upload(buffer, name){
    let blob = new Blob([buffer], {type : "images/jpeg, images/png"});

    let storage = firebase.storage();

    storage.ref('images/'+name).put(blob).then((result)=>{
      alert("Done");
    }).catch((err)=>{
      alert(JSON.stringify(err));
    })
  }
}
