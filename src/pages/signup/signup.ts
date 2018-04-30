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
  image: any;

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
    public formBuilder: FormBuilder) {

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
    this.afAuth.authState.take(1).subscribe(async auth => {
      let storage = firebase.storage();
      const pictures = storage.ref(`pictures/${auth.uid}`+".jpg");
      await pictures.putString(this.image, 'data_url');
      let pictureURL = pictures.getDownloadURL().toString();
      
      await pictures.getDownloadURL().then((result)=>{
        this.user.changeProfilPic(result, pictures.fullPath);
      })

      this.afDatabse.object(`profile/${auth.uid}`).set(this.user)
        .then(() => {

          let user = firebase.auth().currentUser;
          user.updateProfile({
            displayName: this.user.username,
            photoURL: pictureURL
          });

          this.navCtrl.setRoot(MainPage)
        });
    })
  }

  doSignup(user: User) {
    this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
      .then(data => {
        this.createProfile();
      })
      .catch(error => {
        console.error(error);
        this.toast(error.message);
      });
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  async takePhoto() {
    try {
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 500,
        targetWidth: 500,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }

      const result = await this.camera.getPicture(options);
      const image = `data:image/jpeg;base64,${result}`;
      this.image = image;

      await this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + result });
    }
    catch(e){
      console.error(e);
    }
  }
}