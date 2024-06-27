import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Especialista } from '../entidades/especialista';
import { Especialidad } from '../entidades/especialidad';
import { Disponibilidad } from '../entidades/disponibilidad';

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
      especialidades: especialista.especialidades,
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

  obtenerEspecialistaPorId(id: string) {
    const pacienteDocRef = doc(this.firestore, `especialistas/${id}`);
    return getDoc(pacienteDocRef).then(doc => {
      if (doc.exists()) {
        return {
          id: doc.id,
          ...doc.data()
        } as Especialista;
      } else {
        console.log('No existe el documento');
        return null;
      }
    }).catch(error => {
      console.error('Error al obtener el especialista por ID: ', error);
      return null;
    });
  }

  obtenerEspecialistaPorEmail(email: string): Promise<Especialista | null> {
    const especialistassColRef = collection(this.firestore, 'especialistas');
    const q = query(especialistassColRef, where('mail', '==', email));

    return getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Especialista;
      } else {
        console.log('No existe el documento');
        return null;
      }
    }).catch(error => {
      console.error('Error al obtener el especialista por email: ', error);
      return null;
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
agregarEspecialidad(id: string, especialidad: Especialidad): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const especialistaDocRef = doc(this.firestore, `especialistas/${id}`);

    getDoc(especialistaDocRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const especialidades = data['especialidades'] || [];

        especialidades.push(especialidad);

        updateDoc(especialistaDocRef, { especialidades: especialidades }).then(() => {
          console.log('Especialidad agregada con éxito');
          resolve();
        }).catch(error => {
          console.error('Error al agregar la especialidad: ', error);
          reject(error);
        });

      } else {
        const error = 'El documento no existe';
        console.error(error);
        reject(error);
      }
    }).catch(error => {
      console.error('Error al obtener el documento: ', error);
      reject(error);
    });
  });
}

cargarDisponibilidad(id: string, nombreEspecialidad: string, disponibilidad: Disponibilidad): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const especialistaDocRef = doc(this.firestore, `especialistas/${id}`);

    getDoc(especialistaDocRef).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const especialidades = data['especialidades'] || [];

        especialidades.forEach((esp: Especialidad)=> {
          if(esp.nombre == nombreEspecialidad)
            {
              if(esp.disponibilidades)
                {
                  //Si ya tiene disponibilidades cargadas, pusheo la disponibilidad y la reemplazo en caso de que exista una para ese dia
                  let reemplazo = false;
                  esp.disponibilidades.forEach((disp, index) => {
                    if(disp.dia == disponibilidad.dia)
                      {
                        esp.disponibilidades![index] = disponibilidad;
                        reemplazo = true;
                      }
                    });
                    if(!reemplazo)
                      {
                        esp.disponibilidades.push(disponibilidad);
                      }
                  }
                else
                {
                  //Si no tiene disponibilidades cargadas, crea un array con la disponibilidad que se está cargando
                  esp.disponibilidades = [disponibilidad];
                }
            }
        });

        updateDoc(especialistaDocRef, { especialidades: especialidades }).then(() => {
          console.log('Disponibilidad agregada con éxito');
          resolve();
        }).catch(error => {
          console.error('Error al agregar la disponibilidad: ', error);
          reject(error);
        });

      } else {
        const error = 'El documento no existe';
        console.error(error);
        reject(error);
      }
    }).catch(error => {
      console.error('Error al obtener el documento: ', error);
      reject(error);
    });
  });
}

  esEspecialista(email: string): Promise<boolean>
  {
    return new Promise((resolve, reject) => {
      const q = query(collection(this.firestore, "especialistas"), where("mail", "==", email));
      getDocs(q).then((querySnapshot) =>
        {
        let esEspecialista = false;
        querySnapshot.forEach((doc) =>
        {
          esEspecialista = true;
        });
        resolve(esEspecialista);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
