import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
 
@Injectable()
export class FirebaseProvider {
 
  constructor(public afd: AngularFireDatabase) { }
 
  getTipsItems() {
    return this.afd.list('/tipsItems/');
  }
 
  addItem(item) {
    this.afd.list('/tipsItems/').push(item[0]);
    
  }
 
  removeItem(id) {
    this.afd.list('/tipsItems/').remove(id);
  }
}
