// ==========================================
// 1. GENERACIÓN DE LONGITUDES DE ONDA (ENTEROS) Y COLORES
// ==========================================
const A_0 = 2.991638797E+02, B_1 = 2.694248478E+00, B_2 = -8.556340170E-04;
const B_3 = -9.851009025E-06, B_4 = 1.633909302E-08, B_5 = -3.346647530E-12;

let nm = [];
let bgColors = [];

function getColorParaOnda(onda) {
    if (onda < 380) return "darkviolet";
    if (onda >= 380 && onda < 410) return "blueviolet";
    if (onda >= 410 && onda < 450) return "violet";
    if (onda >= 450 && onda < 480) return "blue";
    if (onda >= 480 && onda < 500) return "cyan";
    if (onda >= 500 && onda < 550) return "green";
    if (onda >= 550 && onda < 570) return "greenyellow";
    if (onda >= 570 && onda < 580) return "yellow";
    if (onda >= 580 && onda < 620) return "orange";
    if (onda >= 620 && onda < 700) return "red";
    if (onda >= 700 && onda <= 760) return "darkred";
    if (onda > 760) return "maroon";
    return "black"; 
}

for (let i = 1; i <= 288; i++) {
    let wave = A_0 + (B_1 * i) + (B_2 * Math.pow(i, 2)) + (B_3 * Math.pow(i, 3)) + (B_4 * Math.pow(i, 4)) + (B_5 * Math.pow(i, 5));
    let waveInt = Math.round(wave);
    nm.push(waveInt); 
    bgColors.push(getColorParaOnda(waveInt));
}

// ==========================================
// 2. VARIABLES GLOBALES DE ESTADO
// ==========================================
let isMonitoring = false;
let monitorInterval;
let currentData = new Array(288).fill(0);
let darkData = null;
let blankData = null;
let sampleData = null;

// ==========================================
// 3. CONFIGURACIÓN DEL GRÁFICO PRINCIPAL
// ==========================================
const ctx = document.getElementById('spectroChart').getContext('2d');
let spectroChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: nm,
        datasets: [{
            label: 'Intensidad',
            data: currentData,
            backgroundColor: bgColors,
            borderColor: bgColors,
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 1.0
        }]
    },
    options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: { legend: { display: false } },
        scales: {
            x: { title: { display: true, text: 'Longitud de Onda en nm' }, ticks: { maxRotation: 90, minRotation: 90 }, grid: { display: false } },
            y: { title: { display: true, text: 'counts/(μW/cm2)' }, min: 0, max: 1050 }
        }
    }
});

// ==========================================
// CONFIGURACIÓN DE LOS GRÁFICOS DE COLOR
// ==========================================
let chromaticityChart = new Chart(document.getElementById('chromaticityChart').getContext('2d'), {
    type: 'scatter',
    data: { datasets: [] },
    options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
            x: { type: 'linear', position: 'bottom', min: -0.1, max: 0.7, title: { display: true, text: "CIE u'" } },
            y: { type: 'linear', min: -0.1, max: 0.7, title: { display: true, text: "CIE v'" } }
        },
        plugins: { legend: { position: 'top' } }
    }
});

let distributionChart = new Chart(document.getElementById('distributionChart').getContext('2d'), {
    type: 'line',
    data: { labels: nm, datasets: [{ label: 'Distribución', data: [], borderWidth: 1, pointRadius: 0, fill: true }] },
    options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false, min: 0 } }
    }
});

// ==========================================
// LÓGICA DE MANEJO DE VISTAS
// ==========================================
function setView(viewMode) {
    if (viewMode === 'monitor') {
        document.getElementById('viewMonitor').style.display = 'block';
        document.getElementById('viewColorAnalysis').style.display = 'none';
    } else {
        document.getElementById('viewMonitor').style.display = 'none';
        document.getElementById('viewColorAnalysis').style.display = 'grid';
    }
}

// ==========================================
// LECTURA DE CSV Y MANEJO DE DATOS
// ==========================================
function processCSV(file, targetType) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.trim().split('\n');
        let dataArr = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '' || isNaN(parseInt(line[0]))) continue;
            let parts = line.split(/[,;]/);
            let val = parts.length > 1 ? parseFloat(parts[1]) : parseFloat(parts[0]);
            if (!isNaN(val)) dataArr.push(val);
        }
        if (dataArr.length >= 288) {
            let parsedData = dataArr.slice(0, 288);
            if (targetType === 'dark') darkData = parsedData;
            else if (targetType === 'blank') blankData = parsedData;
            else if (targetType === 'sample') {
                sampleData = parsedData;
                isMonitoring = false; clearInterval(monitorInterval);
                setView('monitor');
                document.getElementById('chartTitle').innerText = "Respuesta Espectral (CSV)";
                spectroChart.config.type = 'bar';
                spectroChart.data.datasets[0].data = sampleData;
                spectroChart.update();
            }
            updateStatus(); alert(`Archivo ${targetType.toUpperCase()} cargado.`);
        } else { alert(`Error: El archivo no tiene 288 filas.`); }
    };
    reader.readAsText(file);
}

document.getElementById('fileDark').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'dark'); this.value = null; });
document.getElementById('fileBlank').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'blank'); this.value = null; });
document.getElementById('fileSample').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'sample'); this.value = null; });

function updateStatus() {
    document.getElementById('statusPanel').innerHTML = `
        <strong>Estado de Datos:</strong><br><br>
        Blanco: ${blankData ? "✔️ Guardado" : "❌ Vacío"}<br>
        Negro: ${darkData ? "✔️ Guardado" : "❌ Vacío"}<br>
        Muestra: ${sampleData ? "✔️ Guardada" : "❌ Vacía"}
    `;
}

// ==========================================
// FUNCIONES MATEMÁTICAS CIE COLOR SCIENCE (Aproximación Analítica)
// ==========================================
function getXYZ_CMF(wave) {
    // Aproximaciones gaussianas para funciones de coincidencia CIE 1931 2°
    let x = 1.056*Math.exp(-0.5*Math.pow((wave-599.8)/43.2, 2)) + 0.362*Math.exp(-0.5*Math.pow((wave-442.0)/20.6, 2)) - 0.065*Math.exp(-0.5*Math.pow((wave-501.1)/26.9, 2));
    let y = 0.821*Math.exp(-0.5*Math.pow((wave-568.8)/46.9, 2)) + 0.286*Math.exp(-0.5*Math.pow((wave-530.9)/16.3, 2));
    let z = 1.217*Math.exp(-0.5*Math.pow((wave-437.0)/11.8, 2)) + 0.681*Math.exp(-0.5*Math.pow((wave-459.0)/26.0, 2));
    return {x: Math.max(0, x), y: Math.max(0, y), z: Math.max(0, z)};
}

function XYZto_up_vp(X, Y, Z) {
    let denom = X + 15 * Y + 3 * Z;
    if (denom === 0) return {u: 0, v: 0};
    return { u: (4 * X) / denom, v: (9 * Y) / denom };
}

function XYZtosRGB(X, Y, Z) {
    // Matriz D65 XYZ a sRGB Lineal
    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    
    // Aplicar Gamma sRGB
    let gamma = (c) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return [Math.max(0, Math.min(1, gamma(r))), Math.max(0, Math.min(1, gamma(g))), Math.max(0, Math.min(1, gamma(b)))];
}

// Generar puntos del locus espectral (herradura)
let locusPoints = [];
for (let wl = 400; wl <= 700; wl += 5) {
    let cmf = getXYZ_CMF(wl);
    locusPoints.push(XYZto_up_vp(cmf.x, cmf.y, cmf.z));
}

// ==========================================
// EVENTOS BOTONES PRINCIPALES
// ==========================================
document.getElementById('btnMonitor').addEventListener('click', () => {
    isMonitoring = true; setView('monitor');
    document.getElementById('chartTitle').innerText = "Respuesta Espectral (Monitoreo Vivo)";
    spectroChart.config.type = 'bar';
    spectroChart.data.datasets[0].backgroundColor = bgColors;
    spectroChart.data.datasets[0].borderColor = bgColors;
    spectroChart.options.scales.y.max = 1050;
    if (monitorInterval) clearInterval(monitorInterval);
    monitorInterval = setInterval(() => {
        let newData = [];
        for (let i = 0; i < nm.length; i++) {
            let wl = nm[i], base = 0;
            if (wl < 580) base = 120 + (wl - 301) * 0.2;
            else if (wl < 700) base = 180 + ((wl - 580) / 120) * 450;
            else base = 630 + (wl - 700) * 0.5;
            newData.push(Math.max(100, Math.min(1000, base + (Math.floor(Math.random() * 70) - 35))));
        }
        currentData = newData; spectroChart.data.datasets[0].data = currentData; spectroChart.update('none');
    }, 100);
});

document.getElementById('btnStop').addEventListener('click', () => { isMonitoring = false; clearInterval(monitorInterval); });
document.getElementById('btnDark').addEventListener('click', () => { darkData = [...currentData]; updateStatus(); alert("Negro guardado."); });
document.getElementById('btnBlank').addEventListener('click', () => { blankData = [...currentData]; updateStatus(); alert("Blanco guardado."); });
document.getElementById('btnSample').addEventListener('click', () => { sampleData = [...currentData]; updateStatus(); alert("Muestra guardada."); });

// ABSORBANCIA
document.getElementById('btnAbsorbance').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }
    isMonitoring = false; clearInterval(monitorInterval); setView('monitor');
    let absorbanceData = [];
    for (let i = 0; i < 288; i++) {
        let trans = Math.max(1e-4, (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i])); 
        absorbanceData.push(Math.log10(1 / trans));
    }
    document.getElementById('chartTitle').innerText = "Absorbancia";
    spectroChart.config.type = 'line'; spectroChart.data.datasets[0].data = absorbanceData;
    spectroChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)'; spectroChart.data.datasets[0].borderColor = 'red';
    spectroChart.options.scales.y.max = null; spectroChart.update();
});

// COLOR ESPECTRAL (El gran cambio)
document.getElementById('btnColor').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }
    
    isMonitoring = false; clearInterval(monitorInterval);
    setView('colorAnalysis'); // Mostrar la vista de color

    let X = 0, Y = 0, Z = 0;
    let spectrumVals = [];
    
    // 1. Calcular distribución (list_1 en Python) e integrar
    for (let i = 0; i < 288; i++) {
        let val = (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i]);
        val = Math.max(0, val);
        spectrumVals.push(val);

        let cmf = getXYZ_CMF(nm[i]);
        X += val * cmf.x; Y += val * cmf.y; Z += val * cmf.z;
    }

    // Normalizar
    let sumY = Math.max(1e-4, Y);
    X /= sumY; Y /= sumY; Z /= sumY;

    // 2. Coordenadas y Color
    let coords = XYZto_up_vp(X, Y, Z);
    let srgb = XYZtosRGB(X, Y, Z);
    let rgbStr = `rgb(${Math.round(srgb[0]*255)}, ${Math.round(srgb[1]*255)}, ${Math.round(srgb[2]*255)})`;

    // 3. Actualizar Diagrama de Cromaticidad
    chromaticityChart.data.datasets = [
        {
            label: "sRGB Triangle",
            data: [ {u: 0.4508, v: 0.5229}, {u: 0.1250, v: 0.5625}, {u: 0.1754, v: 0.1579}, {u: 0.4508, v: 0.5229} ],
            borderColor: "red", backgroundColor: "transparent", showLine: true, pointRadius: 4, type: 'line'
        },
        {
            label: "Muestra",
            data: [{u: coords.u, v: coords.v}],
            backgroundColor: "black", borderColor: "white", borderWidth: 2, pointRadius: 8
        },
        {
            label: "Spectral Locus",
            data: locusPoints,
            borderColor: "black", backgroundColor: "black", showLine: true, pointRadius: 2, type: 'line'
        }
    ];
    chromaticityChart.update();

    // 4. Actualizar Distribución Espectral (Line chart con gradiente)
    let ctxDist = document.getElementById('distributionChart').getContext('2d');
    let gradient = ctxDist.createLinearGradient(0, 0, 400, 0); // Gradiente horizontal
    gradient.addColorStop(0, "darkviolet");
    gradient.addColorStop(0.3, "blue");
    gradient.addColorStop(0.5, "green");
    gradient.addColorStop(0.7, "yellow");
    gradient.addColorStop(1, "red");

    distributionChart.data.datasets[0].data = spectrumVals;
    distributionChart.data.datasets[0].backgroundColor = gradient;
    distributionChart.data.datasets[0].borderColor = "black";
    distributionChart.update();

    // 5. Actualizar Color Box
    document.getElementById('colorBoxDisplay').style.backgroundColor = rgbStr;
    document.getElementById('srgbText').innerText = `SRGB= [${srgb[0].toFixed(3)}, ${srgb[1].toFixed(3)}, ${srgb[2].toFixed(3)}]`;
});

// EXPORTAR
document.getElementById('btnExport').addEventListener('click', () => {
    if (!sampleData) { alert("Requiere muestra."); return; }
    let csvContent = "data:text/csv;charset=utf-8,Wavelength(nm),Intensity\n";
    for (let i = 0; i < 288; i++) csvContent += `${nm[i]},${sampleData[i]}\n`;
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Espectro_${new Date().getHours()}${new Date().getMinutes()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
});
