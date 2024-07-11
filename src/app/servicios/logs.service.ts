import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDocs, orderBy, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LogsService
{
  public coleccionTurnos: any[] = [];


  constructor(private firestore: Firestore) { }

  guardarLog(log: any)
  {
    let col = collection(this.firestore, 'logs');
    
    return addDoc(col, {
      date: new Date(),
      email: log.email
    })
  }

  getLogsPorFecha()
  {
    const q = query(collection(this.firestore, "logs"), orderBy("date", "desc"));
    return getDocs(q);
  }
}
