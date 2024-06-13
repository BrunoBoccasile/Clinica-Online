import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Paciente } from '../entidades/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  public coleccionPacientes: any[] = [];
  public pacientes: any[] = [];
  public countPacientes: number = 0;
  private sub!:Subscription;
  

  // BehaviorSubject para notificar sobre el estado de la operación de guardado
  private guardarPacienteSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // BehaviorSubject para notificar sobre el estado de la operación de obtención de pacientes
  public obtenerPacientesSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(private firestore: Firestore){}

  ngOnDestroy(): void {

    this.sub.unsubscribe();

 }

  guardarPaciente(paciente: Paciente)
  {
    let col = collection(this.firestore, 'pacientes');
    addDoc(col, {
      mail: paciente.mail,
      dni: paciente.dni,
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      edad: paciente.edad,
      obraSocial: paciente.obraSocial    
    }).then(() => {
      console.log('Paciente guardado con éxito');
      this.guardarPacienteSubject.next(true);
    }).catch(error => {
      console.error('Error al guardar el paciente: ', error);
      this.guardarPacienteSubject.next(false);
    });
  }

  obtenerPacientes()
  {
    let col = collection(this.firestore, 'pacientes');
    const observable = collectionData(col, {idField: 'id'});

    this.sub = observable.subscribe((respuesta) =>{
      this.coleccionPacientes= respuesta;
      this.countPacientes= this.coleccionPacientes.length;
      this.obtenerPacientesSubject.next(true);
    })

  }

  eliminarPaciente(id: string) {
    const pacienteDocRef = doc(this.firestore, `pacientes/${id}`);
    deleteDoc(pacienteDocRef).then(() => {
      console.log('Paciente eliminado con éxito');
    }).catch(error => {
      console.error('Error al eliminar el paciente: ', error);
    });
  }
}
