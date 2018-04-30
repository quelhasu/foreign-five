import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';


@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  dataUser: any;
  uid: any;
  form: FormGroup;
  newItem = [];

  email: any;
  username: any;
  lastname: any;
  firstname: any;
  url: any;


  constructor(public navCtrl: NavController,public navParams: NavParams,  public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, public firebaseProvider: FirebaseProvider) {
    this.form = formBuilder.group({
      profilePic: [''],
      title: ['', Validators.required],
      text: ['', Validators.required],
      category:['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.uid = navParams.get('user_key');
    this.dataUser = navParams.get('dataUser');
    this.dataUser.subscribe(snapshot => {
      this.handleUserData(snapshot);
    });
    console.log("createur : " + this.username);
    console.log("uid : " + this.uid);
  }

  ionViewDidLoad() {

  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    // let addModal = this.modalCtrl.create('ItemCreatePage');
    // addModal.onDidDismiss(item => {
    //   if (item) {
    //     this.items.add(item);
    //   }
    // })
    // addModal.present();
    // console.log(this.title);

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
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

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    else{
      this.newItem.push({
        title : this.form.controls['title'].value,
        text : this.form.controls['text'].value,
        add_date : Date.now(),
        likes : 0,
        comments : 0,
        category : this.form.controls['category'].value,
        author: {
          username : this.username,
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          url: this.url
        }
      });
      this.firebaseProvider.addItem(this.newItem);
      this.newItem = [];
    }
    this.viewCtrl.dismiss(this.form.value);
  }

  handleUserData(snapshot) {
    // console.log(snapshot.username);
    this.firstname = snapshot.firstname;
    this.lastname = snapshot.lastname;
    this.email = snapshot.email;
    this.username = snapshot.username;
    if(snapshot.url != null) this.url =  snapshot.url;
    else this.url = 0;
  }
}
