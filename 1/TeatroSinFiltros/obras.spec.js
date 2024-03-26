import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiComponente } from './mi-componente.component';

describe('API de obras', () => {
  it('debe crear una nueva obra y devolver un mensaje de éxito', async () => {
    const nuevaObra = {
      titulo: 'Obra de Prueba',
      imagen_url: 'http://url-de-imagen.com/imagen.jpg',
      descripcion: 'Descripción de la obra de prueba'
    };

    const response = await request(app).post('/api/obras').send(nuevaObra);
    console.log('Respuesta de creación de obra:', response.body);

    expect(response.status).toBe(201);
    expect(response.body.mensaje).toBe('Obra creada con éxito');
  });

  it('debe devolver un error si falta un campo obligatorio', async () => {
    const obraIncompleta = {
      titulo: 'Obra Incompleta'
    };

    const response = await request(app).post('/api/obras').send(obraIncompleta);
    console.log('Respuesta de error de obra incompleta:', response.body);

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('Falta la descripción y la imagen');
  });

  it('debe devolver un error si falta un campo obligatorio', async () => {
    const obraIncompleta = {
      imagen_url: 'http://url-de-imagen.com/imagen.jpg'
    };

    const response = await request(app).post('/api/obras').send(obraIncompleta);
    console.log('Respuesta de error de obra incompleta:', response.body);

    expect(response.status).toBe(400);
    expect(response.body.mensaje).toBe('Falta la descripción y el titulo');
  });

  it('debe devolver un error si falta la descripción y la imagen', async () => {
    const obraIncompleta = { descripcion: 'Obra Incompleta' };
  
    const response = await request(app).post('/api/obras').send(obraIncompleta);
    console.log('Respuesta de error:', response.body);
  
    expect(response.status).toBe(400);
    expect(response.body.mensaje).toContain('Faltan campos obligatorios: imagen_url, titulo');
  });
  
  it('debe devolver un error si falta el título y la descripción', async () => {
    const obraIncompleta = { imagen_url: 'http://url-de-imagen.com/imagen.jpg',descripcion: 'Obra Incompleta' };
  
    const response = await request(app).post('/api/obras').send(obraIncompleta);
    console.log('Respuesta de error:', response.body);
  
    expect(response.status).toBe(400);
    expect(response.body.mensaje).toContain('Faltan campos obligatorios: titulo');
  });

  it('debe devolver un error si falta el título y la descripción', async () => {
    const obraIncompleta = { titulo: 'Obra Incompleta', imagen_url: 'http://url-de-imagen.com/imagen.jpg' };
  
    const response = await request(app).post('/api/obras').send(obraIncompleta);
    console.log('Respuesta de error:', response.body);
  
    expect(response.status).toBe(400);
    expect(response.body.mensaje).toContain('Faltan campos obligatorios: descripcion');
  });

  it('debe devolver un error si falta el título y la descripción', async () => {
    const obraIncompleta = { titulo: 'Obra Incompleta', descripcion: 'Obra Incompleta' };
  
    const response = await request(app).post('/api/obras').send(obraIncompleta);
    console.log('Respuesta de error:', response.body);
  
    expect(response.status).toBe(400);
    expect(response.body.mensaje).toContain('Faltan campos obligatorios: descripcion');
  });

  it('debe devolver un error si se intenta añadir una obra con un título que ya existe', async () => {
    const obraOriginal = {
      titulo: 'Obra Existente',
      imagen_url: 'http://url-de-imagen.com/imagen1.jpg',
      descripcion: 'Descripción de la obra existente'
    };
  
    await request(app).post('/api/obras').send(obraOriginal);
  
    const obraDuplicada = {
      titulo: 'Obra Existente',
      imagen_url: 'http://url-de-imagen.com/imagen2.jpg',
      descripcion: 'Descripción de la obra duplicada'
    };
  
    const response = await request(app).post('/api/obras').send(obraDuplicada);
    console.log('Respuesta de error para obra duplicada:', response.body);
  
    expect(response.status).toBe(409); 
    expect(response.body.mensaje).toBe('Ya existe una obra con ese título');
  });
  it('debe actualizar una obra existente', async () => {
    const nuevaObra = {
        titulo: 'Obra Para Actualizar',
        imagen_url: 'http://url-de-imagen.com/imagen.jpg',
        descripcion: 'Descripción inicial de la obra'
    };
    const addResponse = await request(app).post('/api/obras').send(nuevaObra);
    const obraId = addResponse.body.id; 

   
    const datosActualizados = {
        titulo: 'Obra Actualizada',
        imagen_url: 'http://url-de-imagen.com/imagen-nueva.jpg',
        descripcion: 'Descripción actualizada de la obra'
    };

    const updateResponse = await request(app).put(`/api/obras/${obraId}`).send(datosActualizados);
    expect(updateResponse.status).toBe(200); 
});

it('debe devolver un error si se intenta modificar una obra con un título que ya existe', async () => {
  // Primero, añade dos obras diferentes
  const obra1 = {
      titulo: 'Obra Original',
      imagen_url: 'http://url-de-imagen.com/imagen1.jpg',
      descripcion: 'Descripción de la obra original'
  };
  await request(app).post('/api/obras').send(obra1);

  const obra2 = {
      titulo: 'Obra a Modificar',
      imagen_url: 'http://url-de-imagen.com/imagen2.jpg',
      descripcion: 'Descripción de la obra a modificar'
  };
  const addResponse = await request(app).post('/api/obras').send(obra2);
  const obraId = addResponse.body.id; // Asegúrate de que tu API devuelve el ID

  // Intenta actualizar la segunda obra para que tenga el mismo título que la primera
  const datosActualizados = {
      titulo: 'Obra Original', // Mismo título que la primera obra
      imagen_url: 'http://url-de-imagen.com/imagen-nueva.jpg',
      descripcion: 'Descripción actualizada de la obra'
  };

  // Actualizar la obra y esperar un error 409
  const updateResponse = await request(app).put(`/api/obras/${obraId}`).send(datosActualizados);
  expect(updateResponse.status).toBe(409);
  expect(updateResponse.body.mensaje).toBe('Ya existe una obra con ese título');
});

it('debe devolver un error 500 si ocurre un error en el servidor al actualizar una obra', async () => {
  // Añadir una obra para actualizarla
  const nuevaObra = {
      titulo: 'Obra para Error 500',
      imagen_url: 'http://url-de-imagen.com/imagen.jpg',
      descripcion: 'Descripción de la obra'
  };
  const addResponse = await request(app).post('/api/obras').send(nuevaObra);
  const obraId = addResponse.body.id; // Asegúrate de que tu API devuelve el ID

  // Datos para actualizar la obra
  const datosActualizados = {
      titulo: 'Obra Actualizada',
      imagen_url: 'http://url-de-imagen.com/imagen-nueva.jpg',
      descripcion: 'Descripción actualizada de la obra'
  };

  // Intentar actualizar la obra y esperar un error 500
  // Nota: Esta parte del código es solo un ejemplo y no simula un error 500 real
  const updateResponse = await request(app).put(`/api/obras/${obraId}`).send(datosActualizados);
  expect(updateResponse.status).toBe(500); // Esperar un error 500
});

it('debe devolver un error 400 si se intenta actualizar una obra sin proporcionar todos los campos requeridos', async () => {
  const nuevaObra = {
      titulo: 'Obra para Actualizar',
      imagen_url: 'http://url-de-imagen.com/imagen.jpg',
      descripcion: 'Descripción de la obra'
  };
  const addResponse = await request(app).post('/api/obras').send(nuevaObra);
  const obraId = addResponse.body.id; // Asegúrate de que tu API devuelve el ID

  
  const datosIncompletos = {
      titulo: 'Obra Actualizada',
  };

  // Intentar actualizar la obra con datos incompletos
  const updateResponse = await request(app).put(`/api/obras/${obraId}`).send(datosIncompletos);
  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.mensaje).toBe('Todos los campos son obligatorios');
});
module.exports = app;
});



