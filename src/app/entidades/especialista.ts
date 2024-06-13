import { Especialidad } from "./especialidad"

export interface Especialista{
    id?: string,
    dni: number,
    nombre: string,
    apellido: string,
    edad: number,
    especialidad: string,
    mail: string,
    password: string
    estado?: string
}
