import { Injectable } from '@angular/core';
import { Firestore, addDoc, and, collection, collectionData, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Turno } from '../entidades/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  public coleccionTurnos: any[] = [];
  public turnos: any[] = [];
  private sub!:Subscription;
  

  // BehaviorSubject para notificar sobre el estado de la operación de guardado
  private guardarTurnoSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // BehaviorSubject para notificar sobre el estado de la operación de obtención de especialidades
  public obtenerTurnosSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor(private firestore: Firestore){}

  ngOnDestroy(): void {

    this.sub.unsubscribe();

 }

  guardarTurno(turno: Turno)
  {
    let col = collection(this.firestore, 'turnos');
    addDoc(col, {
      fecha: turno.fecha,
      hora: turno.hora,
      idEspecialista: turno.idEspecialista,
      idPaciente: turno.idPaciente,
      especialidad: turno.especialidad,
      estado: "pendiente",
      nombreEspecialista: turno.nombreEspecialista,
      apellidoEspecialista: turno.apellidoEspecialista,
      nombrePaciente: turno.nombrePaciente,
      apellidoPaciente: turno.apellidoPaciente
    }).then(() => {
      console.log('Turno guardado con éxito');
      this.guardarTurnoSubject.next(true);
    }).catch(error => {
      console.error('Error al guardar el turno: ', error);
      this.guardarTurnoSubject.next(false);
    });
  }

  // obtenerTurnos()
  // {
  //   let col = collection(this.firestore, 'turnos');
  //   const observable = collectionData(col, {idField: 'id'});

  //   this.sub = observable.subscribe((respuesta) =>{
  //     this.coleccionTurnos= respuesta;
  //     this.obtenerTurnosSubject.next(true);
  //   })
  // }

  getTurnos()
  {
    let col = collection(this.firestore, 'turnos');
    return collectionData(col, {idField: 'id'});
  }

  obtenerTurnosByField(field: string, value: any)
  {
    const filteredQuery = query(
      collection(this.firestore, 'turnos'),
        where(field, '==', value),
    );
    return collectionData(filteredQuery, {idField: 'id'});
  }

  // obtenerTurnosByField(field: string, value: any)
  // {
  //   const filteredQuery = query(
  //     collection(this.firestore, 'turnos'),
  //     and(
  //       where(field, '==', value),
  //     )
  //   );
  //   const observable = collectionData(filteredQuery, {idField: 'id'});

  //   this.sub = observable.subscribe((respuesta) =>{
  //     this.coleccionTurnos= respuesta;
  //     this.obtenerTurnosSubject.next(true);
  //   })
  // }
  obtenerTurnosPorPacienteYFields(idPaciente: string, fields: string[], values: string[])
  {
    if (fields.length !== values.length) {
      throw new Error('El número de campos y valores debe ser igual.');
    }
  
    const conditions = [
      where('idPaciente', '==', idPaciente)
    ];
  
    for (let i = 0; i < fields.length; i++) {
      conditions.push(where(fields[i], '==', values[i]));
    }
  
    const filteredQuery = query(collection(this.firestore, 'turnos'), ...conditions);
    return collectionData(filteredQuery, { idField: 'id' });
  }

  obtenerTurnosPorEspecialistaYFields(idEspecialista: string, fields: string[], values: string[])
  {
    if (fields.length !== values.length) {
      throw new Error('El número de campos y valores debe ser igual.');
    }
  
    const conditions = [
      where('idEspecialista', '==', idEspecialista)
    ];
  
    for (let i = 0; i < fields.length; i++) {
      conditions.push(where(fields[i], '==', values[i]));
    }
  
    const filteredQuery = query(collection(this.firestore, 'turnos'), ...conditions);
    return collectionData(filteredQuery, { idField: 'id' });
  }

  obtenerTurnosPorFields(fields: string[], values: string[])
  {
    if (fields.length !== values.length) {
      throw new Error('El número de campos y valores debe ser igual.');
    }
  
    const conditions = [];
  
    for (let i = 0; i < fields.length; i++) {
      conditions.push(where(fields[i], '==', values[i]));
    }
  
    const filteredQuery = query(collection(this.firestore, 'turnos'), ...conditions);
    return collectionData(filteredQuery, { idField: 'id' });
  }


  obtenerTurnoPorIdEspecialistaFechaYHora(idEspecialista: string, fecha: string, hora: number)
  {
    const filteredQuery = query(
      collection(this.firestore, 'turnos'),
      and(
        where('idEspecialista', '==', idEspecialista),
        where('fecha', '==', fecha),
        where('hora', '==', hora),
      )
    );
    return getDocs(filteredQuery).then(querySnapshot =>
      {
        if (!querySnapshot.empty)
        {
          const doc = querySnapshot.docs[0];
          return {
            id: doc.id,
            ...doc.data()
          } as Turno;
        } else
        {
          console.log('No existe el documento');
          return null;
        }
      }).catch(error =>
      {
        console.error('Error al obtener el turno: ', error);
        return null;
      });
  }


  setTurnoField(id: string, field: string, value: any)
  {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoDocRef, { [field]: value })
  }

  cancelarTurno(id: string, motivos: string)
  {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoDocRef, { estado: 'cancelado', motivosCancelacion: motivos })
  }

  rechazarTurno(id: string, motivos: string)
  {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoDocRef, { estado: 'rechazado', motivosRechazo: motivos })
  }

  calificarTurno(id: string, comentario: string, estrellas: number)
  {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    return updateDoc(turnoDocRef, {calificacion: {estrellas: estrellas, comentario: comentario}})
  }
}
