import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorValidate {
  [s: string ]: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  // esta es una validacion asincrona, que resuelve una promesa o un observable
  existeUsuario( control: FormControl ): Promise<ErrorValidate> | Observable<ErrorValidate> {

    if ( !control.value ) {
      return Promise.resolve(null); // si esta vacio resolver null que es valido
    }

    return new Promise( (resolve, reject) => {

      setTimeout(() => { // tiempo para simular el asincrono en la realidad seria x ej una peticion a Base de datos

        if ( control.value === 'strider' ) {
          resolve({ existe: true }); // devolver un observable, true data error
        } else {
          resolve( null ); // null para validar positivo
        }

      }, 3500);


    });

  }


  noHerrera( control: FormControl ): ErrorValidate {

    if ( control.value?.toLowerCase() === 'herrera' ){
      return {
        noHerrera: true
      };
    }

    return null;
  }

  // vaidad que 2 campos de password son iguales
  passwordsIguales( pass1Name: string, pass2Name: string ) {

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];
      // se valida con .setErrors devolviendo null o un flag personalizado
      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }

    };

  }


}
