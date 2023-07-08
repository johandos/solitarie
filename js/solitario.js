/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes
let tapeteInicial   = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptorViu = document.getElementById("receptorViu");
let tapeteReceptorCua = document.getElementById("receptorCua");
let tapeteReceptorHex = document.getElementById("receptorHex");
let tapeteReceptorCir = document.getElementById("receptorCir");

// Mazos
let mazoInicial   = [];
let mazoSobrantes = [];
let mazoReceptorViu = [];
let mazoReceptorCua = [];
let mazoReceptorHex = [];
let mazoReceptorCir = [];

// Contadores de cartas
let contInicial     = document.getElementById("contador_inicial");
let contSobrantes   = document.getElementById("contador_sobrantes");
let contReceptorViu   = document.getElementById("contador_receptorViu");
let contReceptorCua   = document.getElementById("contador_receptorCua");
let contReceptorHex   = document.getElementById("contador_receptorHex");
let contReceptorCir   = document.getElementById("contador_receptorCir");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador


const viu = {
	"tapete": tapeteReceptorViu,
	"cont": contReceptorViu,
};

const cir = {
	"tapete": tapeteReceptorCir,
	"cont": contReceptorCir,
};

const hex = {
	"tapete": tapeteReceptorHex,
	"cont": contReceptorHex,
};

const cua = {
	"tapete": tapeteReceptorCua,
	"cont": contReceptorCua,
};

const receptorTapete = [ viu, cir, hex, cua];

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Rutina asociada a boton reset
document.getElementById("reset").addEventListener("click", function() {
	window.location.reload();
});

document.getElementById("sobrantes").addEventListener("click", function() {
	const elementosArray = Array.from(tapeteSobrantes.children);
	const ultimoElemento = elementosArray.pop();
	elementosArray.unshift(ultimoElemento);

	elementosArray.forEach((element) => tapeteSobrantes.appendChild(element));
});
const divElement = document.getElementById("inicial");
const ultimoHijo = divElement.lastElementChild;

ultimoHijo.draggable = true;

ultimoHijo.addEventListener("dragstart", dragStart);
ultimoHijo.addEventListener("dragend", dragEnd);

function dragStart(event) {
	event.dataTransfer.setData("text/plain", event.target.id);
	event.currentTarget.style.opacity = "0.5";
}

function dragEnd(event) {
	event.currentTarget.style.opacity = "1";
}

function generateDragForTapete() {
	tapeteReceptorViu.addEventListener("dragover", dragOver);
	tapeteReceptorViu.addEventListener("dragenter", dragEnter);
	tapeteReceptorViu.addEventListener("dragleave", dragLeave);
	tapeteReceptorViu.addEventListener("drop", drop);

	tapeteReceptorCua.addEventListener("dragover", dragOver);
	tapeteReceptorCua.addEventListener("dragenter", dragEnter);
	tapeteReceptorCua.addEventListener("dragleave", dragLeave);
	tapeteReceptorCua.addEventListener("drop", drop);

	tapeteReceptorHex.addEventListener("dragover", dragOver);
	tapeteReceptorHex.addEventListener("dragenter", dragEnter);
	tapeteReceptorHex.addEventListener("dragleave", dragLeave);
	tapeteReceptorHex.addEventListener("drop", drop);

	tapeteReceptorCir.addEventListener("dragover", dragOver);
	tapeteReceptorCir.addEventListener("dragenter", dragEnter);
	tapeteReceptorCir.addEventListener("dragleave", dragLeave);
	tapeteReceptorCir.addEventListener("drop", drop);

	tapeteSobrantes.addEventListener("dragover", dragOver);
	tapeteSobrantes.addEventListener("dragenter", dragEnter);
	tapeteSobrantes.addEventListener("dragleave", dragLeave);
	tapeteSobrantes.addEventListener("drop", drop);
}

generateDragForTapete();
function dragOver(event) {
	event.preventDefault();

	const cont = Array.from(tapeteSobrantes.children).filter((child) => child.tagName === 'IMG').length;
	setContador(contSobrantes, cont);
}

function dragEnter(event) {
	event.preventDefault();
	event.currentTarget.style.background = "lightgray";
}

function dragLeave(event) {
	event.currentTarget.style.background = "";

	const cont = Array.from(tapeteSobrantes.children).filter((child) => child.tagName === 'IMG').length;
	setContador(contSobrantes, cont);
}

function drop(event) {
	event.preventDefault();
	event.currentTarget.style.background = "";

	const carta = event.dataTransfer.getData("text/plain");
	const start = carta.lastIndexOf("/") + 1; // Obtener el índice del último "/"
	const end = carta.lastIndexOf("."); // Obtener el índice del último "."
	const element = carta.substring(start, end); // Extraer la subcadena entre los índices
	const nextChildNumber = element.split('-')[0]; // Extraer la subcadena entre los índices
	const endPalo = carta.lastIndexOf("-"); // Obtener el índice del último "-"
	const paloDrag = carta.substring(endPalo + 1, carta.lastIndexOf(".")); // Extraer la subcadena entre los índices
	setContador(contMovimientos, parseInt(contMovimientos.textContent)+1);

	/** Pasar la carta seleccionada a el tapete que corresponde **/
	receptorTapete.find((receptor) => {
		if (event.target.id === receptor.tapete.id){
			dragReceptorTapete(event, receptor.tapete, receptor.cont, parseInt(nextChildNumber), element, paloDrag)
		}
	});


	/** Pasar la carta seleccionada del tapete sobrante **/
	if (event.target.id === 'sobrantes'){
		dragCartaInTapete(element, tapeteSobrantes, contSobrantes);
	}


	const cont = Array.from(tapeteInicial.children).filter((child) => child.tagName === 'IMG').length;
	setContador(contInicial, cont);

	// contamos las cartas del tapete sobrantes luego de un movimiento
	const contS = Array.from(tapeteSobrantes.children).filter((child) => child.tagName === 'IMG').length;
	setContador(contSobrantes, contS);
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function validateLastChild(lastChildNumber, nextChildNumber){
	return (lastChildNumber - 1) === nextChildNumber;
}

function dragReceptorTapete(event, tapeteReceptor, contReceptor, nextChildNumber, element, paloDrag) {

	const contPrevious = Array.from(tapeteReceptor.children).filter((child) => child.tagName === 'IMG').length;
	let lasChildNumber = 0;
	let tapeteColor = tapeteReceptor.id
	if (contPrevious > 0){
		tapeteColor = tapeteReceptor.lastChild.id
		lasChildNumber = parseInt(tapeteColor.split('_')[1].split('-')[0]);
	}
	const tapetePalo = tapeteColor.substring(tapeteColor.length - 3).toLowerCase();
	if (getOtherPalo(tapetePalo).includes(paloDrag) && validateLastChild(lasChildNumber, nextChildNumber) ) {
		dragCartaInTapete(element, tapeteReceptor, contReceptor);
	}else{
		if (contPrevious === 0 && nextChildNumber === 12 && tapeteReceptor.id.includes(capitalize(paloDrag))){
			dragCartaInTapete(element, tapeteReceptor, contReceptor);
		}
	}
}

function getOtherPalo(paloDrag) {
	const paloColorNaranja = ['viu', 'cua'];
	const paloColorGris = ['hex', 'cir'];
	let palo = [];
	if(paloColorNaranja.includes(paloDrag)){
		palo = paloColorGris;
	}

	if(paloColorGris.includes(paloDrag)){
		palo = paloColorNaranja;
	}

	return palo;
}

function dragCartaInTapete(element, tapeteReceptor, contReceptor){
	const draggedElement = document.getElementById(`carta_${element}`);
	draggedElement.className = 'carta-tapete';
	draggedElement.style = '';
	tapeteReceptor.appendChild(draggedElement);

	const cont = Array.from(tapeteReceptor.children).filter((child) => child.tagName === 'IMG').length;
	setContador(contReceptor, cont);
}

// El juego arranca ya al cargar la página: no se espera a reiniciar
comenzarJuego();

// Desarrollo del comienzo de juego
function comenzarJuego() {
	/* Crear baraja, es decir crear el mazoInicial. Este será un array cuyos
    elementos serán elementos HTML <img>, siendo cada uno de ellos una carta.
    Sugerencia: en dos bucles for, bárranse los "palos" y los "numeros", formando
    oportunamente el nombre del fichero png que contiene a la carta (recuérdese poner
    el path correcto en la URL asociada al atributo src de <img>). Una vez creado
    el elemento img, inclúyase como elemento del array mazoInicial.
    */
	for (let i = 0; i < palos.length; i++) {
		for (let j = 0; j < numeros.length; j++) {
			let carta = document.createElement("img");
			carta.src = "./imagenes/baraja/" + numeros[j] + '-' + palos[i] + ".png";
			carta.id = "carta_" + numeros[j] + '-' + palos[i];
			mazoInicial.push(carta);
		}
	}

	// Barajar y dejar mazoInicial en tapete inicial
	barajar(mazoInicial);
	cargarTapeteInicial(mazoInicial);

	// Puesta a cero de contadores de mazos
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, 0);
	setContador(contReceptorViu, 0);
	setContador(contReceptorCua, 0);
	setContador(contReceptorHex, 0);
	setContador(contReceptorCir, 0);
	setContador(contMovimientos, 0);

	// Actualizar los contadores de cartas
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, mazoSobrantes.length);
	setContador(contReceptorViu, mazoReceptorViu.length);
	setContador(contReceptorCua, mazoReceptorCua.length);
	setContador(contReceptorHex, mazoReceptorHex.length);
	setContador(contReceptorCir, mazoReceptorCir.length);

	// Arrancar el conteo de tiempo
	arrancarTiempo();
}

/**
 Se debe encargar de arrancar el temporizador: cada 1000 ms se
 debe ejecutar una función que a partir de la cuenta autoincrementada
 de los segundos (segundos totales) visualice el tiempo oportunamente con el
 format hh:mm:ss en el contador adecuado.

 Para descomponer los segundos en horas, minutos y segundos pueden emplearse
 las siguientes igualdades:

 segundos = truncar (   segundos_totales % (60)                 )
 minutos  = truncar ( ( segundos_totales % (60*60) )     / 60   )
 horas    = truncar ( ( segundos_totales % (60*60*24)) ) / 3600 )

 donde % denota la operación módulo (resto de la división entre los operadores)

 Así, por ejemplo, si la cuenta de segundos totales es de 134 s, entonces será:
 00:02:14

 Como existe la posibilidad de "resetear" el juego en cualquier momento, hay que
 evitar que exista más de un temporizador simultáneo, por lo que debería guardarse
 el resultado de la llamada a setInterval en alguna variable para llamar oportunamente
 a clearInterval en su caso.
 */
function arrancarTiempo() {
	if (temporizador) clearInterval(temporizador);
	let hms = function() {
		let seg = Math.trunc(segundos % 60);
		let min = Math.trunc((segundos % 3600) / 60);
		let hor = Math.trunc((segundos % 86400) / 3600);
		let tiempo =
			(hor < 10 ? "0" + hor : "" + hor) +
			":" +
			(min < 10 ? "0" + min : "" + min) +
			":" +
			(seg < 10 ? "0" + seg : "" + seg);
		setContador(contTiempo, tiempo);
		segundos++;
	};
	segundos = 0;
	hms(); // Primera visualización 00:00:00
	temporizador = setInterval(hms, 1000);
}

/**
 Si mazo es un array de elementos <img>, en esta rutina debe ser
 reordenado aleatoriamente. Al ser un array un objeto, se pasa
 por referencia, de modo que si se altera el orden de dicho array
 dentro de la rutina, esto aparecerá reflejado fuera de la misma.
 */
function barajar(mazo) {
	for (let i = mazo.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[mazo[i], mazo[j]] = [mazo[j], mazo[i]];
	}
}

/**
 En el elemento HTML que representa el tapete inicial (variable tapeteInicial)
 se deben añadir como hijos todos los elementos <img> del array mazo.
 Antes de añadirlos, se deberían fijar propiedades como la anchura, la posición,
 coordenadas top y left, algún atributo de tipo data-...
 Al final se debe ajustar el contador de cartas a la cantidad oportuna
 */
function cargarTapeteInicial(mazo) {
	for (let i = 0; i < mazo.length; i++) {
		let carta = mazo[i];
		carta.style.width = "80px";
		carta.style.position = "absolute";
		carta.style.top = (i * paso) + "px";
		carta.style.left = (i * paso) + "px";
		tapeteInicial.appendChild(carta);
	}
}

/**
 Similar a las anteriores, pero ajustando la cuenta al
 valor especificado
 */
function setContador(contador, valor) {
	contador.textContent = valor;
}
