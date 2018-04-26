import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { FirebaseProvider } from './../providers/firebase/firebase';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

/**
 * A generic model that our Master-Detail pages list, create, and delete.
 *
 * Change "Item" to the noun your app will use. For example, a "Contact," or a
 * "Customer," or a "Animal," or something like that.
 *
 * The Items service manages creating instances of Item, so go ahead and rename
 * that something that fits your app as well.
 */
@Injectable()
export class Item {
  author : FirebaseObjectObservable<any> = new FirebaseObjectObservable;
  item : FirebaseObjectObservable<any> = new FirebaseObjectObservable;

  constructor(item: any, author: any) {
    this.author = author;
    this.item = item;
  }

}

export interface Item {
  [prop: string]: any;
}
