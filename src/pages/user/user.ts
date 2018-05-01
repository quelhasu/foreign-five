import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';

import { Items } from '../../providers/providers';
import { Item } from '../../models/item';


/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  user: any;
  category: string = 'gear';
  tipsItems: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, navParams: NavParams, user: Items, public firebaseProvider: FirebaseProvider) {
    this.user = navParams.get('user');
    console.log(this.user);
    this.category = 'all';
    this.tipsItems = this.firebaseProvider.getTipsItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }

}
