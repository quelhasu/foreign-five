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
  category_selected = '';

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, public firebaseProvider: FirebaseProvider) {
    this.currentItems = this.items.query();
    this.cards = new Array(10);
    this.tipsItems = this.firebaseProvider.getTipsItems();
    this.category = 'all';
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
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
    console.log("Ajout d'un element");
    this.navCtrl.push('ItemCreatePage');
  }


  getDate(item){
    return Date.now();
  }

}
