import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Especialista } from '../entidades/especialista';

@Injectable({
  providedIn: 'root'
})
export class EspecialistasService
{
  public coleccionEspecialistas: any[] = [];
  public especialistas: any[] = [];
  public countEspecialistas: number = 0;
  private sub!: Subscription;


  // BehaviorSubject para notificar sobre el estado de la operación de guardado
  private guardarEspecalistaSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // BehaviorSubject para notificar sobre el estado de la operación de obtención de pacientes
  public obtenerEspecialistasSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private firestore: Firestore) { }

  ngOnDestroy(): void
  {

    this.sub.unsubscribe();

  }

  guardarEspecialista(especialista: Especialista)
  {
    let col = collection(this.firestore, 'especialistas');
    addDoc(col, {
      mail: especialista.mail,
      dni: especialista.dni,
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      especialidad: especialista.especialidad,
      estado: "pendiente"
    }).then(() =>
    {
      console.log('Especialista guardado con éxito');
      this.guardarEspecalistaSubject.next(true);
    }).catch(error =>
    {
      console.error('Error al guardar el especialista: ', error);
      this.guardarEspecalistaSubject.next(false);
    });
  }

  obtenerEspecialistas()
  {
    let col = collection(this.firestore, 'especialistas');
    const observable = collectionData(col, { idField: 'id' });

    this.sub = observable.subscribe((respuesta) =>
    {
      this.coleccionEspecialistas = respuesta;
      this.countEspecialistas = this.coleccionEspecialistas.length;
      this.obtenerEspecialistasSubject.next(true);
    })

  }

  eliminarEspecialista(id: string)
  {
    const especialistaDocRef = doc(this.firestore, `especialistas/${id}`);
    deleteDoc(especialistaDocRef).then(() =>
    {
      console.log('Especialista eliminado con éxito');
    }).catch(error =>
    {
      console.error('Error al eliminar el especialista: ', error);
    });
  }

  aprobarEspecialista(id: string) {
    const especialistaDocRef = doc(this.firestore, `especialistas/${id}`);
    updateDoc(especialistaDocRef, { estado: 'aprobado' }).then(() => {
      console.log('Especialista aprobado con éxito');
    }).catch(error => {
      console.error('Error al aprobar el especialista: ', error);
    });
  }

  desaprobarEspecialista(id: string) {
    const especialistaDocRef = doc(this.firestore, `especialistas/${id}`);
    updateDoc(especialistaDocRef, { estado: 'pendiente' }).then(() => {
      console.log('Especialista desaprobado con éxito');
    }).catch(error => {
      console.error('Error al desaprobar el especialista: ', error);
    });
  }
}
