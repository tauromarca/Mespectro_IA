// ==========================================
// 1. GENERACIÓN DE LONGITUDES DE ONDA Y COLORES
// ==========================================
const A_0 = 2.991638797E+02, B_1 = 2.694248478E+00, B_2 = -8.556340170E-04;
const B_3 = -9.851009025E-06, B_4 = 1.633909302E-08, B_5 = -3.346647530E-12;

let nm = [];
let bgColors = [];

// Función para transformar longitud de onda en RGB real (Gradiente suave)
function wlToRGBString(wavelength) {
    let r = 0, g = 0, b = 0;
    if (wavelength >= 380 && wavelength < 440) { r = -(wavelength - 440) / (440 - 380); b = 1.0; } 
    else if (wavelength >= 440 && wavelength < 490) { g = (wavelength - 440) / (490 - 440); b = 1.0; } 
    else if (wavelength >= 490 && wavelength < 510) { g = 1.0; b = -(wavelength - 510) / (510 - 490); } 
    else if (wavelength >= 510 && wavelength < 580) { r = (wavelength - 510) / (580 - 510); g = 1.0; } 
    else if (wavelength >= 580 && wavelength < 645) { r = 1.0; g = -(wavelength - 645) / (645 - 580); } 
    else if (wavelength >= 645 && wavelength <= 780) { r = 1.0; }
    
    let factor = 0;
    if (wavelength >= 380 && wavelength < 420) factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
    else if (wavelength >= 420 && wavelength < 701) factor = 1.0;
    else if (wavelength >= 701 && wavelength <= 780) factor = 0.3 + 0.7 * (780 - wavelength) / (780 - 700);

    return `rgb(${Math.round(255*Math.pow(r*factor,0.8))}, ${Math.round(255*Math.pow(g*factor,0.8))}, ${Math.round(255*Math.pow(b*factor,0.8))})`;
}

for (let i = 1; i <= 288; i++) {
    let wave = A_0 + (B_1 * i) + (B_2 * Math.pow(i, 2)) + (B_3 * Math.pow(i, 3)) + (B_4 * Math.pow(i, 4)) + (B_5 * Math.pow(i, 5));
    let waveInt = Math.round(wave);
    nm.push(waveInt); 
    bgColors.push(wlToRGBString(waveInt));
}

// ==========================================
// DATOS EXACTOS DEL LOCUS ESPECTRAL (CIE 1976 u' v')
// Esto asegura la forma exacta e idéntica a Python
// ==========================================
const locusData = [
    {wl: 420, x: 0.1754, y: 0.0055}, {wl: 440, x: 0.1706, y: 0.0125}, {wl: 450, x: 0.1651, y: 0.0215},
    {wl: 460, x: 0.1554, y: 0.0381}, {wl: 470, x: 0.1384, y: 0.0718}, {wl: 480, x: 0.1118, y: 0.1380},
    {wl: 490, x: 0.0813, y: 0.2393}, {wl: 500, x: 0.0543, y: 0.3582}, {wl: 510, x: 0.0353, y: 0.4619},
    {wl: 520, x: 0.0435, y: 0.5332}, {wl: 530, x: 0.0743, y: 0.5647}, {wl: 540, x: 0.1136, y: 0.5750},
    {wl: 550, x: 0.1539, y: 0.5746}, {wl: 560, x: 0.1936, y: 0.5694}, {wl: 570, x: 0.2319, y: 0.5619},
    {wl: 580, x: 0.2680, y: 0.5532}, {wl: 590, x: 0.3015, y: 0.5442}, {wl: 600, x: 0.3323, y: 0.5355},
    {wl: 610, x: 0.3598, y: 0.5276}, {wl: 620, x: 0.3837, y: 0.5208}, {wl: 630, x: 0.4040, y: 0.5151},
    {wl: 645, x: 0.4280, y: 0.5085}, {wl: 680, x: 0.4587, y: 0.5005}
];

// ==========================================
// VARIABLES DE ESTADO Y GRÁFICO PRINCIPAL
// ==========================================
let isMonitoring = false, monitorInterval;
let currentData = new Array(288).fill(0), darkData = null, blankData = null, sampleData = null;

const ctx = document.getElementById('spectroChart').getContext('2d');
let spectroChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: nm,
        datasets: [{ label: 'Intensidad', data: currentData, backgroundColor: bgColors, borderColor: bgColors, borderWidth: 1, barPercentage: 1.0, categoryPercentage: 1.0 }]
    },
    options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { display: false } },
        scales: { x: { title: { display: true, text: 'Longitud de Onda en nm' }, ticks: { maxRotation: 90, minRotation: 90 }, grid: { display: false } }, y: { title: { display: true, text: 'counts/(μW/cm2)' }, min: 0, max: 1050 } }
    }
});

// ==========================================
// PLUGIN NATIVO PARA DIBUJAR EL INTERIOR A TODO COLOR DEL DIAGRAMA
// ==========================================
const cieBackgroundPlugin = {
    id: 'cieBackground',
    beforeDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        ctx.save();
        let cx = x.getPixelForValue(0.2105); // Blanco central u'
        let cy = y.getPixelForValue(0.4739); // Blanco central v'

        // 1. Dibujar el arcoiris interior
        for (let i = 0; i < locusData.length - 1; i++) {
            let p1 = locusData[i], p2 = locusData[i+1];
            let px1 = x.getPixelForValue(p1.x), py1 = y.getPixelForValue(p1.y);
            let px2 = x.getPixelForValue(p2.x), py2 = y.getPixelForValue(p2.y);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px1, py1); ctx.lineTo(px2, py2); ctx.closePath();
            let grad = ctx.createLinearGradient(cx, cy, px1, py1);
            grad.addColorStop(0, 'white'); grad.addColorStop(1, wlToRGBString(p1.wl));
            ctx.fillStyle = grad; ctx.fill();
        }
        
        // 2. Línea de púrpuras inferior
        let pF = locusData[0], pL = locusData[locusData.length - 1];
        let pxF = x.getPixelForValue(pF.x), pyF = y.getPixelForValue(pF.y);
        let pxL = x.getPixelForValue(pL.x), pyL = y.getPixelForValue(pL.y);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pxF, pyF); ctx.lineTo(pxL, pyL); ctx.closePath();
        let gradP = ctx.createLinearGradient(cx, cy, (pxF+pxL)/2, (pyF+pyL)/2);
        gradP.addColorStop(0, 'white'); gradP.addColorStop(1, 'magenta');
        ctx.fillStyle = gradP; ctx.fill();

        // 3. Dibujar borde negro exterior y rellenar espacio en blanco inferior
        ctx.beginPath();
        for(let i=0; i<locusData.length; i++) ctx.lineTo(x.getPixelForValue(locusData[i].x), y.getPixelForValue(locusData[i].y));
        ctx.closePath();
        ctx.lineWidth = 2; ctx.strokeStyle = 'black'; ctx.stroke();
        ctx.restore();
    },
    afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        ctx.save();
        ctx.fillStyle = 'black'; ctx.font = 'bold 9px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        
        // 4. Dibujar los puntos y los textos de longitudes de onda en el contorno
        locusData.forEach(p => {
            let px = x.getPixelForValue(p.x), py = y.getPixelForValue(p.y);
            ctx.beginPath(); ctx.arc(px, py, 3, 0, 2*Math.PI); ctx.fill();
            
            let ox = 0, oy = 0; // Posicionar el texto inteligentemente para que no pise la línea
            if (p.wl < 500) { ox = -14; oy = 0; }
            else if (p.wl < 540) { ox = -10; oy = -10; }
            else if (p.wl < 600) { ox = 0; oy = -10; }
            else { ox = 12; oy = -8; }
            ctx.fillText(p.wl, px + ox, py + oy);
        });
        ctx.restore();
    }
};

// ==========================================
// CONFIGURACIÓN EXACTA DE LOS GRÁFICOS DE ANÁLISIS
// ==========================================
// Fijamos un contenedor cuadrado para que la cromaticidad no se estire
document.getElementById('chromaticityChart').parentElement.style.height = "350px";
document.getElementById('chromaticityChart').parentElement.style.width = "350px";
document.getElementById('chromaticityChart').parentElement.style.margin = "0 auto";

let chromaticityChart = new Chart(document.getElementById('chromaticityChart').getContext('2d'), {
    type: 'scatter',
    plugins: [cieBackgroundPlugin], // Conectamos nuestro motor gráfico personalizado
    data: { 
        datasets: [
            {
                label: "sRGB Triangle",
                data: [ {x: 0.4508, y: 0.5229}, {x: 0.1250, y: 0.5625}, {x: 0.1754, y: 0.1579}, {x: 0.4508, y: 0.5229} ],
                borderColor: "red", backgroundColor: "transparent", showLine: true, borderWidth: 2, 
                pointBackgroundColor: "red", pointRadius: 4
            },
            {
                label: "Muestra",
                data: [], // Inicia vacío, se dibuja al apretar el botón
                backgroundColor: "black", borderColor: "white", borderWidth: 2, pointRadius: 6, z: 10
            }
        ] 
    },
    options: {
        responsive: true, maintainAspectRatio: false, animation: { duration: 0 },
        scales: {
            x: { type: 'linear', position: 'bottom', min: -0.1, max: 0.7, title: { display: true, text: "CIE u'" } },
            y: { type: 'linear', min: -0.1, max: 0.7, title: { display: true, text: "CIE v'" } }
        }
    }
});

let distributionChart = new Chart(document.getElementById('distributionChart').getContext('2d'), {
    type: 'line',
    data: { labels: nm, datasets: [{ label: 'Distribución', data: [], borderWidth: 1, pointRadius: 0, fill: true }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false, min: 0 } } }
});


// ==========================================
// LÓGICA DE MANEJO DE ARCHIVOS Y VISTAS
// ==========================================
function setView(viewMode) {
    if (viewMode === 'monitor') {
        document.getElementById('viewMonitor').style.display = 'block'; document.getElementById('viewColorAnalysis').style.display = 'none';
    } else {
        document.getElementById('viewMonitor').style.display = 'none'; document.getElementById('viewColorAnalysis').style.display = 'grid';
    }
}

function processCSV(file, targetType) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.trim().split('\n');
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
                sampleData = parsedData; isMonitoring = false; clearInterval(monitorInterval);
                setView('monitor'); document.getElementById('chartTitle').innerText = "Respuesta Espectral (CSV)";
                spectroChart.config.type = 'bar'; spectroChart.data.datasets[0].data = sampleData; spectroChart.update();
            }
            document.getElementById('statusPanel').innerHTML = `Blanco: ${blankData ? "✔️" : "❌"}<br>Negro: ${darkData ? "✔️" : "❌"}<br>Muestra: ${sampleData ? "✔️" : "❌"}`;
            alert(`Archivo ${targetType.toUpperCase()} cargado.`);
        } else alert(`Error: El archivo no tiene 288 filas.`);
    }; reader.readAsText(file);
}

document.getElementById('fileDark').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'dark'); this.value = null; });
document.getElementById('fileBlank').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'blank'); this.value = null; });
document.getElementById('fileSample').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'sample'); this.value = null; });

// ==========================================
// EVENTOS BOTONES PRINCIPALES
// ==========================================
document.getElementById('btnMonitor').addEventListener('click', () => {
    isMonitoring = true; setView('monitor'); document.getElementById('chartTitle').innerText = "Respuesta Espectral (Monitoreo Vivo)";
    spectroChart.config.type = 'bar'; spectroChart.data.datasets[0].backgroundColor = bgColors; spectroChart.data.datasets[0].borderColor = bgColors; spectroChart.options.scales.y.max = 1050;
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
document.getElementById('btnDark').addEventListener('click', () => { darkData = [...currentData]; alert("Negro guardado."); });
document.getElementById('btnBlank').addEventListener('click', () => { blankData = [...currentData]; alert("Blanco guardado."); });
document.getElementById('btnSample').addEventListener('click', () => { sampleData = [...currentData]; alert("Muestra guardada."); });

// COLOR ESPECTRAL MATEMÁTICO CIE
document.getElementById('btnColor').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }
    isMonitoring = false; clearInterval(monitorInterval); setView('colorAnalysis'); 

    let X = 0, Y = 0, Z = 0; let spectrumVals = [];
    
    // Funciones aproximadas CIE CMF
    function getCIE(wave) {
        let x = 1.056*Math.exp(-0.5*Math.pow((wave-599.8)/43.2, 2)) + 0.362*Math.exp(-0.5*Math.pow((wave-442.0)/20.6, 2)) - 0.065*Math.exp(-0.5*Math.pow((wave-501.1)/26.9, 2));
        let y = 0.821*Math.exp(-0.5*Math.pow((wave-568.8)/46.9, 2)) + 0.286*Math.exp(-0.5*Math.pow((wave-530.9)/16.3, 2));
        let z = 1.217*Math.exp(-0.5*Math.pow((wave-437.0)/11.8, 2)) + 0.681*Math.exp(-0.5*Math.pow((wave-459.0)/26.0, 2));
        return {x, y, z};
    }

    for (let i = 0; i < 288; i++) {
        let val = (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i]);
        val = Math.max(0, Math.min(2.0, val)); // Protección antiruido
        spectrumVals.push(val);
        let cmf = getCIE(nm[i]);
        X += val * cmf.x; Y += val * cmf.y; Z += val * cmf.z;
    }

    let sumY = Math.max(1e-4, Y); X /= sumY; Y /= sumY; Z /= sumY;
    let denom = X + 15 * Y + 3 * Z;
    let coords = denom === 0 ? {x:0, y:0} : {x: (4 * X) / denom, y: (9 * Y) / denom};
    
    // Conversión a RGB
    let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    let gamma = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    let srgb = [Math.max(0, Math.min(1, gamma(r))), Math.max(0, Math.min(1, gamma(g))), Math.max(0, Math.min(1, gamma(b)))];

    chromaticityChart.data.datasets[1].data = [coords]; // Posicionar Muestra
    chromaticityChart.update();

    let canvasDist = document.getElementById('distributionChart');
    let ctxDist = canvasDist.getContext('2d');
    let gradient = ctxDist.createLinearGradient(0, 0, canvasDist.clientWidth, 0); 
    gradient.addColorStop(0, "darkviolet"); gradient.addColorStop(0.3, "blue"); gradient.addColorStop(0.5, "green"); gradient.addColorStop(0.7, "yellow"); gradient.addColorStop(1, "red");
    
    distributionChart.data.datasets[0].data = spectrumVals;
    distributionChart.data.datasets[0].backgroundColor = gradient;
    distributionChart.data.datasets[0].borderColor = "black";
    distributionChart.update();

    document.getElementById('colorBoxDisplay').style.backgroundColor = `rgb(${Math.round(srgb[0]*255)}, ${Math.round(srgb[1]*255)}, ${Math.round(srgb[2]*255)})`;
    document.getElementById('srgbText').innerText = `SRGB= [${srgb[0].toFixed(3)}, ${srgb[1].toFixed(3)}, ${srgb[2].toFixed(3)}]`;
});
