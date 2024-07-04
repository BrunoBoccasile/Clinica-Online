import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EnvironmentProviders, Injector } from '@angular/core';

export class SweetAlert{
    constructor(public router: Router){}

    public mostrarMensajeError(titulo: string, mensaje: string)
    {
      Swal.fire({
        icon: "error",
        title: titulo,
        text: mensaje,
      });
    }

    public mostrarMensajeExito(titulo: string, mensaje: string)
    {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: "success",
        confirmButtonText: "Ok",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }

    public mostrarMensajeWarning(titulo: string, mensaje: string)
    {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: "warning",
        confirmButtonText: "Ok",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }

    public mostrarMensajeExitoYNavegar(titulo: string, mensaje: string, ruta: string)
    {
      Swal.fire({
        title: titulo,
        text: mensaje,
        icon: "success",
        confirmButtonText: "Ok",
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl(ruta);
        }
      });
    }

    public mostrarMensajeConfirmar(titulo: string, mensaje: string)
    {
      return Swal.fire({
        title: titulo,
        text: mensaje,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "No"
      });
    }
}
export declare function provideSwal(fn: (injector: Injector) => SweetAlert, ...deps: any[]): EnvironmentProviders;


