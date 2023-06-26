/***** INICIO DECLARACIÓN DE VARIABLES GLOBALES *****/

// Array de palos
let palos = ["viu", "cua", "hex", "cir"];
// Array de número de cartas
//let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
// En las pruebas iniciales solo se trabajará con cuatro cartas por palo:
let numeros = [9, 10, 11, 12];

// paso (top y left) en pixeles de una carta a la siguiente en un mazo
let paso = 5;

// Tapetes
let tapeteInicial   = document.getElementById("inicial");
let tapeteSobrantes = document.getElementById("sobrantes");
let tapeteReceptor1 = document.getElementById("receptor1");
let tapeteReceptor2 = document.getElementById("receptor2");
let tapeteReceptor3 = document.getElementById("receptor3");
let tapeteReceptor4 = document.getElementById("receptor4");

// Mazos
let mazoInicial   = [];
let mazoSobrantes = [];
let mazoReceptor1 = [];
let mazoReceptor2 = [];
let mazoReceptor3 = [];
let mazoReceptor4 = [];

// Contadores de cartas
let contInicial     = document.getElementById("contador_inicial");
let contSobrantes   = document.getElementById("contador_sobrantes");
let contReceptor1   = document.getElementById("contador_receptor1");
let contReceptor2   = document.getElementById("contador_receptor2");
let contReceptor3   = document.getElementById("contador_receptor3");
let contReceptor4   = document.getElementById("contador_receptor4");
let contMovimientos = document.getElementById("contador_movimientos");

// Tiempo
let contTiempo  = document.getElementById("contador_tiempo"); // span cuenta tiempo
let segundos 	 = 0;    // cuenta de segundos
let temporizador = null; // manejador del temporizador

/***** FIN DECLARACIÓN DE VARIABLES GLOBALES *****/


// Rutina asociada a boton reset
document.getElementById("reset").addEventListener("click", function() {
	resetGame();
});

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
			mazoInicial.push(carta);
		}
	}

	// Barajar y dejar mazoInicial en tapete inicial
	barajar(mazoInicial);
	cargarTapeteInicial(mazoInicial);

	// Puesta a cero de contadores de mazos
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, 0);
	setContador(contReceptor1, 0);
	setContador(contReceptor2, 0);
	setContador(contReceptor3, 0);
	setContador(contReceptor4, 0);
	setContador(contMovimientos, 0);


	// Barajar el mazo inicial
	barajar(mazoInicial);

	// Cargar las cartas en los tapetes receptores
	cargarTapeteReceptor(mazoReceptor1, contReceptor1);
	cargarTapeteReceptor(mazoReceptor2, contReceptor2);
	cargarTapeteReceptor(mazoReceptor3, contReceptor3);
	cargarTapeteReceptor(mazoReceptor4, contReceptor4);

	// Actualizar los contadores de cartas
	setContador(contInicial, mazoInicial.length);
	setContador(contSobrantes, mazoSobrantes.length);
	setContador(contReceptor1, mazoReceptor1.length);
	setContador(contReceptor2, mazoReceptor2.length);
	setContador(contReceptor3, mazoReceptor3.length);
	setContador(contReceptor4, mazoReceptor4.length);

	// Arrancar el conteo de tiempo
	arrancarTiempo();

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
 Esta función debe incrementar el número correspondiente al contenido textual
 del elemento que actúa de contador
 */
function incContador(contador) {
	contador.textContent = parseInt(contador.textContent) + 1;
}

/**
 Idem que anterior, pero decrementando
 */
function decContador(contador) {
	contador.textContent = parseInt(contador.textContent) - 1;
}

/**
 Similar a las anteriores, pero ajustando la cuenta al
 valor especificado
 */
function setContador(contador, valor) {
	contador.textContent = valor;
}

function resetGame() {
	// Limpiar los mazos
	mazoInicial = [];
	mazoSobrantes = [];
	mazoReceptor1 = [];
	mazoReceptor2 = [];
	mazoReceptor3 = [];
	mazoReceptor4 = [];

	// Limpiar los tapetes
	tapeteInicial.innerHTML = "";
	tapeteSobrantes.innerHTML = "";
	tapeteReceptor1.innerHTML = "";
	tapeteReceptor2.innerHTML = "";
	tapeteReceptor3.innerHTML = "";
	tapeteReceptor4.innerHTML = "";

	// Reiniciar contadores
	setContador(contInicial, 0);
	setContador(contSobrantes, 0);
	setContador(contReceptor1, 0);
	setContador(contReceptor2, 0);
	setContador(contReceptor3, 0);
	setContador(contReceptor4, 0);
	setContador(contMovimientos, 0);
	setContador(contTiempo, "00:00:00");

	// Reiniciar el temporizador
	if (temporizador) clearInterval(temporizador);
	segundos = 0;
}

// Obtener todas las cartas del mazo inicial
let cartasMazoInicial = document.getElementsByClassName("carta-inicial");
for (let carta of cartasMazoInicial) {
	mazoInicial.push(carta);
}

// Obtener todas las cartas del mazo de sobrantes
let cartasMazoSobrantes = document.getElementsByClassName("carta-sobrantes");
for (let carta of cartasMazoSobrantes) {
	mazoSobrantes.push(carta);
}

// Función para cargar las cartas en un tapete receptor
function cargarTapeteReceptor(mazoReceptor, contador) {
	for (let i = 0; i < palos.length; i++) {
		let carta = mazoInicial.pop();
		carta.classList.add(palos[i]);
		mazoReceptor.push(carta);
		tapeteReceptor.appendChild(carta);
		setContador(contador, mazoReceptor.length);
	}
}

// Resto del código...

// Llamada a la función para comenzar el juego al cargar la página
comenzarJuego();
