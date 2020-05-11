import { Component, OnInit } from '@angular/core';
// importar librerias relacionadas con los formularios reactivos
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  // la clase FormGroup de @angular/forms define los formularios reactivos
  forma: FormGroup;


  constructor( private fb: FormBuilder,
               private validadores: ValidadoresService ) {
    // inicializar instancia del formulario en su constructor
    // se crea, se cargan los datos por defecto iniciales, y se levantan los listeners
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();

  }

  ngOnInit(): void {
  }

  // implementar 'getters' mediante metodos con las validaciones
  get pasatiempos() {
    return this.forma.get('pasatiempos') as FormArray;
  }

  get nombreNoValido() {
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched
  }

  get apellidoNoValido() {
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched
  }

  get correoNoValido() {
    return this.forma.get('correo').invalid && this.forma.get('correo').touched
  }

  get usuarioNoValido() {
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched
  }

  get distritoNoValido() {
    // como este es de un campo tipo objeto hay que especificarlo correctamente: ej 'direccion.distrito'
    return this.forma.get('direccion.distrito').invalid && this.forma.get('direccion.distrito').touched
  }

  get ciudadNoValido() {
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched
  }

  get pass1NoValido() {
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched;
  }

  get pass2NoValido() {
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    return ( pass1 === pass2 ) ? false : true;
  }


  // metodo para inicializar el formulario y definirle las validaciones
  crearFormulario() {

    this.forma = this.fb.group({
      nombre  : ['', [ Validators.required, Validators.minLength(5) ]  ],
      apellido: ['', [Validators.required, this.validadores.noHerrera ] ],
      correo  : ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],
      usuario : ['', , this.validadores.existeUsuario ],
      pass1   : ['', Validators.required ],
      pass2   : ['', Validators.required ],
      // 'fb: FormBuilder' se usa para manejar campos tipo objeto con contenido multiple
      // se define como un 'group'; ejemplo la direccion que es como un subformulario dentro del formulario
      direccion: this.fb.group({
        distrito: ['', Validators.required ],
        ciudad  : ['', Validators.required ],
      }),
      // los campos que sean de valores multiples tipo array se declaran asi
      pasatiempos: this.fb.array([])
    },{
      validators: this.validadores.passwordsIguales('pass1','pass2')
    });

  }

  // activar listeners para monitorear cambios en los campos
  crearListeners() {
    // this.forma.valueChanges.subscribe( valor => { // este esun observable para cambios
    //   console.log(valor);
    // });

    // this.forma.statusChanges.subscribe( status => console.log({ status })); // para cambios de status
    this.forma.get('nombre').valueChanges.subscribe( console.log ); // monitorear un campo especifico
  }

  // cargar datos por default por ejemplo leidos de una base de datos
  cargarDataAlFormulario() {
    console.log('Cargar Formulario');


     // .setValue() requiere pasarle el objeto con la info para todos los campos y con valores validos, sino da error
    // this.forma.setValue({
    // usarmos '.reset() como truco para especificar valores iniciales por default
    // es mas flexible que .setValue() porque no requiere espeficiar los datos completos a todos los campos
    // y no pasa por las validaciones hasta que sea 'touched'
    this.forma.reset({
      nombre: 'Fernando',
      apellido: 'Perez',
      correo: 'fernando@gmail.com',
      pass1: '123',
      pass2: '123',
      direccion: {
        distrito: 'Ontario',
        ciudad: 'Ottawa'
      },
    });

  }

  // actualizar un campo tipo array sumandole elementos
  // llamado por clien en boton agregar del html
  agregarPasatiempo() {
    this.pasatiempos.push(  this.fb.control('')  );
  }

  // actualizar un campo tipo array quitandole elementos
  // llamado por un click en boton borrar del html
  borrarPasatiempo(i: number) {
    this.pasatiempos.removeAt(i);
  }

  // metodo para controlar el boton Guardar que solo haga posteo cuando los campos esten listos y validados
  guardar() {
    console.log('Guardar Formulario');

    console.log( this.forma );

    // mientras el form sea 'invalid' retornar con todos los campos marcados como 'touched'
    // esto para usar la propiedad 'touched' en las validaciones
    if ( this.forma.invalid ) {

      return Object.values( this.forma.controls ).forEach( control => {

        if ( control instanceof FormGroup ) { // si el 'control' es un subgrupo anidado en el form parent
        // marcar Touched los campos child dentro de un campo tipo objeto ( formgroup )
        Object.values( control.controls ).forEach( control => control.markAsTouched() );
        } else { // si es un campo directo marcarlo como Touched
          control.markAsTouched();
        }


      });

    }

    // Implementar aqui el posteo del formulario a una base de datos, etc
    // ....
    // luego resetear el formulario para que que quede limpio
    // reset() no borra el formulario solo resetea los booleans de estados
    this.forma.reset({
      nombre: 'Sin nombre' // se puede especificar datos iniciales por default que desee
    });

  }

}
