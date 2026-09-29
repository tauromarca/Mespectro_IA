// ==========================================
// 1. GENERACIÓN DE LONGITUDES DE ONDA Y COLORES
// ==========================================
const A_0 = 2.991638797E+02, B_1 = 2.694248478E+00, B_2 = -8.556340170E-04;
const B_3 = -9.851009025E-06, B_4 = 1.633909302E-08, B_5 = -3.346647530E-12;

let nm = [];
let bgColors = [];

function getColorParaOnda(onda) {
    if (onda < 380) return "darkviolet";
    if (onda < 410) return "blueviolet";
    if (onda < 450) return "violet";
    if (onda < 480) return "blue";
    if (onda < 500) return "cyan";
    if (onda < 550) return "green";
    if (onda < 570) return "greenyellow";
    if (onda < 580) return "yellow";
    if (onda < 620) return "orange";
    if (onda < 700) return "red";
    if (onda <= 760) return "darkred";
    return "maroon";
}

for (let i = 1; i <= 288; i++) {
    let wave = A_0 + (B_1 * i) + (B_2 * Math.pow(i, 2)) + (B_3 * Math.pow(i, 3)) + (B_4 * Math.pow(i, 4)) + (B_5 * Math.pow(i, 5));
    let waveInt = Math.round(wave);
    nm.push(waveInt); 
    bgColors.push(getColorParaOnda(waveInt));
}

// ==========================================
// 2. TABLAS CIE Y FUNCIONES
// ==========================================
const CIE_CMF = [
    {wl: 340, x: 0.0000, y: 0.0000, z: 0.0000}, {wl: 350, x: 0.0000, y: 0.0000, z: 0.0000},
    {wl: 360, x: 0.0001, y: 0.0000, z: 0.0006}, {wl: 370, x: 0.0014, y: 0.0000, z: 0.0065},
    {wl: 380, x: 0.0014, y: 0.0000, z: 0.0065}, {wl: 390, x: 0.0042, y: 0.0001, z: 0.0201},
    {wl: 400, x: 0.0143, y: 0.0004, z: 0.0679}, {wl: 410, x: 0.0435, y: 0.0012, z: 0.2074},
    {wl: 420, x: 0.1344, y: 0.0040, z: 0.6456}, {wl: 430, x: 0.2839, y: 0.0116, z: 1.3856},
    {wl: 440, x: 0.3483, y: 0.0230, z: 1.7471}, {wl: 450, x: 0.3362, y: 0.0380, z: 1.7721},
    {wl: 460, x: 0.2908, y: 0.0600, z: 1.6692}, {wl: 470, x: 0.1954, y: 0.0910, z: 1.2876},
    {wl: 480, x: 0.0956, y: 0.1390, z: 0.8130}, {wl: 490, x: 0.0320, y: 0.2080, z: 0.4652},
    {wl: 500, x: 0.0049, y: 0.3230, z: 0.2720}, {wl: 510, x: 0.0093, y: 0.5030, z: 0.1582},
    {wl: 520, x: 0.0633, y: 0.7100, z: 0.0782}, {wl: 530, x: 0.1655, y: 0.8620, z: 0.0422},
    {wl: 540, x: 0.2904, y: 0.9540, z: 0.0203}, {wl: 550, x: 0.4334, y: 0.9950, z: 0.0087},
    {wl: 560, x: 0.5945, y: 0.9950, z: 0.0039}, {wl: 570, x: 0.7621, y: 0.9520, z: 0.0021},
    {wl: 580, x: 0.9163, y: 0.8700, z: 0.0017}, {wl: 590, x: 1.0263, y: 0.7570, z: 0.0011},
    {wl: 600, x: 1.0622, y: 0.6310, z: 0.0008}, {wl: 610, x: 1.0026, y: 0.5030, z: 0.0003},
    {wl: 620, x: 0.8544, y: 0.3810, z: 0.0002}, {wl: 630, x: 0.6424, y: 0.2650, z: 0.0000},
    {wl: 640, x: 0.4479, y: 0.1750, z: 0.0000}, {wl: 650, x: 0.2835, y: 0.1070, z: 0.0000},
    {wl: 660, x: 0.1649, y: 0.0610, z: 0.0000}, {wl: 670, x: 0.0874, y: 0.0320, z: 0.0000},
    {wl: 680, x: 0.0468, y: 0.0170, z: 0.0000}, {wl: 690, x: 0.0227, y: 0.0082, z: 0.0000},
    {wl: 700, x: 0.0114, y: 0.0041, z: 0.0000}, {wl: 710, x: 0.0058, y: 0.0021, z: 0.0000},
    {wl: 720, x: 0.0029, y: 0.0010, z: 0.0000}, {wl: 730, x: 0.0014, y: 0.0005, z: 0.0000},
    {wl: 740, x: 0.0007, y: 0.0003, z: 0.0000}, {wl: 750, x: 0.0003, y: 0.0001, z: 0.0000},
    {wl: 760, x: 0.0002, y: 0.0001, z: 0.0000}, {wl: 770, x: 0.0001, y: 0.0000, z: 0.0000},
    {wl: 780, x: 0.0000, y: 0.0000, z: 0.0000}, {wl: 850, x: 0.0000, y: 0.0000, z: 0.0000}
];

function getCMF(wave) {
    if (wave <= 340) return CIE_CMF[0];
    if (wave >= 850) return CIE_CMF[CIE_CMF.length - 1];
    for (let i = 0; i < CIE_CMF.length - 1; i++) {
        let p1 = CIE_CMF[i], p2 = CIE_CMF[i + 1];
        if (wave >= p1.wl && wave <= p2.wl) {
            let t = (wave - p1.wl) / (p2.wl - p1.wl);
            return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y), z: p1.z + t * (p2.z - p1.z) };
        }
    }
    return {x:0, y:0, z:0};
}

const D65 = [
    {w: 340, v: 39.9}, {w: 360, v: 46.6}, {w: 380, v: 50.0}, {w: 400, v: 82.8}, {w: 420, v: 93.4}, {w: 440, v: 104.9}, 
    {w: 460, v: 117.8}, {w: 480, v: 115.9}, {w: 500, v: 109.4}, {w: 520, v: 104.8}, {w: 540, v: 104.4}, {w: 560, v: 100.0}, 
    {w: 580, v: 95.8}, {w: 600, v: 90.0}, {w: 620, v: 87.7}, {w: 640, v: 83.7}, {w: 660, v: 80.2}, {w: 680, v: 78.3}, 
    {w: 700, v: 71.6}, {w: 720, v: 61.6}, {w: 740, v: 75.1}, {w: 760, v: 46.4}, {w: 780, v: 63.4}, {w: 850, v: 59.5}
];

function getD65(wl) {
    if (wl <= 340) return D65[0].v;
    if (wl >= 850) return D65[D65.length-1].v;
    for(let i=0; i<D65.length-1; i++){
        if(wl >= D65[i].w && wl <= D65[i+1].w){
            let t = (wl - D65[i].w)/(D65[i+1].w - D65[i].w);
            return D65[i].v + t*(D65[i+1].v - D65[i].v);
        }
    }
    return 100.0;
}

function XYZto_up_vp(X, Y, Z) {
    let denom = X + 15 * Y + 3 * Z;
    if (denom === 0) return {x: 0.2105, y: 0.4739}; 
    return { x: (4 * X) / denom, y: (9 * Y) / denom };
}

function XYZto_sRGB(X, Y, Z) {
    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    let gamma = (c) => {
        let abs_c = Math.abs(c);
        let res = abs_c <= 0.0031308 ? 12.92 * abs_c : 1.055 * Math.pow(abs_c, 1 / 2.4) - 0.055;
        return c < 0 ? -res : res;
    };
    return [gamma(r), gamma(g), gamma(b)];
}

function uvToColorHex(u, v) {
    const divisor = 6 * u - 16 * v + 12;
    if (divisor <= 0 || v <= 0) return null;
    const x = (9 * u) / divisor, y = (4 * v) / divisor;
    if (y <= 0) return null;

    const X = x / y, Y = 1, Z = (1 - x - y) / y;

    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    const minRGB = Math.min(r, g, b);
    if (minRGB < 0) { r -= minRGB; g -= minRGB; b -= minRGB; }
    const maxRGB = Math.max(r, g, b);
    if (maxRGB <= 0) return "rgb(0,0,0)";
    r /= maxRGB; g /= maxRGB; b /= maxRGB;

    function gammaSRGB(c) {
        c = Math.max(0, Math.min(1, c));
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }
    return `rgb(${Math.round(gammaSRGB(r)*255)},${Math.round(gammaSRGB(g)*255)},${Math.round(gammaSRGB(b)*255)})`;
}

let locusData = [];
for (let wl = 380; wl <= 700; wl += 5) {
    let cmf = getCMF(wl);
    let coords = XYZto_up_vp(cmf.x, cmf.y, cmf.z);
    if (coords.x !== 0 && coords.y !== 0) locusData.push({ wl: wl, x: coords.x, y: coords.y });
}

// ==========================================
// 3. ESTADO GLOBAL DE DATOS Y SQLITE
// ==========================================
let isMonitoring = false, monitorInterval;
let currentData = new Array(288).fill(0), darkData = null, blankData = null, sampleData = null;

let db = null; // Instancia SQLite global

// AL CARGAR LA PÁGINA: Inicializar SQL.js y descargar la BD automáticamente
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
        window.SQL = SQL;
        
        // Cargar archivo muestras_espectro.db
        const response = await fetch("muestras_espectro.db");
        if (!response.ok) throw new Error("No se encontró muestras_espectro.db en el servidor.");
        
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        
        document.getElementById('db-status').innerHTML = "✔️ BD Cargada.";
        document.getElementById('db-status').style.color = "#2ecc71";
        document.getElementById('btnExportDB').style.display = "block";
        
        actualizarListasDesplegables();

    } catch (err) {
        console.error("Error cargando la base de datos:", err);
        document.getElementById('db-status').innerHTML = "❌ Error al cargar BD. Debe alojarse en un servidor Web.";
        document.getElementById('db-status').style.color = "#e74c3c";
    }
});

// Poblar los 3 selects
function actualizarListasDesplegables() {
    if (!db) return;
    llenarSelect('blancos', 'nombre_blanco', 'select-blancos');
    llenarSelect('negros', 'nombre_negro', 'select-negros');
    llenarSelect('muestras', 'nombre_muestra', 'select-muestras');
}

function llenarSelect(tabla, colNombre, selectId) {
    const sel = document.getElementById(selectId);
    sel.innerHTML = '';
    try {
        const query = `SELECT ${colNombre}, codigo_fermentacion, fecha FROM ${tabla}`;
        const res = db.exec(query);
        if (res.length > 0) {
            res[0].values.forEach(row => {
                let opt = document.createElement('option');
                opt.value = JSON.stringify({ nombre: row[0], fecha: row[2] });
                opt.text = `${row[0]} | Fecha: ${row[2]}`;
                sel.appendChild(opt);
            });
        } else {
            sel.innerHTML = '<option value="">Tabla vacía</option>';
        }
    } catch (e) {
        sel.innerHTML = '<option value="">Error leyendo BD</option>';
    }
}

// Carga Dinámica desde los Selects a la Memoria
function cargarRegistroDesdeSelect(tabla, tipoDestino, selectId) {
    if (!db) return;
    const seleccion = document.getElementById(selectId).value;
    if (!seleccion) { alert("Seleccione un registro válido."); return; }
    
    const pk = JSON.parse(seleccion);
    let colNombre = tabla === 'muestras' ? 'nombre_muestra' : `nombre_${tabla.slice(0, -1)}`;

    const query = `SELECT * FROM ${tabla} WHERE ${colNombre}='${pk.nombre}' AND fecha='${pk.fecha}' AND codigo_fermentacion=1`;
    const res = db.exec(query);

    if (res.length > 0) {
        const columns = res[0].columns;
        const values = res[0].values[0];

        let arrEspectro = [];
        for (let i = 1; i <= 288; i++) {
            let colIndex = columns.indexOf(`s${i}`);
            arrEspectro.push(colIndex !== -1 ? values[colIndex] : 0);
        }

        if (tipoDestino === 'blanco') { blankData = arrEspectro; alert("Blanco cargado y fijado como referencia."); }
        if (tipoDestino === 'negro') { darkData = arrEspectro; alert("Negro cargado y fijado como referencia."); }
        if (tipoDestino === 'muestra') { 
            sampleData = arrEspectro; 
            isMonitoring = false; clearInterval(monitorInterval);
            setView('monitor');
            document.getElementById('chartTitle').innerText = `Respuesta Espectral (BD: ${pk.nombre})`;
            spectroChart.config.type = 'bar';
            spectroChart.data.datasets[0].data = sampleData;
            spectroChart.update();
            alert("Muestra cargada.");
        }
        updateStatus();
    } else {
        alert("Registro no encontrado en la base de datos.");
    }
}

// Escuchadores de Carga Independiente
document.getElementById('btnLoadBlanco').addEventListener('click', () => cargarRegistroDesdeSelect('blancos', 'blanco', 'select-blancos'));
document.getElementById('btnLoadNegro').addEventListener('click', () => cargarRegistroDesdeSelect('negros', 'negro', 'select-negros'));
document.getElementById('btnLoadMuestra').addEventListener('click', () => cargarRegistroDesdeSelect('muestras', 'muestra', 'select-muestras'));

// Guardar Muestra en la Base de Datos y Descargar Automáticamente
function guardarEnBD(tabla) {
    if (!db) { alert("Base de datos no cargada."); return; }
    
    let nombre = prompt(`Ingrese nombre para guardar en tabla ${tabla.toUpperCase()}:`);
    if (!nombre) return; 

    // Dado que eliminamos los otros botones, ahora esta función siempre guardará sampleData en 'muestras'
    let dataToSave = sampleData;
    if (!dataToSave) { alert("No hay datos de muestra en memoria para guardar."); return; }

    const now = new Date();
    const fechaStr = now.toLocaleDateString('es-CL').replace(/\//g, '-');
    let colNombre = 'nombre_muestra';

    // Armado de SQL
    let cols = `${colNombre}, codigo_fermentacion, fecha`;
    let places = `?, 1, ?`;
    let vals = [nombre, fechaStr];

    for (let i = 1; i <= 288; i++) {
        cols += `, s${i}`;
        places += `, ?`;
        vals.push(dataToSave[i-1]);
    }

    const sql = `INSERT INTO ${tabla} (${cols}) VALUES (${places})`;
    try {
        db.run(sql, vals);
        actualizarListasDesplegables(); // Refrescar las listas
        
        alert(`Muestra guardada con éxito en la BD.\nSe descargará automáticamente el archivo actualizado.`);
        
        // ¡DESCARGA AUTOMÁTICA!
        document.getElementById('btnExportDB').click();
    } catch (e) {
        alert("Error al guardar: " + e.message);
    }
}

// Botones de Guardar y Exportar
document.getElementById('btnSample').addEventListener('click', () => { 
    sampleData = [...currentData]; 
    updateStatus(); 
    guardarEnBD('muestras'); 
});

// Función central de descarga de base de datos
document.getElementById('btnExportDB').addEventListener('click', () => {
    if (!db) return;
    const data = db.export();
    const blob = new Blob([data], {type: "application/octet-stream"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "muestras_e
