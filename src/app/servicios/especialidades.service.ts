import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Especialidad } from '../entidades/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  public coleccionEspecialidades: any[] = [];
  public especialidades: any[] = [];
  public countEspecialidades: number = 0;
  private sub!:Subscription;
  

  // BehaviorSubject para notificar sobre el estado de la operación de guardado
  private guardarEspecialidadSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // BehaviorSubject para notificar sobre el estado de la operación de obtención de especialidades
  public obtenerEspecialidadesSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(private firestore: Firestore){}

  ngOnDestroy(): void {

    this.sub.unsubscribe();

 }

  guardarEspecialidad(especialidad: Especialidad)
  {
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, {
      nombre: especialidad.nombre
    }).then(() => {
      console.log('Especialidad guardada con éxito');
      this.guardarEspecialidadSubject.next(true);
    }).catch(error => {
      console.error('Error al guardar la especialidad: ', error);
      this.guardarEspecialidadSubject.next(false);
    });
  }

  obtenerEspecialidades()
  {
    let col = collection(this.firestore, 'especialidades');
    const observable = collectionData(col, {idField: 'id'});

    this.sub = observable.subscribe((respuesta) =>{
      this.coleccionEspecialidades= respuesta;
      this.countEspecialidades= this.coleccionEspecialidades.length;
      this.obtenerEspecialidadesSubject.next(true);
    })

  }

  eliminarEspecialidad(id: string) {
    const especialidadDocRef = doc(this.firestore, `especialidades/${id}`);
    deleteDoc(especialidadDocRef).then(() => {
      console.log('Especialidad eliminada con éxito');
    }).catch(error => {
      console.error('Error al eliminar la especialidad: ', error);
    });
  }
}
