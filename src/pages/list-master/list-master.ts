import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, ToastController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';

import { Item } from '../../models/item';
import { Items, User } from '../../providers/providers';
import { AngularFireAuth } from 'angularfire2/auth';
// import { User } from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  profileData: Observable<any>;
  currentItems: Item[];
  cards: any;
  category: string = 'gear';
  tipsItems: FirebaseListObservable<any[]>;
  category_selected = '';
  user_key: any;
  authors: any[] = [];

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, 
    public firebaseProvider: FirebaseProvider, public afAuth: AngularFireAuth, public toastCtrl: ToastController,
    public afDatabse: AngularFireDatabase) {

    this.currentItems = this.items.query();
    this.cards = new Array(10);
    this.tipsItems = this.firebaseProvider.getTipsItems();
    this.category = 'all';
    this.tipsItems.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.authors.push(this.afDatabse.object(`profile/${snapshot.author}`));
      })
    })
  }

  toast(message: string){
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    // var user = this.afAuth.auth.currentUser;
    this.afAuth.authState.take(1).subscribe(data =>{
      if(data && data.email && data.uid){
        this.profileData= this.afDatabse.object(`profile/${data.uid}`);
        this.profileData.subscribe(snapshot => {
          this.toast(`Success! You\'re logged in ${snapshot.firstname} ${snapshot.lastname} !`);
          this.user_key = data.uid;
        })

      }
      else{
        this.toast("Authentification problem!");
      }
    })
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(id) {
    this.firebaseProvider.removeItem(id);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

  addItemBtn(){
    this.navCtrl.push('ItemCreatePage', {
      user_key: this.user_key
    });
  }


  getDate(item){
    return Date.now();
  }
  
  getAuthor(author){
    console.log(author);
  }

}
