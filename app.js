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
// 2. TABLAS CIE Y FUNCIONES MATEMÁTICAS
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
let db = null; 

// Variables para almacenar info de la muestra actual
let currentSampleName = "Desconocida";
let currentSampleDate = "--";
let currentSampleClasificacion = "--"; 

// ==========================================
// 4. AUTENTICACIÓN Y CARGA DE BASE DE DATOS
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}` });
        window.SQL = SQL;
        
        // Carga silenciosa y automática de la Base de Datos
        const response = await fetch("muestras_espectro.db");
        if (!response.ok) throw new Error("No se encontró la BD en el servidor.");
        
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        
        // BD Lista -> Habilitar Login
        document.getElementById('login-db-status').innerHTML = "✔️ BD Enlazada. Ingrese sus credenciales.";
        document.getElementById('login-db-status').style.color = "#2ecc71";
        document.getElementById('btnLogin').disabled = false;
        
        actualizarListasDesplegables();

    } catch (err) {
        console.error("Error BD:", err);
        document.getElementById('login-db-status').innerHTML = "❌ Error al cargar Base de Datos SQLite.";
        document.getElementById('login-db-status').style.color = "#e74c3c";
    }
});

// LOGIC DE LOGIN SEGURO 
document.getElementById('btnLogin').addEventListener('click', () => {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const errorMsg = document.getElementById('loginError');
    
    if(!db) { errorMsg.innerText = "La base de datos no está disponible."; return; }
    
    try {
        const stmt = db.prepare("SELECT * FROM usuarios WHERE username=:u AND password=:p");
        const result = stmt.getAsObject({':u': user, ':p': pass});
        
        if (result && result.username) {
            // Login Exitoso -> Mostrar App
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('appContainer').style.display = 'flex';
        } else {
            errorMsg.innerText = "Usuario o contraseña incorrectos.";
        }
        stmt.free();
    } catch (e) {
        errorMsg.innerText = "Error consultando credenciales: " + e.message;
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

// Carga Dinámica 
function cargarRegistroDesdeSelect(tabla, tipoDestino, selectId) {
    if (!db) return;
    const seleccion = document.getElementById(selectId).value;
    if (!seleccion) return;
    
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

        if (tipoDestino === 'blanco') { blankData = arrEspectro; }
        if (tipoDestino === 'negro') { darkData = arrEspectro; }
        if (tipoDestino === 'muestra') { 
            sampleData = arrEspectro; 
            currentSampleName = pk.nombre;
            currentSampleDate = pk.fecha;
            
            // Buscar si existe el campo "clasificacion"
            let colClasIndex = columns.indexOf('clasificacion');
            currentSampleClasificacion = colClasIndex !== -1 && values[colClasIndex] ? values[colClasIndex] : "Sin clasificación";
            
            isMonitoring = false; clearInterval(monitorInterval);
            setView('monitor');
            
            document.getElementById('chartTitle').innerText = `Respuesta Espectral | Muestra: ${currentSampleName} | Fecha: ${currentSampleDate} | Clasificación: ${currentSampleClasificacion}`;
            spectroChart.config.type = 'bar';
            spectroChart.data.datasets[0].data = sampleData;
            spectroChart.data.datasets[0].pointRadius = 0;
            spectroChart.update();
        }
    }
}

// Escuchadores de Carga Independiente
document.getElementById('btnLoadBlanco').addEventListener('click', () => cargarRegistroDesdeSelect('blancos', 'blanco', 'select-blancos'));
document.getElementById('btnLoadNegro').addEventListener('click', () => cargarRegistroDesdeSelect('negros', 'negro', 'select-negros'));
document.getElementById('btnLoadMuestra').addEventListener('click', () => cargarRegistroDesdeSelect('muestras', 'muestra', 'select-muestras'));

// Guardar Muestra y Exportar BD Automáticamente
function exportarBD() {
    if (!db) return;
    const data = db.export();
    const blob = new Blob([data], {type: "application/octet-stream"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "muestras_espectro.db";
    a.click();
}

document.getElementById('btnSample').addEventListener('click', () => { 
    sampleData = [...currentData]; 
    
    if (!db) { alert("Base de datos no cargada."); return; }
    
    let nombre = prompt(`Ingrese nombre para guardar la MUESTRA:`);
    if (!nombre) return; 

    const now = new Date();
    const fechaStr = now.toLocaleDateString('es-CL').replace(/\//g, '-');
    let cols = `nombre_muestra, codigo_fermentacion, fecha`;
    let places = `?, 1, ?`;
    let vals = [nombre, fechaStr];

    let hasClasificacion = false;
    try {
        let tableInfo = db.exec(`PRAGMA table_info(muestras)`);
        if (tableInfo.length > 0) {
            hasClasificacion = tableInfo[0].values.some(row => row[1].toLowerCase() === 'clasificacion');
        }
    } catch (e) {}

    if (hasClasificacion) {
        let clasif = prompt(`Ingrese la Clasificación para esta muestra (Opcional):`);
        cols += `, clasificacion`;
        places += `, ?`;
        vals.push(clasif || "");
        currentSampleClasificacion = clasif || "Sin clasificación";
    } else {
        currentSampleClasificacion = "N/A";
    }

    for (let i = 1; i <= 288; i++) {
        cols += `, s${i}`;
        places += `, ?`;
        vals.push(sampleData[i-1]);
    }

    const sql = `INSERT INTO muestras (${cols}) VALUES (${places})`;
    try {
        db.run(sql, vals);
        
        currentSampleName = nombre;
        currentSampleDate = fechaStr;
        document.getElementById('chartTitle').innerText = `Respuesta Espectral | Muestra: ${currentSampleName} | Fecha: ${currentSampleDate} | Clasificación: ${currentSampleClasificacion}`;
        
        actualizarListasDesplegables(); 
        exportarBD(); // Descarga invisible e inmediata
    } catch (e) {
        alert("Error al guardar: " + e.message);
    }
});


// ==========================================
// 5. CONFIGURACIÓN DE LOS GRÁFICOS
// ==========================================
const ctx = document.getElementById('spectroChart').getContext('2d');
let spectroChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: nm,
        datasets: [{ label: 'Intensidad', data: currentData, backgroundColor: bgColors, borderColor: bgColors, borderWidth: 1, barPercentage: 1.0, categoryPercentage: 1.0 }]
    },
    options: {
        responsive: true, maintainAspectRatio: false, animation: {duration: 0}, plugins: { legend: {display: false} },
        scales: { x: { title: { display: true, text: 'Longitud de Onda en nm' }, ticks: { maxRotation: 90, minRotation: 90 }, grid: {display: false} }, y: { title: { display: true, text: 'counts/(μW/cm2)' }, min: 0, max: 1050 } }
    }
});

const cieBackgroundPlugin = {
    id: 'cieBackground',
    beforeDatasetsDraw(chart) {
        const {ctx, chartArea, scales: {x, y}} = chart;
        if (!chartArea) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(locusData[0].x), y.getPixelForValue(locusData[0].y));
        for (let i = 1; i < locusData.length; i++) {
            ctx.lineTo(x.getPixelForValue(locusData[i].x), y.getPixelForValue(locusData[i].y));
        }
        ctx.closePath();
        ctx.clip();

        const step = 2;
        for (let py = chartArea.top; py < chartArea.bottom; py += step) {
            for (let px = chartArea.left; px < chartArea.right; px += step) {
                let valU = x.getValueForPixel(px);
                let valV = y.getValueForPixel(py);
                let color = uvToColorHex(valU, valV);
                if (color) { ctx.fillStyle = color; ctx.fillRect(px, py, step + 0.5, step + 0.5); }
            }
        }
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(locusData[0].x), y.getPixelForValue(locusData[0].y));
        for (let i = 1; i < locusData.length; i++) {
            ctx.lineTo(x.getPixelForValue(locusData[i].x), y.getPixelForValue(locusData[i].y));
        }
        ctx.closePath();
        ctx.lineWidth = 2.5; ctx.strokeStyle = 'black'; ctx.stroke();
        ctx.restore();
    },
    afterDatasetsDraw(chart) {
        const {ctx, scales: {x, y}} = chart;
        ctx.save();
        ctx.fillStyle = 'black'; ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

        const etiquetasVisibles = [420, 440, 460, 470, 480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 620, 680];
        locusData.forEach(p => {
            if (etiquetasVisibles.includes(p.wl)) {
                let px = x.getPixelForValue(p.x), py = y.getPixelForValue(p.y);
                ctx.beginPath(); ctx.arc(px, py, 3, 0, 2 * Math.PI); ctx.fill();

                let ox = 0, oy = 0;
                if (p.wl <= 470) { ox = -14; oy = 0; }
                else if (p.wl <= 520) { ox = -16; oy = 0; }
                else if (p.wl <= 560) { ox = 0; oy = -12; }
                else { ox = 14; oy = -8; }

                ctx.fillText(p.wl, px + ox, py + oy);
            }
        });
        ctx.restore();
    }
};

document.getElementById('chromaContainer').style.height = "400px";
document.getElementById('chromaContainer').style.width = "400px";
document.getElementById('chromaContainer').style.margin = "0 auto";

let chromaticityChart = new Chart(document.getElementById('chromaticityChart').getContext('2d'), {
    type: 'scatter',
    plugins: [cieBackgroundPlugin],
    data: {
        datasets: [
            {
                label: "Triangulo sRGB",
                data: [ {x:0.4508, y:0.5229}, {x:0.1250, y:0.5625}, {x:0.1754, y:0.1579}, {x:0.4508, y:0.5229} ],
                borderColor: "red", backgroundColor: "transparent", showLine: true, borderWidth: 2.5, pointBackgroundColor: "red", pointRadius: 5
            },
            {
                label: "Muestra",
                data: [],
                backgroundColor: "black", borderColor: "white", borderWidth: 2, pointRadius: 8, z: 10
            }
        ]
    },
    options: {
        responsive: true, maintainAspectRatio: false, animation: {duration: 0},
        scales: {
            x: { type: 'linear', position: 'bottom', min: -0.1, max: 0.7, title: { display: true, text: "CIE u'" } },
            y: { type: 'linear', min: -0.1, max: 0.7, title: { display: true, text: "CIE v'" } }
        },
        plugins: { legend: { position: 'top', labels: {usePointStyle: true} } }
    }
});

let distributionChart = new Chart(document.getElementById('distributionChart').getContext('2d'), {
    type: 'line',
    data: { labels: nm, datasets: [{ label: 'Distribución', data: [], borderWidth: 1.5, pointRadius: 0, fill: true, borderColor: "black" }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: {display: false} }, scales: { x: { type: 'linear', position: 'bottom', min: 340, max: 850, title: { display: true, text: 'Longitud de Onda (nm)' }, ticks: { stepSize: 50 } }, y: { display: false, min: 0 } } }
});

// ==========================================
// 6. MANEJO DE VISTAS Y CONTROLES VIVO
// ==========================================
function setView(viewMode) {
    if (viewMode === 'monitor') {
        document.getElementById('viewMonitor').style.display = 'block'; document.getElementById('viewColorAnalysis').style.display = 'none';
    } else {
        document.getElementById('viewMonitor').style.display = 'none'; document.getElementById('viewColorAnalysis').style.display = 'grid';
    }
}

document.getElementById('btnMonitor').addEventListener('click', () => {
    isMonitoring = true; setView('monitor'); document.getElementById('chartTitle').innerText = "Respuesta Espectral (Monitoreo Vivo)";
    spectroChart.config.type = 'bar'; spectroChart.data.datasets[0].backgroundColor = bgColors; spectroChart.data.datasets[0].borderColor = bgColors; spectroChart.options.scales.y.max = 1050;
    spectroChart.data.datasets[0].pointRadius = 0; 
    
    if (monitorInterval) clearInterval(monitorInterval);
    monitorInterval = setInterval(() => {
        let newData = [];
        for (let i = 0; i < nm.length; i++) {
            let wl = nm[i], base = wl < 580 ? 120 + (wl - 301) * 0.2 : (wl < 700 ? 180 + ((wl - 580) / 120) * 450 : 630 + (wl - 700) * 0.5);
            newData.push(Math.max(100, Math.min(1000, base + (Math.floor(Math.random() * 70) - 35))));
        }
        currentData = newData; spectroChart.data.datasets[0].data = currentData; spectroChart.update('none');
    }, 100);
});

document.getElementById('btnStop').addEventListener('click', () => { isMonitoring = false; clearInterval(monitorInterval); });

// ABSORBANCIA 
document.getElementById('btnAbsorbance').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }
    isMonitoring = false; clearInterval(monitorInterval); setView('monitor');
    
    let absorbanceData = [];
    let pRadiuses = [], pColors = [];

    for (let i = 0; i < 288; i++) {
        let trans = Math.max(1e-4, (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i]));
        absorbanceData.push(Math.log10(1 / trans));
    }

    for (let i = 0; i < 288; i++) {
        let isPeak = false;
        if (i > 0 && i < 287) {
            if (absorbanceData[i] > 0 && absorbanceData[i] > absorbanceData[i-1] && absorbanceData[i] > absorbanceData[i+1]) {
                isPeak = true;
            }
        }
        pRadiuses.push(isPeak ? 5 : 0);
        pColors.push(isPeak ? 'red' : 'transparent');
    }

    document.getElementById('chartTitle').innerText = `Absorbancia | Muestra: ${currentSampleName} | Fecha: ${currentSampleDate} | Clasificación: ${currentSampleClasificacion}`;
    
    spectroChart.config.type = 'line'; 
    spectroChart.data.datasets[0].data = absorbanceData;
    spectroChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)'; 
    spectroChart.data.datasets[0].borderColor = 'red';
    spectroChart.data.datasets[0].borderWidth = 1.5;
    spectroChart.data.datasets[0].pointRadius = pRadiuses;
    spectroChart.data.datasets[0].pointBackgroundColor = pColors;
    spectroChart.data.datasets[0].pointBorderColor = pColors;
    spectroChart.options.scales.y.max = undefined; 
    spectroChart.update();
});

// COLOR ESPECTRAL
document.getElementById('btnColor').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }
    isMonitoring = false; clearInterval(monitorInterval); setView('colorAnalysis');

    document.getElementById('colorAnalysisTitle').innerText = `Análisis de Color | Muestra: ${currentSampleName} | Fecha: ${currentSampleDate} | Clasificación: ${currentSampleClasificacion}`;

    let sum_X = 0, sum_Y = 0, sum_Z = 0, ref_Y = 0;
    let spectrumValsCoords = [];

    for (let i = 0; i < 288; i++) {
        let val = (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i]);
        val = Math.max(0, Math.min(2.5, val));
        
        spectrumValsCoords.push({ x: nm[i], y: val });

        let cmf = getCMF(nm[i]); 
        let ill = getD65(nm[i]); 

        sum_X += val * cmf.x * ill;
        sum_Y += val * cmf.y * ill;
        sum_Z += val * cmf.z * ill;
        ref_Y += cmf.y * ill;
    }

    let X = sum_X / Math.max(1e-4, ref_Y);
    let Y = sum_Y / Math.max(1e-4, ref_Y);
    let Z = sum_Z / Math.max(1e-4, ref_Y);

    let denom = X + 15 * Y + 3 * Z;
    let coords = denom === 0 ? {x: 0.2105, y: 0.4739} : {x:(4 * X) / denom, y:(9 * Y) / denom};

    let srgb = XYZto_sRGB(X, Y, Z);

    chromaticityChart.data.datasets[1].data = [coords];
    chromaticityChart.data.datasets[1].label = `Muestra: ${currentSampleName}`;
    chromaticityChart.update();

    distributionChart.data.datasets[0].data = spectrumValsCoords;
    distributionChart.update(); 

    let chartArea = distributionChart.chartArea;
    if (chartArea) {
        let ctxDist = document.getElementById('distributionChart').getContext('2d');
        let gradient = ctxDist.createLinearGradient(chartArea.left, 0, chartArea.right, 0);

        const mapWl = (wl) => Math.max(0, Math.min(1, (wl - 340) / (850 - 340)));

        gradient.addColorStop(mapWl(340), "black");
        gradient.addColorStop(mapWl(380), "darkviolet");
        gradient.addColorStop(mapWl(440), "blue");
        gradient.addColorStop(mapWl(510), "green");
        gradient.addColorStop(mapWl(580), "yellow");
        gradient.addColorStop(mapWl(645), "red");
        gradient.addColorStop(mapWl(780), "darkred");
        gradient.addColorStop(mapWl(850), "black");

        distributionChart.data.datasets[0].backgroundColor = gradient;
        distributionChart.update();
    }

    let r_disp = Math.max(0, Math.min(255, Math.round(srgb[0] * 255)));
    let g_disp = Math.max(0, Math.min(255, Math.round(srgb[1] * 255)));
    let b_disp = Math.max(0, Math.min(255, Math.round(srgb[2] * 255)));

    document.getElementById('colorBoxDisplay').style.backgroundColor = `rgb(${r_disp}, ${g_disp}, ${b_disp})`;
    document.getElementById('srgbText').innerText = `sRGB= [${srgb[0].toFixed(3)}, ${srgb[1].toFixed(3)}, ${srgb[2].toFixed(3)}]`;
});
