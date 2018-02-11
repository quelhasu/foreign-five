import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../../providers/firebase/firebase';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  cards: any;
  category: string = 'gear';
  tipsItems: FirebaseListObservable<any[]>;
  newItem = [];
  title = '';
  text = '';

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, public firebaseProvider: FirebaseProvider) {
    this.currentItems = this.items.query();
    this.cards = new Array(10);
    this.tipsItems = this.firebaseProvider.getTipsItems();
  }

  /**
   * The view loaded, let's query our items for the list
   */
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
    this.newItem.push({
      title : this.title,
      text : this.text,
      add_date : Date.now(),
      likes : 0,
      comments : 0
    });
    this.firebaseProvider.addItem(this.newItem);
    this.newItem = [];
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

  getDate(item){
    return Date.now();
  }
}
