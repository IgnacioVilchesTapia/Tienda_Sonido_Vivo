import {
  validarRutChileno,
  validarEmail,
  validarPassword,
  validarTexto,
} from './validaciones';

describe('validaciones.js', () => {
  describe('validarRutChileno', () => {
    it('acepta un RUN válido sin guion', () => {
      expect(validarRutChileno('190110222').esValido).toBeTrue();
    });

    it('acepta un RUN válido con guion y puntos', () => {
      expect(validarRutChileno('19.011.022-2').esValido).toBeTrue();
    });

    it('acepta dígito verificador K (mayúscula o minúscula)', () => {
      expect(validarRutChileno('10000013K').esValido).toBeTrue();
      expect(validarRutChileno('10000013k').esValido).toBeTrue();
    });

    it('acepta dígito verificador 0', () => {
      expect(validarRutChileno('100000040').esValido).toBeTrue();
    });

    it('rechaza un dígito verificador incorrecto', () => {
      const res = validarRutChileno('190110223');
      expect(res.esValido).toBeFalse();
      expect(res.mensaje).toContain('dígito verificador');
    });

    it('rechaza valores vacíos, nulos o que no son string', () => {
      expect(validarRutChileno('').mensaje).toBe('El RUN es obligatorio.');
      expect(validarRutChileno(null).esValido).toBeFalse();
      expect(validarRutChileno(190110222).esValido).toBeFalse();
    });

    it('rechaza RUN demasiado corto o demasiado largo', () => {
      expect(validarRutChileno('123').esValido).toBeFalse();
      expect(validarRutChileno('1234567890').esValido).toBeFalse();
    });

    it('rechaza un cuerpo con letras', () => {
      const res = validarRutChileno('ABCDEFGH1');
      expect(res.esValido).toBeFalse();
      expect(res.mensaje).toContain('solo dígitos');
    });
  });

  describe('validarEmail', () => {
    it('acepta los dominios permitidos', () => {
      expect(validarEmail('c.pizarro@duoc.cl').esValido).toBeTrue();
      expect(validarEmail('m.contreras@profesor.duoc.cl').esValido).toBeTrue();
      expect(validarEmail('fsoto2000@gmail.com').esValido).toBeTrue();
    });

    it('ignora mayúsculas y espacios alrededor', () => {
      expect(validarEmail('  ANA@GMAIL.COM  ').esValido).toBeTrue();
    });

    it('rechaza correo vacío', () => {
      expect(validarEmail('').mensaje).toBe('El correo electrónico es obligatorio.');
      expect(validarEmail('   ').esValido).toBeFalse();
      expect(validarEmail(undefined).esValido).toBeFalse();
    });

    it('rechaza formato inválido', () => {
      expect(validarEmail('sin-arroba').mensaje).toContain('formato válido');
      expect(validarEmail('a@b').esValido).toBeFalse();
    });

    it('rechaza dominios no permitidos', () => {
      const res = validarEmail('usuario@hotmail.com');
      expect(res.esValido).toBeFalse();
      expect(res.mensaje).toContain('Dominio no permitido');
    });
  });

  describe('validarPassword', () => {
    it('acepta contraseñas de 4 a 10 caracteres (límites incluidos)', () => {
      expect(validarPassword('1234').esValido).toBeTrue();
      expect(validarPassword('1234567890').esValido).toBeTrue();
    });

    it('rechaza contraseñas de 3 o de 11 caracteres', () => {
      expect(validarPassword('123').esValido).toBeFalse();
      expect(validarPassword('12345678901').esValido).toBeFalse();
    });

    it('rechaza vacía o solo espacios', () => {
      expect(validarPassword('').mensaje).toBe('La contraseña es obligatoria.');
      expect(validarPassword('    ').esValido).toBeFalse();
    });
  });

  describe('validarTexto', () => {
    it('acepta texto dentro del rango', () => {
      expect(validarTexto('Carla', 2, 50, 'El nombre')).toEqual({ esValido: true, mensaje: '' });
    });

    it('rechaza texto vacío usando la etiqueta en el mensaje', () => {
      expect(validarTexto('', 2, 50, 'El nombre').mensaje).toBe('El nombre es obligatorio.');
    });

    it('rechaza texto más corto que el mínimo', () => {
      expect(validarTexto('A', 2, 50, 'El nombre').mensaje).toBe('El nombre debe tener al menos 2 caracteres.');
    });

    it('rechaza texto más largo que el máximo', () => {
      expect(validarTexto('x'.repeat(11), 1, 10, 'El mensaje').mensaje).toBe('El mensaje no puede superar los 10 caracteres.');
    });

    it('permite vacío cuando min es 0', () => {
      expect(validarTexto('', 0, 10, 'El campo').esValido).toBeTrue();
    });
  });
});