// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================
let nombre_archivo_blanco = "";
let nombre_archivo_negro = "";
let nombre_archivo_muestra = "";

let archivo_blanco = [];
let archivo_negro = [];
let archivo_muestra = [];

// Base de datos SQLite
let db = null;

// Datos para la animación simulada de prueba originales
const languages1 = ['Python', 'JS', 'C++', 'Java', 'HTML'];
const popularity1 = [11.27, 11.16, 10.46, 7.5, 5.26];
const colores1 = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

const languages2 = ['Ruby', 'Go', 'Rust', 'PHP', 'Swift'];
const popularity2 = [2.27, 3.16, 3.46, 10.5, 20.26];
const colores2 = ['#e67e22', '#1abc9c', '#e74c3c', '#34495e', '#d35400'];

let chartInstance = null;
let puertoSerial = null;
let animacionInterval = null; // Control de la animación simulada

// ============================================================================
// INICIALIZACIÓN (Reemplazo de inicio1)
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {
    inicializarGrafico();
    configurarEventos();
    iniciarAnimacionSimulada();
    
    // Inicializar Motor SQLite
    try {
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
        window.SQL = SQL;
        console.log("Motor SQLite (SQL.js) cargado correctamente.");
    } catch (err) {
        console.error("Error al cargar SQL.js:", err);
    }
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

function configurarEventos() {
    // Configuración de Base de datos
    document.getElementById('file-db').addEventListener('change', cargarBaseDatos);
    document.getElementById('btn-listar').addEventListener('click', listarRegistrosSQLite);
    
    // Conectores a la memoria
    document.getElementById('btn-cargar-blanco').addEventListener('click', () => extraerRegistroBD('blanco'));
    document.getElementById('btn-cargar-negro').addEventListener('click', () => extraerRegistroBD('negro'));
    document.getElementById('btn-cargar-muestra').addEventListener('click', () => extraerRegistroBD('muestra'));
    
    // Controles de Hardware originales
    document.getElementById('btn-enviar').addEventListener('click', () => {
        prueba_progreso();
        grabar_muestra_simulado();
    });
    document.getElementById('btn-conectar').addEventListener('click', conectarHardware);
}

// ============================================================================
// LECTURA DE BASE DE DATOS SQLITE (Reemplazo del CSV FileReader)
// ============================================================================

// 1. Cargar archivo .db a la memoria
function cargarBaseDatos(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const Uints = new Uint8Array(reader.result);
        db = new window.SQL.Database(Uints);
        alert("¡Base de datos cargada exitosamente!");
    };
    reader.readAsArrayBuffer(file);
}

// 2. Buscar y listar registros mostrando (Nombre, Código, Fecha)
function listarRegistrosSQLite() {
    if (!db) { alert("Primero debes seleccionar el archivo .db"); return; }
    
    const tabla = document.getElementById('select-tabla').value;
    let colNombre = tabla === 'muestras' ? 'nombre_muestra' : `nombre_${tabla.slice(0, -1)}`;

    try {
        const query = `SELECT ${colNombre}, codigo_fermentacion, fecha, hora FROM ${tabla}`;
        const res = db.exec(query);
        const sel = document.getElementById('select-registros');
        sel.innerHTML = '';

        if (res.length > 0) {
            res[0].values.forEach(row => {
                let opt = document.createElement('option');
                // Almacenamos los datos clave en JSON para luego buscarlos exactamente
                opt.value = JSON.stringify({tabla: tabla, nombre: row[0], codigo: row[1], fecha: row[2], hora: row[3]});
                opt.text = `${row[0]} | Cód: ${row[1]} | Fecha: ${row[2]}`;
                sel.appendChild(opt);
            });
        } else {
            sel.innerHTML = '<option value="">La tabla está vacía</option>';
        }
    } catch (err) {
        alert("Error al leer la tabla: " + err.message);
    }
}

// 3. Extraer s1 a s288 y cargarlo en la variable correspondiente
function extraerRegistroBD(tipoDestino) {
    if (!db) { alert("Base de datos no cargada"); return; }
    
    const selectValue = document.getElementById('select-registros').value;
    if (!selectValue) { alert("Debes seleccionar un registro de la lista"); return; }

    const pk = JSON.parse(selectValue);
    let colNombre = pk.tabla === 'muestras' ? 'nombre_muestra' : `nombre_${pk.tabla.slice(0, -1)}`;

    // Hacer la consulta exacta a esa fila
    const query = `SELECT * FROM ${pk.tabla} WHERE ${colNombre}='${pk.nombre}' AND codigo_fermentacion=${pk.codigo} AND fecha='${pk.fecha}' AND hora='${pk.hora}'`;
    const res = db.exec(query);

    if (res.length > 0) {
        const columns = res[0].columns;
        const values = res[0].values[0];

        // Extraer específicamente los campos desde s1 hasta s288
        let espectroExtraido = [];
        for (let i = 1; i <= 288; i++) {
            let colIndex = columns.indexOf(`s${i}`);
            espectroExtraido.push(colIndex !== -1 ? values[colIndex] : 0);
        }

        // Asignar al estado global de la aplicación igual que tu código original
        if (tipoDestino === 'blanco') {
            archivo_blanco = espectroExtraido;
            nombre_archivo_blanco = pk.nombre;
            console.log("Blanco cargado:", archivo_blanco);
            alert(`Blanco [${pk.nombre}] cargado exitosamente.`);
        } 
        else if (tipoDestino === 'negro') {
            archivo_negro = espectroExtraido;
            nombre_archivo_negro = pk.nombre;
            console.log("Negro cargado:", archivo_negro);
            alert(`Negro [${pk.nombre}] cargado exitosamente.`);
        } 
        else if (tipoDestino === 'muestra') {
            archivo_muestra = espectroExtraido;
            nombre_archivo_muestra = pk.nombre;
            console.log("Muestra cargada:", archivo_muestra);
            alert(`Muestra [${pk.nombre}] cargada exitosamente.`);
            
            // Opcional: Detener la animación de prueba y graficar la muestra cargada
            clearInterval(animacionInterval);
            chartInstance.data.labels = Array.from({length: 288}, (_, i) => `s${i+1}`);
            chartInstance.data.datasets[0].data = archivo_muestra;
            chartInstance.data.datasets[0].label = `Muestra Cargada: ${pk.nombre}`;
            chartInstance.data.datasets[0].backgroundColor = '#2980b9';
            chartInstance.update();
        }
    }
}

function cerrar_muestra() {
    console.log("Cerrando muestra previa...");
    document.getElementById('progreso-bloque').style.display = 'none';
}

// ============================================================================
// HARDWARE Y SIMULACIONES ORIGINALES
// ============================================================================
async function conectarHardware() {
    if (!("serial" in navigator)) {
        alert("Tu navegador no soporta comunicación Serial por hardware. Usa Google Chrome o Edge.");
        return;
    }
    try {
        puertoSerial = await navigator.serial.requestPort();
        await puertoSerial.open({ baudRate: 9600 });
        alert("¡Hardware conectado exitosamente a la Web!");
    } catch (error) {
        console.error("Error conectando al puerto serial:", error);
    }
}

function iniciarAnimacionSimulada() {
    let i = 0;
    animacionInterval = setInterval(() => {
        i++;
        if (i >= 20) i = 1; 
        
        if (i < 10) {
            chartInstance.data.labels = languages1;
            chartInstance.data.datasets[0].data = popularity1;
            chartInstance.data.datasets[0].backgroundColor = colores1;
        } else {
            chartInstance.data.labels = languages2;
            chartInstance.data.datasets[0].data = popularity2;
            chartInstance.data.datasets[0].backgroundColor = colores2;
        }
        chartInstance.update('none'); 
    }, 250);
}

function prueba_progreso(
