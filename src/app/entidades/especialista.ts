import { Especialidad } from "./especialidad"

export interface Especialista{
    id?: string,
    dni: number,
    nombre: string,
    apellido: string,
    edad: number,
    especialidades: Array<Especialidad>,
    mail: string,
    password: string
    estado?: string
}
