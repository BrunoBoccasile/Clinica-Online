export interface Turno{
    id?: string,
    fecha: string,
    hora: number,
    idEspecialista: string,
    especialidad: string,
    idPaciente: string,
    nombreEspecialista: string,
    apellidoEspecialista: string,
    nombrePaciente: string,
    apellidoPaciente: string,
    estado?: string,
    motivosCancelacion?: string
}
