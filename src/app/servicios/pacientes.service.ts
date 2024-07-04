import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Paciente } from '../entidades/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacientesService
{
  public coleccionPacientes: any[] = [];
  public pacientes: any[] = [];
  public countPacientes: number = 0;
  private sub!: Subscription;


  // BehaviorSubject para notificar sobre el estado de la operación de guardado
  private guardarPacienteSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // BehaviorSubject para notificar sobre el estado de la operación de obtención de pacientes
  public obtenerPacientesSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private firestore: Firestore) { }

  ngOnDestroy(): void
  {

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
    }).then(() =>
    {
      console.log('Paciente guardado con éxito');
      this.guardarPacienteSubject.next(true);
    }).catch(error =>
    {
      console.error('Error al guardar el paciente: ', error);
      this.guardarPacienteSubject.next(false);
    });
  }

  obtenerPacientePorId(id: string)
  {
    const pacienteDocRef = doc(this.firestore, `pacientes/${id}`);
    return getDoc(pacienteDocRef).then(doc =>
    {
      if (doc.exists())
      {
        return {
          id: doc.id,
          ...doc.data()
        } as Paciente;
      } else
      {
        console.log('No existe el documento');
        return null;
      }
    }).catch(error =>
    {
      console.error('Error al obtener el paciente por ID: ', error);
      return null;
    });
  }

  obtenerPacientePorEmail(email: string): Promise<Paciente | null>
  {
    const pacientesColRef = collection(this.firestore, 'pacientes');
    const q = query(pacientesColRef, where('mail', '==', email));

    return getDocs(q).then(querySnapshot =>
    {
      if (!querySnapshot.empty)
      {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Paciente;
      } else
      {
        console.log('No existe el documento');
        return null;
      }
    }).catch(error =>
    {
      console.error('Error al obtener el paciente por email: ', error);
      return null;
    });
  }

  obtenerPacientes()
  {
    let col = collection(this.firestore, 'pacientes');
    const observable = collectionData(col, { idField: 'id' });

    this.sub = observable.subscribe((respuesta) =>
    {
      this.coleccionPacientes = respuesta;
      this.countPacientes = this.coleccionPacientes.length;
      this.obtenerPacientesSubject.next(true);
    })

  }

  eliminarPaciente(id: string)
  {
    const pacienteDocRef = doc(this.firestore, `pacientes/${id}`);
    deleteDoc(pacienteDocRef).then(() =>
    {
      console.log('Paciente eliminado con éxito');
    }).catch(error =>
    {
      console.error('Error al eliminar el paciente: ', error);
    });
  }

  getPacienteByMail(email: string)
  {
      const q = query(collection(this.firestore, "pacientes"), where("mail", "==", email));
      return getDocs(q);
  }

  // esPaciente(email: string): Promise<boolean>
  // {
  //   return new Promise((resolve, reject) => {
  //     const q = query(collection(this.firestore, "pacientes"), where("mail", "==", email));

  //     return getDocs(q).then((querySnapshot) =>
  //       {
  //       let esPaciente = false;
  //       querySnapshot.forEach((doc) =>
  //       {
  //         esPaciente = true;
  //       });
  //       resolve(esPaciente);
  //     }).catch(error => {
  //       reject(error);
  //     });
  //   });
  // }
}
