// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================
let db = null; // Contendrá la instancia de la base de datos SQLite
let chartInstance = null;
let hardwareData = new Array(288).fill(0); // Arreglo que simula las s1 a s288
let simulacionActiva = false;

// Generar etiquetas (s1 a s288)
const labels288 = Array.from({length: 288}, (_, i) => `s${i+1}`);

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
document.addEventListener("DOMContentLoaded", async () => {
    inicializarGrafico();
    configurarEventosHardware();
    await inicializarSQLite();
});

// ============================================================================
// SQLITE: INICIALIZACIÓN Y MANEJO DE ARCHIVOS
// ============================================================================
async function inicializarSQLite() {
    try {
        // Carga la librería WebAssembly de sql.js desde CDN
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        window.SQL = SQL;
        console.log("SQL.js inicializado correctamente.");
    } catch (err) {
        console.error("Error al cargar SQL.js:", err);
    }
}

// Evento para leer el archivo .db
document.getElementById('file-db').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function() {
        const Uints = new Uint8Array(reader.result);
        db = new window.SQL.Database(Uints);
        alert("¡Base de datos cargada exitosamente!");
    };
    reader.readAsArrayBuffer(file);
});

// Descargar Base de datos modificada
function descargarBD() {
    if (!db) { alert("No hay ninguna base de datos cargada."); return; }
    
    const data = db.export(); // Extrae la DB de la memoria
    const buffer = new Uint8Array(data);
    const blob = new Blob([buffer], {type: "application/octet-stream"});
    
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "muestras_espectro_actualizada.db";
    a.click();
}

// ============================================================================
// SQLITE: LECTURA Y BÚSQUEDA
// ============================================================================
function listarRegistros() {
    if (!db) { alert("Primero debes cargar la base de datos."); return; }
    
    const tabla = document.getElementById('select-tabla-buscar').value;
    // Determinar la columna de nombre según la tabla
    let colNombre = `nombre_${tabla.slice(0, -1)}`; // blancos -> nombre_blanco
    if (tabla === 'muestras') colNombre = 'nombre_muestra';

    try {
        // Ejecutar consulta SELECT
        const query = `SELECT ${colNombre}, codigo_fermentacion, fecha, hora FROM ${tabla}`;
        const res = db.exec(query);
        const selectElement = document.getElementById('select-registros');
        selectElement.innerHTML = ''; // Limpiar lista

        if (res.length > 0) {
            res[0].values.forEach(row => {
                const opt = document.createElement('option');
                // Guardamos las llaves primarias en un JSON dentro del option
                opt.value = JSON.stringify({ nombre: row[0], codigo: row[1], fecha: row[2], hora: row[3] });
                // Mostramos formato: Nombre | Código | Fecha
                opt.text = `${row[0]} | Cód: ${row[1]} | ${row[2]} ${row[3]}`;
                selectElement.appendChild(opt);
            });
        } else {
            selectElement.innerHTML = '<option value="">No hay registros en esta tabla</option>';
        }
    } catch (err) {
        alert("Error al leer la tabla: Verifique que exista en la BD.\n" + err.message);
    }
}

function cargarRegistroAlGrafico() {
    if (!db) return;
    const tabla = document.getElementById('select-tabla-buscar').value;
    const seleccion = document.getElementById('select-registros').value;
    
    if (!seleccion) { alert("Seleccione un registro válido."); return; }
    
    const pk = JSON.parse(seleccion);
    let colNombre = tabla === 'muestras' ? 'nombre_muestra' : `nombre_${tabla.slice(0, -1)}`;

    // Extraer todo el registro
    const query = `SELECT * FROM ${tabla} WHERE ${colNombre}='${pk.nombre}' AND codigo_fermentacion=${pk.codigo} AND fecha='${pk.fecha}' AND hora='${pk.hora}'`;
    const res = db.exec(query);

    if (res.length > 0) {
        const columns = res[0].columns;
        const rowData = res[0].values[0];

        // Extraer los 288 valores espectrales (s1 a s288)
        let espectroCargado = [];
        for (let i = 1; i <= 288; i++) {
            let colIndex = columns.indexOf(`s${i}`);
            espectroCargado.push(colIndex !== -1 ? rowData[colIndex] : 0);
        }

        // Detener animación simulada y pintar gráfico
        simulacionActiva = false;
        chartInstance.data.datasets[0].data = espectroCargado;
        chartInstance.data.datasets[0].backgroundColor = '#3498db';
        chartInstance.data.datasets[0].label = `Registro Cargado: ${pk.nombre}`;
        chartInstance.update();

        // Extraer metadatos para rellenar los inputs
        document.getElementById('input-nombre').value = pk.nombre;
        document.getElementById('input-codigo').value = pk.codigo;
        document.getElementById('input-ph').value = rowData[columns.indexOf('ph')] || "";
        document.getElementById('input-densidad').value = rowData[columns.indexOf('densidad')] || "";
        document.getElementById('input-alcohol').value = rowData[columns.indexOf('alcohol')] || "";

        alert(`Lectura cargada desde la tabla ${tabla.toUpperCase()}`);
    }
}

// ============================================================================
// SQLITE: INSERCIÓN (GRABAR)
// ============================================================================
function grabarRegistroDB(tabla) {
    if (!db) { alert("Primero debes cargar la base de datos."); return; }

    const nombre = document.getElementById('input-nombre').value || "Muestra_Desconocida";
    const codigo = parseInt(document.getElementById('input-codigo').value) || 0;
    const ph = parseFloat(document.getElementById('input-ph').value) || 0;
    const densidad = parseFloat(document.getElementById('input-densidad').value) || 0;
    const alcohol = parseFloat(document.getElementById('input-alcohol').value) || 0;

    // Obtener Fecha y Hora actuales (Formato DD-MM-YYYY y HH:MM:SS)
    const now = new Date();
    const fechaStr = now.toLocaleDateString('es-CL').replace(/\//g, '-');
    const horaStr = now.toLocaleTimeString('es-CL');

    let colNombre = tabla === 'muestras' ? 'nombre_muestra' : `nombre_${tabla.slice(0, -1)}`;

    // Preparar el SQL dinámicamente para las 288 columnas
    let columnasSQL = `${colNombre}, codigo_fermentacion, fecha, hora, ph, densidad, alcohol`;
    let placeholdersSQL = `?, ?, ?, ?, ?, ?, ?`;
    let valoresInsert = [nombre, codigo, fechaStr, horaStr, ph, densidad, alcohol];

    for (let i = 1; i <= 288; i++) {
        columnasSQL += `, s${i}`;
        placeholdersSQL += `, ?`;
        valoresInsert.push(hardwareData[i-1]); // Agrega el valor de la lectura actual
    }

    const sqlQuery = `INSERT INTO ${tabla} (${columnasSQL}) VALUES (${placeholdersSQL})`;

    try {
        db.run(sqlQuery, valoresInsert);
        alert(`¡Registro guardado correctamente en la tabla ${tabla.toUpperCase()}!\n\nNota: Recuerda presionar "Descargar BD Actualizada" antes de cerrar la página para no perder los datos.`);
    } catch (err) {
        alert("Error al insertar el registro. Verifique que no exista duplicado de llave primaria.\n" + err.message);
    }
}

// ============================================================================
// HARDWARE / SIMULACIÓN Y GRÁFICO
// ============================================================================
function inicializarGrafico() {
    const ctx = document.getElementById('espectroChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels288,
            datasets: [{
                label: 'Espectro (s1 - s288)',
                data: hardwareData,
                backgroundColor: '#2ecc71',
                borderWidth: 0,
                barPercentage: 1.0,
                categoryPercentage: 1.0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { display: false } }, // Ocultamos los 288 nombres por limpieza visual
                y: { beginAtZero: true, max: 1000 }
            }
        }
    });
}

function configurarEventosHardware() {
    document.getElementById('btn-conectar').addEventListener('click', async () => {
        if (!("serial" in navigator)) { alert("Web Serial API no soportada en este navegador."); return; }
        try { await navigator.serial.requestPort(); alert("Hardware conectado."); } 
        catch (error) { console.error("Error serial:", error); }
    });

    document.getElementById('btn-enviar').addEventListener('click', () => {
        // Al hacer clic, generamos 288 datos aleatorios simulando el sensor y animamos el gráfico
        simulacionActiva = true;
        simularLecturaEnVivo();
    });
}

function simularLecturaEnVivo() {
    let ciclos = 0;
    const interval = setInterval(() => {
        if (!simulacionActiva || ciclos > 10) { clearInterval(interval); return; }
        ciclos++;
        
        // Simular onda de campana con ruido
        for(let i=0; i<288; i++) {
            let base = 500 * Math.exp(-Math.pow((i - 144) / 50, 2));
            hardwareData[i] = Math.max(0, base + (Math.random() * 100 - 50));
        }
        
        chartInstance.data.datasets[0].data = hardwareData;
        chartInstance.data.datasets[0].backgroundColor = '#e74c3c';
        chartInstance.data.datasets[0].label = "Lectura Hardware en Vivo";
        chartInstance.update('none');

    }, 150);
}
