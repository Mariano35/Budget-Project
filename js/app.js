//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');



//Eventos
eventListener();

function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


//Clases
//Normalmente las clases se utilizan para los objetos
class Presupuesto{
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0 );
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //Extraemos los valores que necesitamos de la clase Presupuesto con destructuring
        const {presupuesto, restante} = cantidad;

        //Seleccionamos los id de los div donde queremos insertar los datos que ingresa el usuario
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
        //Crear el div con alerta
         const divMensaje = document.createElement('div');
         divMensaje.classList.add('text-center', 'alert');

         if (tipo === 'error') {
             divMensaje.classList.add('alert-danger');
         } else {
             divMensaje.classList.add('alert-success');
         }

         //Mensaje de Error

         divMensaje.textContent = mensaje;

         //Insertar en el HTML
         document.querySelector('.primario').insertBefore(divMensaje, formulario);

         //Quitarlo luego de segundos
         setTimeout(() => { divMensaje.remove() }, 3000);
    }

    mostrarGasto(gastos){


        this.limpiarHTML();

        //Iterar sobre los gastos
        gastos.forEach( gasto => {

            const { tipoGasto, cantidad, id } = gasto;

            //Crear un Li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
                ${tipoGasto}: <span class="btn btn-primary badge-pill"> $ ${cantidad} </span>
            `;

            console.log(nuevoGasto);

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'X';
            btnBorrar.onclick = () =>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //Comprobar porcentaje de gasto
        //Nos queda 25% o menos estamos en peligro
        if ( ( presupuesto / 4 ) >= restante) {

            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

            //Queda 50% o menos cuidado
        }else if (( presupuesto / 2 ) >= restante) {

            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');

        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success');
        }

        //Menor a cero
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha Agotado Gastador/a', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instancias
const ui = new UI();
let presupuesto; 

//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    //Leer los datos ingresados en el formulario
    const tipoGasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //Validar
    if (tipoGasto === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son Obligatorios', 'error');
        return

    } else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return
    }

    //Generar un objeto de tipo gasto
    const gasto = { 
        tipoGasto, 
        cantidad, 
        id: Date.now()
    }; 
    
    ///Añade nuevo gasto
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto Agregado Correctamente');


    //Imprimir gastos en el lado derecho
    const {gastos, restante} = presupuesto;
    ui.mostrarGasto(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reiniciar el formulario
    formulario.reset();
}

function eliminarGasto(id) {
    //Elimina los gastos de la clase
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGasto(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}