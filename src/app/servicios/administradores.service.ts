import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Administrador } from '../entidades/administrador';

@Injectable({
  providedIn: 'root'
})
export class AdministradoresService
{
  public coleccionAdministradores: any[] = [];
  public administradores: any[] = [];
  public countAdministradores: number = 0;
  private sub!: Subscription;


  // BehaviorSubject para notificar sobre el estado de la operación de guardado
  private guardarAdministradorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // BehaviorSubject para notificar sobre el estado de la operación de obtención de pacientes
  public obtenerAdministradoresSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private firestore: Firestore)
  { }

  ngOnDestroy(): void
  {

    this.sub.unsubscribe();

  }

  guardarAdministrador(administrador: Administrador)
  {
    let col = collection(this.firestore, 'administradores');
    addDoc(col, {
      nombre: administrador.nombre,
      apellido: administrador.apellido,
      edad: administrador.edad,
      dni: administrador.dni,
      mail: administrador.mail
    }).then(() =>
    {
      console.log('Administrador guardado con éxito');
      this.guardarAdministradorSubject.next(true);
    }).catch(error =>
    {
      console.error('Error al guardar el administrador: ', error);
      this.guardarAdministradorSubject.next(false);
    });
  }

  obtenerAdministradorPorId(id: string)
  {
    const pacienteDocRef = doc(this.firestore, `administradores/${id}`);
    return getDoc(pacienteDocRef).then(doc =>
    {
      if (doc.exists())
      {
        return {
          id: doc.id,
          ...doc.data()
        } as Administrador;
      } else
      {
        console.log('No existe el documento');
        return null;
      }
    }).catch(error =>
    {
      console.error('Error al obtener el administrador por ID: ', error);
      return null;
    });
  }

  obtenerAdministradorPorEmail(email: string): Promise<Administrador | null> {
    const administradoresColRef = collection(this.firestore, 'administradores');
    const q = query(administradoresColRef, where('mail', '==', email));

    return getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Administrador;
      } else {
        console.log('No existe el documento');
        return null;
      }
    }).catch(error => {
      console.error('Error al obtener el administrador por email: ', error);
      return null;
    });
  }


  obtenerAdministradores()
  {
    let col = collection(this.firestore, 'administradores');
    const observable = collectionData(col, { idField: 'id' });

    this.sub = observable.subscribe((respuesta) =>
    {
      this.coleccionAdministradores = respuesta;
      this.countAdministradores = this.coleccionAdministradores.length;
      this.obtenerAdministradoresSubject.next(true);
    })

  }

  eliminarAdministrador(id: string)
  {
    const administradorDocRef = doc(this.firestore, `administradores/${id}`);
    deleteDoc(administradorDocRef).then(() =>
    {
      console.log('Administrador eliminado con éxito');
    }).catch(error =>
    {
      console.error('Error al eliminar el administrador: ', error);
    });
  }

  esAdmin(email: string): Promise<boolean>
  {
    return new Promise((resolve, reject) => {
      const q = query(collection(this.firestore, "administradores"), where("mail", "==", email));
      getDocs(q).then((querySnapshot) =>
        {
        let esAdmin = false;
        querySnapshot.forEach((doc) =>
        {
          esAdmin = true;
        });
        resolve(esAdmin);
      }).catch(error => {
        reject(error);
      });
    });
  }

  getAdminByMail(email: string)
  {
      const q = query(collection(this.firestore, "administradores"), where("mail", "==", email));
      return getDocs(q);
  }


  getAdministradores(): Observable<Administrador[]>
  {
    let col = collection(this.firestore, 'administradores');
    return collectionData(col, {idField: 'id'}) as Observable<Administrador[]>;
  }
}
