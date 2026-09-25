// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================
let nombre_archivo_blanco = "";
let nombre_archivo_negro = "";
let nombre_archivo_muestra = "";

let archivo_blanco = [];
let archivo_negro = [];
let archivo_muestra = [];

// Longitudes de onda por defecto (según tu string de Python)
const espectro_ondas =;
let spectroReadings1 = []; // Simulación de lecturas de hardware

// Datos para la animación simulada de prueba
const languages1 = ['Python', 'JS', 'C++', 'Java', 'HTML'];
const popularity1 =;
const colores1 = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

const languages2 = ['Ruby', 'Go', 'Rust', 'PHP', 'Swift'];
const popularity2 =;
const colores2 = ['#e67e22', '#1abc9c', '#e74c3c', '#34495e', '#d35400'];

let chartInstance = null;
let puertoSerial = null; // Para conectar hardware real desde el navegador

// ============================================================================
// INICIALIZACIÓN (Reemplazo de inicio1)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarGrafico();
    configurarEventos();
    iniciarAnimacionSimulada(); // Inicia el equivalente de FuncAnimation
});

function inicializarGrafico() {
    const ctx = document.getElementById('espectroChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: languages1,
            datasets: [{
                label: 'Popularidad / Intensidad',
                data: popularity1,
                backgroundColor: colores1,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Top Programming Languages / Espectro' }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Configura los listeners de los elementos HTML (Reemplazo de los commands de Tkinter)
function configurarEventos() {
    document.getElementById('file-blanco').addEventListener('change', (e) => leerArchivo(e, 'blanco'));
    document.getElementById('file-negro').addEventListener('change', (e) => leerArchivo(e, 'negro'));
    document.getElementById('file-muestra').addEventListener('change', (e) => leerArchivo(e, 'muestra'));
    document.getElementById('btn-enviar').addEventListener('click', () => {
        prueba_progreso();
        grabar_muestra_simulado();
    });
    document.getElementById('btn-conectar').addEventListener('click', conectarHardware);
}

// ============================================================================
// EQUIVALENTE A FUNCANIMATION (Matplotlib)
// ============================================================================
function iniciarAnimacionSimulada() {
    let i = 0;
    setInterval(() => {
        i++;
        if (i >= 20) i = 1; // np.arange(1, 20)
        
        console.log("i =", i);
        
        // Lógica de update idéntica a tu función animate1(i)
        if (i < 10) {
            chartInstance.data.labels = languages1;
            chartInstance.data.datasets[0].data = popularity1;
            chartInstance.data.datasets[0].backgroundColor = colores1;
        } else {
            chartInstance.data.labels = languages2;
            chartInstance.data.datasets[0].data = popularity2;
            chartInstance.data.datasets[0].backgroundColor = colores2;
        }
        chartInstance.update('none'); // Actualiza el gráfico sin animaciones bruscas
    }, 250); // 250ms de intervalo
}

// ============================================================================
// PROCESAMIENTO MATRICIAL (Reemplazo de NumPy y Pandas)
// ============================================================================

const transponerMatriz = (matriz) => 
    matriz.map((_, colIndex) => matriz.map(row => row[colIndex]));

function leerArchivo(evento, tipo) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function(e) {
        const contenido = e.target.result;
        if (tipo === 'blanco') crear_blanco(contenido, archivo.name);
        if (tipo === 'negro') crear_negro(contenido, archivo.name);
        if (tipo === 'muestra') crear_muestra(contenido, archivo.name);
    };
    lector.readAsText(archivo);
}

function cerrar_muestra() {
    console.log("Cerrando muestra previa...");
    document.getElementById('progreso-bloque').style.display = 'none';
}

function crear_blanco(contenidoCSV, nombre) {
    cerrar_muestra();
    archivo_blanco = [];

    // Parsear filas delimitadas por ';' y procesar un máximo de 288 filas
    let filas = contenidoCSV.trim().split("\n").slice(0, 288);
    let matriz = filas.map(fila => fila.split(";").map(val => Math.round(parseFloat(val) || 0)));

    let matrizTranspuesta = transponerMatriz(matriz);
    archivo_blanco = matrizTranspuesta[matrizTranspuesta.length - 1]; // Última columna

    nombre_archivo_blanco = nombre;
    console.log("Archivo blanco inicializado:", archivo_blanco);
}

function crear_negro(contenidoCSV, nombre) {
    cerrar_muestra();
    archivo_negro = [];

    let filas = contenidoCSV.trim().split("\n").slice(0, 288);
    let matriz = filas.map(fila => fila.split(";").map(val => Math.round(parseFloat(val) || 0)));

    let matrizTranspuesta = transponerMatriz(matriz);
    archivo_negro = matrizTranspuesta[matrizTranspuesta.length - 1];

    nombre_archivo_negro = nombre;
    console.log("Archivo negro inicializado:", archivo_negro);
}

function convertir_fila(fila) {
    let primeraCelda = String(fila[0]).toUpperCase();
    if (["PH", "DENSIDAD", "ALCOHOL"].includes(primeraCelda)) {
        return fila; 
    }
    return fila.map(x => {
        let num = parseFloat(x);
        return isNaN(num) ? x : Math.round(num);
    });
}

function crear_muestra(contenidoCSV, nombre) {
    cerrar_muestra();

    if (nombre_archivo_blanco.length < 1) {
        alert("Error falta archivo de blancos: Debe cargar archivo de blancos");
        return;
    }

    let filas = contenidoCSV.trim().split("\n");
    let df = filas.map(fila => fila.split(";"));

    // Aplicar conversión por filas (Equivalente al axis=1 de Pandas)
    df = df.map(fila => convertir_fila(fila));

    let archivo_muestra_completo = transponerMatriz(df);
    archivo_muestra = archivo_muestra_completo.slice(0, 288); // Recorte matricial [:288, :]

    nombre_archivo_muestra = nombre;
    console.log("Archivo Muestra procesado con éxito.");
}

// ============================================================================
// HARDWARE / WEB SERIAL API (Reemplazo de serial/list_ports de Python)
// ============================================================================
async function conectarHardware() {
    if (!("serial" in navigator)) {
        alert("Tu navegador no soporta comunicación Serial por hardware. Usa Google Chrome o Edge.");
        return;
    }
    try {
        // Pide permiso al usuario para abrir el puerto COM/USB
        puertoSerial = await navigator.serial.requestPort();
        await puertoSerial.open({ baudRate: 9600 });
        alert("¡Hardware conectado exitosamente a la Web!");
    } catch (error) {
        console.error("Error conectando al puerto serial:", error);
    }
}

// ============================================================================
// INTERFAZ DE PROGRESO SIMULADA (Reemplazo del hilo/thread de progreso)
// ============================================================================
function prueba_progreso() {
    cerrar_muestra();
    const bloque = document.getElementById('progreso-bloque');
    const barra = document.getElementById('progreso-barra');
    
    bloque.style.display = 'block';
    barra.value = 0;

    let intervalo = setInterval(() => {
        barra.value += 10; // Incremento
        if (barra.value >= 100) {
            clearInterval(intervalo);
            setTimeout(() => bloque.style.display = 'none', 500);
        }
    }, 100);
}

function grabar_muestra_simulado() {
    console.log("Generando archivo CSV para descarga...");
    // Aquí puedes disparar una descarga automática del archivo modificado si lo deseas
}
