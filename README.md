
<!-- <a name="readme-top"></a> -->

<br />
<div align="center">
  <a>
  </a>
  <br />  <br />  <br />
  <h1 align="center">Clínica Online</h1>

  <p align="center">
    Trabajo práctico final Laboratorio IV 2024
  </p>
</div>


<br />
<br />


<!-- ABOUT THE PROJECT -->
## Sobre el proyecto

Este proyecto, desarrollado durante el cuarto cuatrimestre de la Tecnicatura en Programación de la UTN FRA, consiste en una aplicación web basada en Angular para la gestión integral de una clínica. La plataforma está diseñada para optimizar la administración de turnos, permitiendo a los usuarios acceder a historias clínicas, visualizar gráficos con estadísticas y más. Ofrece funcionalidades específicas y personalizadas tanto para pacientes como para especialistas, adaptándose a las necesidades de cada rol.

### Tecnologías empleadas

* [![Angular][angular_img]][angular_url]
* [![Ts][ts_img]][ts_url]
* [![Firebase][firebase_img]][firebase_url]
* [![Bootstrap][bootstrap_img]][bootstrap_link]




## Creador

### [![Github][github_img]][github_link_bruno] Bruno Boccasile


## Vistas previas de la aplicación

### Ícono de la aplicación
<img src="https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/logo.png" width="500" height="500">

### Página de bienvenida
Tiene los accesos al login y registro del sistema
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/bienvenida.png)

### Registro
Desde esta sección se pueden registrar Pacientes y Especialistas.
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/registro.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/registro-paciente.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/registro-especialista.png)

### Iniciar sesión
Desde esta sección se ingresa al sistema. Existen botones botones de acceso rápido con usuarios pre-cargados.
<br>
Los usuarios con perfil Especialista solo pueden ingresar si un usuario administrador aprobó su cuenta y verificó el mail al momento de registrarse.
<br>
Los usuarios con perfil Paciente solo pueden ingresar si verificaron su mail al momento de registrarse.
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/iniciar-sesion.png)

### Sección usuarios
Esta sección solamente la puede ver el usuario con perfil Administrador.
<br>
Además de ver la información de los usuarios, desde esta sección se puede habilitar o inhabilitar el acceso al sistema de los usuarios Especialistas. 
<br>
También se podrá generar nuevos usuarios, con el mismo requerimiento que en la sección registro. Pero desde esta sección se podrá generar un usuario Administrador.
<br>
Se puede descargar un Excel con los datos de los usuarios. Al seleccionar un paciente, descarga los datos de que turnos tomo y con quién
<br> 
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/seccion-usuarios.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/seccion-usuarios-2.png)

### Mis turnos
Cuenta con un filtro único donde podrá filtrar por:
<br>
• Especialidad
<br>
• Especialista (siendo Paciente)
<br>
• Paciente (siendo Especialista)
<br>
• Fecha
<br>
• Hora
<br>
• Estado
<br>
• Datos fijos de la historia clínica (peso, temperatura, presión y altura)
<br>
• Datos dinámicos de la historia clínica
<br>

Al hacer click en un turno del listado, se pueden realizar las siguentes acciones:
<br>
♦ Cancelar turno (si el turno no fue realizado)
<br>
♦ Ver calificación (si fue cargada)
<br>
♦ Completar encuesta (siendo Paciente, si el turno fue realizado y la calificación fue cargada)
<br>
♦ Calificar atención (siendo Paciente, solo si el turno fue realizado)
<br>
♦ Rechazar turno (siendo Especialista, si el turno esta pendiente)
<br>
♦ Aceptar turno (siendo Especialista, si el turno esta pendiente)
<br>
♦ Finalizar turno (siendo Especialista, si el turno esta aceptado)
<br>
♦ Ver historia clínica (si el turno tiene una historia clínica cargada)
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mis-turnos-especialista.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mis-turnos-paciente.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mis-turnos-paciente-acciones.png)

### Turnos
Solo tiene acceso el Administrador y puede ver los turnos de la clínica, pudiendo filtrar por todos los campos del turno.
<br>
Sólamente puede cancelar el turno y ver la historia clínica.
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mis-turnos-admin.png)

### Solicitar turno
En esta sección tiene acceso tanto el Paciente como el Administrador y permite realizar la carga de un turno.
<br>
Se debe seleccionar:
<br>
■ Especialidad
<br>
■ Especialista
<br>
■ Día y horario del turno.
<br>
● El paciente tiene la posibilidad de elegir turno dentro de los
próximos 15 días.
<br>
● Estas fechas estan relacionadas al especialista
seleccionado y su disponibilidad horaria.
<br>
■ En el caso del administrador, deberá marcar el Paciente.
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/solicitar-turno-admin.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/solicitar-turno-1.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/solicitar-turno-2.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/solicitar-turno-3.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/solicitar-turno-4.png)

### Mi perfil
Se muestran los datos relevantes del usuario y se pueden realizar acciones correspondientes al rol del usuario (descargar PDFs, ver historia clínica, cargar disponibilidades, etc.).
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mi-perfil-paciente.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mi-perfil-especialista.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mi-perfil-admin.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mi-perfil-paciente-historia-clinica.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mi-perfil-especialista-agregar-especialidad.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/mi-perfil-especialista-cargar-disponibilidad.png)


### Sección pacientes
Visible para los especialistas. Solo muestra los usuarios que el especialista haya atendido al menos 1 vez. 
<br>
Cada usuario se muestra con un detalle de las últimas 3 atenciones (o menos, si hay menos de 3) y acceso a historia clínica.
<br>
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/seccion-pacientes.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/seccion-pacientes-historia-clinica.png)

## Estadísticas
Como usuario Administrador, se pueden observar gráficos y estadísticas del sistema.
<br>
Los informes son:
<br>
● Log de ingresos al sistema. Indicando el usuario, día y horario que ingreso al sistema.
<br>
● Cantidad de turnos por especialidad.
<br>
● Cantidad de turnos por día.
<br>
● Cantidad de turnos solicitado por médico en un lapso de tiempo.
<br>
● Cantidad de turnos finalizados por médico en un lapso de tiempo.
<br>
Estos gráficos e informes se pueden descargar en un Pdf.
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/estadisticas.png)
![](https://github.com/BrunoBoccasile/LaboIV-TPClinicaOnline/blob/master/src/assets/pantallas/estadisticas-2.png)


## Historias clínicas
Cada historia clínica de cada turno está compuestas por:
<br>
Cuatro datos fijos:
<br>
○ Altura
<br>
○ Peso
<br>
○ Temperatura
<br>
○ Presión
<br>
Cero a tres datos dinámicos (clave y valor).
<br>
○ Por ejemplo:
<br>
■ clave: caries
<br>
■ valor: 4






## Ramas
### Rama de producción
* master



<!-- CONTRIBUTING -->
<!-- ## Contribución

En caso de observar un error, si existiese, por favor hacerlo saber como un "issue" (github) en el repositorio.<br/><br/>
_No olvidar de dar una estrella al proyecto!_ -->



<!-- LICENSE -->
<!-- ## Licencia

Distribuida bajo Licencia MIT. Observar `LICENSE.txt` para más información. -->


<!-- MARKDOWN LINKS & IMAGES -->
[github_img]: https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white

[github_link_bruno]: https://github.com/BrunoBoccasile
[bootstrap_img]: https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white
[bootstrap_link]: https://getbootstrap.com/
[angular_img]: https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white
[angular_url]: https://angular.dev/
[ts_img]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[ts_url]: https://www.typescriptlang.org/
[firebase_img]: https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase
[firebase_url]: https://firebase.google.com/?hl=es
