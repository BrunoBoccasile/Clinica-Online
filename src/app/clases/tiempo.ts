import { EnvironmentProviders, Injector } from "@angular/core";

export class Tiempo
{
    constructor() { }

    public getDia(fechaFormateada: string)
    {
        let [dia, mes] = fechaFormateada.split('/').map(Number);
        let anio = new Date().getFullYear();
        let fecha = new Date(anio, mes - 1, dia);

        let nombreDia = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(fecha);

        nombreDia = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

        return nombreDia;
    }

    public getProximosDias(cantidad: number)
    {
        const proximosDias: string[] = [];
        const hoy = new Date();

        for (let i = 1; i < cantidad + 1; i++)
        {
            const dia = new Date(hoy);
            dia.setDate(hoy.getDate() + i);

            const diaStr = ('0' + dia.getDate()).slice(-2);
            const mesStr = ('0' + (dia.getMonth() + 1)).slice(-2);

            proximosDias.push(`${diaStr}/${mesStr}`);
        }

        return proximosDias;
    }

    public minutosAHora(minutos: number)
    {
        let hora = Math.floor(minutos / 60);
        let minutosRestantes = minutos % 60;

        let ampm = hora >= 12 ? 'pm' : 'am';
        let hora12 = hora % 12;
        if (hora12 === 0)
        {
            hora12 = 12;
        }

        let horaFormateada = String(hora12).padStart(2, '0');
        let minutosFormateados = String(minutosRestantes).padStart(2, '0');

        return `${horaFormateada}:${minutosFormateados} ${ampm}`;

    }
}
export declare function provideTiempo(fn: (injector: Injector) => Tiempo, ...deps: any[]): EnvironmentProviders;


