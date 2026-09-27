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
    if (onda >= 700 && onda < 720) return "darkred";
    if (onda >= 720 && onda <= 760) return "darkred";
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
// 2. TABLA OFICIAL CIE 1931 CMF
// ==========================================
const CIE_CMF = [
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
    {wl: 780, x: 0.0000, y: 0.0000, z: 0.0000}
];

function getXYZ_CMF(wave) {
    if (wave <= 380) return CIE_CMF[0];
    if (wave >= 780) return CIE_CMF[CIE_CMF.length - 1];
    for (let i = 0; i < CIE_CMF.length - 1; i++) {
        let p1 = CIE_CMF[i], p2 = CIE_CMF[i+1];
        if (wave >= p1.wl && wave <= p2.wl) {
            let t = (wave - p1.wl) / (p2.wl - p1.wl);
            return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y), z: p1.z + t * (p2.z - p1.z) };
        }
    }
    return {x: 0, y: 0, z: 0};
}

function XYZto_up_vp(X, Y, Z) {
    let denom = X + 15 * Y + 3 * Z;
    if (denom === 0) return {x: 0, y: 0};
    return { x: (4 * X) / denom, y: (9 * Y) / denom }; 
}

function XYZtosRGB(X, Y, Z) {
    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    let gamma = (c) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return [Math.max(0, Math.min(1, gamma(r))), Math.max(0, Math.min(1, gamma(g))), Math.max(0, Math.min(1, gamma(b)))];
}

let locusData = [];
for (let wl = 380; wl <= 700; wl += 5) {
    let cmf = getXYZ_CMF(wl);
    let coords = XYZto_up_vp(cmf.x, cmf.y, cmf.z);
    locusData.push({wl: wl, x: coords.x, y: coords.y});
}

// ==========================================
// 3. VARIABLES DE ESTADO Y GRÁFICOS
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

// PLUGIN NATIVO PARA DIBUJAR EL INTERIOR A TODO COLOR DEL DIAGRAMA
const cieBackgroundPlugin = {
    id: 'cieBackground',
    beforeDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        ctx.save();
        let cx = x.getPixelForValue(0.2105); 
        let cy = y.getPixelForValue(0.4739); 

        // 1. Dibujar el arcoiris interior
        for (let i = 0; i < locusData.length - 1; i++) {
            let p1 = locusData[i], p2 = locusData[i+1];
            let px1 = x.getPixelForValue(p1.x), py1 = y.getPixelForValue(p1.y);
            let px2 = x.getPixelForValue(p2.x), py2 = y.getPixelForValue(p2.y);
            ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px1, py1); ctx.lineTo(px2, py2); ctx.closePath();
            let grad = ctx.createLinearGradient(cx, cy, px1, py1);
            grad.addColorStop(0, 'white'); grad.addColorStop(1, getColorParaOnda(p1.wl));
            ctx.fillStyle = grad; ctx.fill();
        }
        
        // 2. Línea de púrpuras
        let pF = locusData[0], pL = locusData[locusData.length - 1];
        let pxF = x.getPixelForValue(pF.x), pyF = y.getPixelForValue(pF.y);
        let pxL = x.getPixelForValue(pL.x), pyL = y.getPixelForValue(pL.y);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pxF, pyF); ctx.lineTo(pxL, pyL); ctx.closePath();
        let gradP = ctx.createLinearGradient(cx, cy, (pxF+pxL)/2, (pyF+pyL)/2);
        gradP.addColorStop(0, 'white'); gradP.addColorStop(1, 'magenta');
        ctx.fillStyle = gradP; ctx.fill();

        // 3. Dibujar borde negro exterior
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
        
        // 4. Dibujar los puntos numéricos del contorno
        locusData.forEach(p => {
            if (p.wl % 10 === 0 && p.wl >= 420 && p.wl <= 680) {
                let px = x.getPixelForValue(p.x), py = y.getPixelForValue(p.y);
                ctx.beginPath(); ctx.arc(px, py, 3, 0, 2*Math.PI); ctx.fill();
                let ox = 0, oy = 0;
                if (p.wl < 500) { ox = -14; oy = 0; }
                else if (p.wl < 540) { ox = -10; oy = -10; }
                else if (p.wl < 600) { ox = 0; oy = -10; }
                else { ox = 12; oy = -8; }
                ctx.fillText(p.wl, px + ox, py + oy);
            }
        });
        ctx.restore();
    }
};

document.getElementById('chromaticityChart').parentElement.style.height = "350px";
document.getElementById('chromaticityChart').parentElement.style.width = "350px";
document.getElementById('chromaticityChart').parentElement.style.margin = "0 auto";

let chromaticityChart = new Chart(document.getElementById('chromaticityChart').getContext('2d'), {
    type: 'scatter',
    plugins: [cieBackgroundPlugin], 
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
                data: [], // Inicia vacío
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
    data: { labels: nm, datasets: [{ label: 'Distribución', data: [], borderWidth: 1.5, pointRadius: 0, fill: true }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false, min: 0 } } }
});

// ==========================================
// 4. LÓGICA DE MANEJO DE ARCHIVOS Y VISTAS
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
// 5. EVENTOS BOTONES PRINCIPALES
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

// ==========================================
// 6. CÁLCULO DE COLOR ESPECTRAL (CORRECCIÓN GRADIENTE)
// ==========================================
document.getElementById('btnColor').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }
    isMonitoring = false; clearInterval(monitorInterval); setView('colorAnalysis'); 

    let X = 0, Y = 0, Z = 0; let spectrumVals = [];
    
    for (let i = 0; i < 288; i++) {
        let val = (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i]);
        val = Math.max(0, Math.min(2.5, val)); 
        spectrumVals.push(val);

        let cmf = getXYZ_CMF(nm[i]);
        X += val * cmf.x; Y += val * cmf.y; Z += val * cmf.z;
    }

    let sumY = Math.max(1e-4, Y); X /= sumY; Y /= sumY; Z /= sumY;
    let denom = X + 15 * Y + 3 * Z;
    let coords = denom === 0 ? {x:0, y:0} : {x: (4 * X) / denom, y: (9 * Y) / denom};
    
    let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    let gamma = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    let srgb = [Math.max(0, Math.min(1, gamma(r))), Math.max(0, Math.min(1, gamma(g))), Math.max(0, Math.min(1, gamma(b)))];

    chromaticityChart.data.datasets[1].data = [coords]; 
    chromaticityChart.update();

    // DIBUJAR GRADIENTE CORRECTAMENTE EN LA GRÁFICA DE DISTRIBUCIÓN
    // Forzamos un update inicial para que Chart.js calcule la caja del gráfico real (chartArea)
    distributionChart.data.datasets[0].data = spectrumVals;
    distributionChart.data.datasets[0].borderColor = "black";
    distributionChart.update();

    let chartArea = distributionChart.chartArea;
    if (chartArea) {
        let ctxDist = document.getElementById('distributionChart').getContext('2d');
        let gradient = ctxDist.createLinearGradient(chartArea.left, 0, chartArea.right, 0); 
        
        // Mapeamos los colores EXACTOS al ancho del área dibujada
        let minWl = nm[0];
        let maxWl = nm[nm.length - 1];
        let range = maxWl - minWl;

        const colorStops = [
            {w: 300, c: "#4b0082"}, {w: 400, c: "#8a2be2"}, {w: 450, c: "#0000ff"}, 
            {w: 490, c: "#00ffff"}, {w: 530, c: "#00ff00"}, {w: 580, c: "#ffff00"}, 
            {w: 620, c: "#ffa500"}, {w: 680, c: "#ff0000"}, {w: 750, c: "#8b0000"}, {w: 950, c: "#8b0000"}
        ];

        gradient.addColorStop(0, "#4b0082");
        gradient.addColorStop(1, "#8b0000");

        colorStops.forEach(s => {
            if(s.w >= minWl && s.w <= maxWl) {
                let position = (s.w - minWl) / range;
                if (position > 0 && position < 1) gradient.addColorStop(position, s.c);
            }
        });

        distributionChart.data.datasets[0].backgroundColor = gradient;
        distributionChart.update(); // Aplicar el gradiente final
    }

    document.getElementById('colorBoxDisplay').style.backgroundColor = `rgb(${Math.round(srgb[0]*255)}, ${Math.round(srgb[1]*255)}, ${Math.round(srgb[2]*255)})`;
    document.getElementById('srgbText').innerText = `SRGB= [${srgb[0].toFixed(3)}, ${srgb[1].toFixed(3)}, ${srgb[2].toFixed(3)}]`;
});

document.getElementById('btnExport').addEventListener('click', () => {
    if (!sampleData) { alert("Requiere muestra."); return; }
    let csvContent = "data:text/csv;charset=utf-8,Wavelength(nm),Intensity\n";
    for (let i = 0; i < 288; i++) csvContent += `${nm[i]},${sampleData[i]}\n`;
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Espectro_${new Date().getHours()}${new Date().getMinutes()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
});
