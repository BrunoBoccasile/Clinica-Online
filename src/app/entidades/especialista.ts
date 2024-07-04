import { Disponibilidad } from "./disponibilidad";

export interface Especialista{
    id?: string,
    dni: number,
    nombre: string,
    apellido: string,
    edad: number,
    especialidades: Array<string>,
    disponibilidades?: Array<Disponibilidad>,
    mail: string,
    password: string
    estado?: string,
    imagen?: string;
}
