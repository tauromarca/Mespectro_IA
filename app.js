// ==========================================
// 1. GENERACIÓN DE LONGITUDES DE ONDA (ENTEROS) Y COLORES
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
    let wave = A_0 + (B_1 * i) + (B_2 * Math.pow(i, 2)) +
        (B_3 * Math.pow(i, 3)) + (B_4 * Math.pow(i, 4)) +
        (B_5 * Math.pow(i, 5));

    let waveInt = Math.round(wave);
    nm.push(waveInt);
    bgColors.push(getColorParaOnda(waveInt));
}

// ==========================================
// 2. TABLA CIE 2015 2-DEGREE (340nm a 850nm) Y CONVERSIÓN sRGB
// ==========================================
const CIE_CMF = [
    {wl:340,x:0.0000,y:0.0000,z:0.0000}, {wl:350,x:0.0000,y:0.0000,z:0.0000},
    {wl:360,x:0.0000,y:0.0000,z:0.0000}, {wl:370,x:0.0001,y:0.0000,z:0.0004},
    {wl:380,x:0.0011,y:0.0000,z:0.0051}, {wl:390,x:0.0084,y:0.0002,z:0.0405},
    {wl:400,x:0.0416,y:0.0011,z:0.2015}, {wl:410,x:0.1332,y:0.0041,z:0.6559},
    {wl:420,x:0.2980,y:0.0113,z:1.4884}, {wl:430,x:0.3807,y:0.0225,z:1.9305},
    {wl:440,x:0.3557,y:0.0381,z:1.8386}, {wl:450,x:0.2676,y:0.0543,z:1.4286},
    {wl:460,x:0.1772,y:0.0768,z:1.0021}, {wl:470,x:0.1011,y:0.1171,z:0.6386},
    {wl:480,x:0.0414,y:0.1837,z:0.3277}, {wl:490,x:0.0069,y:0.2858,z:0.1438},
    {wl:500,x:0.0053,y:0.4373,z:0.0617}, {wl:510,x:0.0416,y:0.6277,z:0.0261},
    {wl:520,x:0.1378,y:0.8258,z:0.0121}, {wl:530,x:0.2872,y:0.9634,z:0.0054},
    {wl:540,x:0.4682,y:0.9995,z:0.0021}, {wl:550,x:0.6575,y:0.9388,z:0.0007},
    {wl:560,x:0.8351,y:0.8123,z:0.0002}, {wl:570,x:0.9702,y:0.6483,z:0.0000},
    {wl:580,x:1.0456,y:0.4851,z:0.0000}, {wl:590,x:1.0503,y:0.3397,z:0.0000},
    {wl:600,x:0.9840,y:0.2227,z:0.0000}, {wl:610,x:0.8659,y:0.1366,z:0.0000},
    {wl:620,x:0.7161,y:0.0789,z:0.0000}, {wl:630,x:0.5513,y:0.0428,z:0.0000},
    {wl:640,x:0.3957,y:0.0218,z:0.0000}, {wl:650,x:0.2646,y:0.0105,z:0.0000},
    {wl:660,x:0.1652,y:0.0048,z:0.0000}, {wl:670,x:0.0970,y:0.0021,z:0.0000},
    {wl:680,x:0.0538,y:0.0009,z:0.0000}, {wl:690,x:0.0283,y:0.0004,z:0.0000},
    {wl:700,x:0.0142,y:0.0002,z:0.0000}, {wl:710,x:0.0069,y:0.0001,z:0.0000},
    {wl:720,x:0.0032,y:0.0000,z:0.0000}, {wl:730,x:0.0015,y:0.0000,z:0.0000},
    {wl:740,x:0.0007,y:0.0000,z:0.0000}, {wl:750,x:0.0003,y:0.0000,z:0.0000},
    {wl:760,x:0.0001,y:0.0000,z:0.0000}, {wl:770,x:0.0001,y:0.0000,z:0.0000},
    {wl:780,x:0.0000,y:0.0000,z:0.0000}, {wl:790,x:0.0000,y:0.0000,z:0.0000},
    {wl:800,x:0.0000,y:0.0000,z:0.0000}, {wl:810,x:0.0000,y:0.0000,z:0.0000},
    {wl:820,x:0.0000,y:0.0000,z:0.0000}, {wl:830,x:0.0000,y:0.0000,z:0.0000},
    {wl:840,x:0.0000,y:0.0000,z:0.0000}, {wl:850,x:0.0000,y:0.0000,z:0.0000}
];

function getXYZ_CMF(wave) {
    if (wave <= 340) return CIE_CMF[0];
    if (wave >= 850) return CIE_CMF[CIE_CMF.length - 1];

    for (let i = 0; i < CIE_CMF.length - 1; i++) {
        let p1 = CIE_CMF[i], p2 = CIE_CMF[i + 1];

        if (wave >= p1.wl && wave <= p2.wl) {
            let t = (wave - p1.wl) / (p2.wl - p1.wl);
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y),
                z: p1.z + t * (p2.z - p1.z)
            };
        }
    }
    return {x:0, y:0, z:0};
}

function XYZto_up_vp(X, Y, Z) {
    let denom = X + 15 * Y + 3 * Z;
    if (denom === 0) return {x:0, y:0};
    return {
        x: (4 * X) / denom,
        y: (9 * Y) / denom
    };
}

// Conversión XYZ a sRGB
function XYZto_sRGB(X, Y, Z) {
    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    let gamma = (c) => {
        let abs_c = Math.abs(c);
        let res = abs_c <= 0.0031308
            ? 12.92 * abs_c
            : 1.055 * Math.pow(abs_c, 1 / 2.4) - 0.055;

        return c < 0 ? -res : res;
    };

    return [gamma(r), gamma(g), gamma(b)];
}

// ==========================================
// 3. CONVERSIÓN u'v' A COLOR sRGB (Renderizado de Píxeles)
// ==========================================
function uvToColorHex(u, v) {
    const divisor = 6 * u - 16 * v + 12;
    if (!Number.isFinite(divisor) || divisor <= 0 || v <= 0) return null;

    const x = (9 * u) / divisor;
    const y = (4 * v) / divisor;

    if (!Number.isFinite(x) || !Number.isFinite(y) || y <= 0) return null;

    // XYZ con Y = 1
    const X = x / y;
    const Y = 1;
    const Z = (1 - x - y) / y;

    // Matriz sRGB D65
    let r =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let b =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;

    if (![r, g, b].every(Number.isFinite)) return null;

    const minRGB = Math.min(r, g, b);
    if (minRGB < 0) { r -= minRGB; g -= minRGB; b -= minRGB; }

    const maxRGB = Math.max(r, g, b);
    if (maxRGB <= 0) return "rgb(0,0,0)";

    r /= maxRGB; g /= maxRGB; b /= maxRGB;

    function gammaSRGB(c) {
        c = Math.max(0, Math.min(1, c));
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }

    const R = Math.round(gammaSRGB(r) * 255);
    const G = Math.round(gammaSRGB(g) * 255);
    const B = Math.round(gammaSRGB(b) * 255);

    return `rgb(${R},${G},${B})`;
}

// ==========================================
// 4. LOCUS ESPECTRAL CIE 1976 (Expandido 340-850nm)
// ==========================================
let locusData = [];

for (let wl = 340; wl <= 850; wl += 5) {
    let cmf = getXYZ_CMF(wl);
    let coords = XYZto_up_vp(cmf.x, cmf.y, cmf.z);
    
    // Evitar trazos a (0,0) si los valores de los extremos caen en ceros absolutos
    if (coords.x !== 0 && coords.y !== 0) {
        locusData.push({ wl: wl, x: coords.x, y: coords.y });
    }
}

// ==========================================
// 5. ESTADO GLOBAL
// ==========================================
let isMonitoring = false;
let monitorInterval;

let currentData = new Array(288).fill(0);
let darkData = null;
let blankData = null;
let sampleData = null;

// ==========================================
// 6. GRÁFICO DEL ESPECTRÓMETRO (Monitor)
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
        responsive: true, maintainAspectRatio: false, animation: {duration: 0},
        plugins: { legend: {display: false} },
        scales: {
            x: { title: { display: true, text: 'Longitud de Onda en nm' }, ticks: { maxRotation: 90, minRotation: 90 }, grid: {display: false} },
            y: { title: { display: true, text: 'counts/(μW/cm2)' }, min: 0, max: 1050 }
        }
    }
});

// ==========================================
// 7. PLUGIN DE FONDO CIE 1976
// ==========================================
const cieBackgroundPlugin = {
    id: 'cieBackground',

    beforeDatasetsDraw(chart) {
        const {ctx, chartArea, scales: {x, y}} = chart;
        if (!chartArea) return;

        ctx.save();

        // 1. Recortar la herradura espectral
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(locusData[0].x), y.getPixelForValue(locusData[0].y));
        for (let i = 1; i < locusData.length; i++) {
            ctx.lineTo(x.getPixelForValue(locusData[i].x), y.getPixelForValue(locusData[i].y));
        }
        ctx.closePath();
        ctx.clip();

        // 2. Pintar cromaticidad interna a color (Renderizado 2x2 px)
        const step = 2;
        for (let py = chartArea.top; py < chartArea.bottom; py += step) {
            for (let px = chartArea.left; px < chartArea.right; px += step) {
                let valU = x.getValueForPixel(px);
                let valV = y.getValueForPixel(py);

                let color = uvToColorHex(valU, valV);

                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(px, py, step + 0.5, step + 0.5);
                }
            }
        }
        ctx.restore();

        // 3. Dibujar borde exterior negro
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(locusData[0].x), y.getPixelForValue(locusData[0].y));
        for (let i = 1; i < locusData.length; i++) {
            ctx.lineTo(x.getPixelForValue(locusData[i].x), y.getPixelForValue(locusData[i].y));
        }
        ctx.closePath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.restore();
    },

    afterDatasetsDraw(chart) {
        const {ctx, scales: {x, y}} = chart;

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Etiquetas seleccionadas (Sin aglomerarse en los extremos)
        const etiquetasVisibles = [
            380, 420, 440, 460, 470, 480, 490, 500, 510, 520,
            530, 540, 550, 560, 570, 580, 590, 600, 620, 680
        ];

        locusData.forEach(p => {
            if (etiquetasVisibles.includes(p.wl)) {
                let px = x.getPixelForValue(p.x);
                let py = y.getPixelForValue(p.y);

                ctx.beginPath();
                ctx.arc(px, py, 3, 0, 2 * Math.PI);
                ctx.fill();

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

// ==========================================
// 8. GRÁFICO DE CROMATICIDAD
// ==========================================
document.getElementById('chromaContainer').style.height = "400px";
document.getElementById('chromaContainer').style.width = "400px";
document.getElementById('chromaContainer').style.margin = "0 auto";

let chromaticityChart = new Chart(
    document.getElementById('chromaticityChart').getContext('2d'),
    {
        type: 'scatter',
        plugins: [cieBackgroundPlugin],

        data: {
            datasets: [
                {
                    label: "sRGB Triangle",
                    data: [
                        {x:0.4508, y:0.5229}, {x:0.1250, y:0.5625}, {x:0.1754, y:0.1579}, {x:0.4508, y:0.5229}
                    ],
                    borderColor: "red", backgroundColor: "transparent", showLine: true, borderWidth: 2.5,
                    pointBackgroundColor: "red", pointRadius: 5
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
    }
);

// ==========================================
// 9. GRÁFICO DE DISTRIBUCIÓN ESPECTRAL
// ==========================================
let distributionChart = new Chart(
    document.getElementById('distributionChart').getContext('2d'),
    {
        type: 'line',
        data: { labels: nm, datasets: [{ label: 'Distribución', data: [], borderWidth: 1.5, pointRadius: 0, fill: true }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: {display: false} }, scales: { x: {display: false}, y: {display: false, min: 0} } }
    }
);

// ==========================================
// 10. MANEJO DE VISTAS Y ARCHIVOS CSV
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

            document.getElementById('statusPanel').innerHTML =
                `Blanco: ${blankData ? "✔️" : "❌"}<br>` + `Negro: ${darkData ? "✔️" : "❌"}<br>` + `Muestra: ${sampleData ? "✔️" : "❌"}`;
            alert(`Archivo ${targetType.toUpperCase()} cargado.`);
        } else {
            alert("Error: El archivo no tiene 288 filas.");
        }
    };
    reader.readAsText(file);
}

document.getElementById('fileDark').addEventListener('change', function() { if (this.files[0]) processCSV(this.files[0], 'dark'); this.value = null; });
document.getElementById('fileBlank').addEventListener('change', function() { if (this.files[0]) processCSV(this.files[0], 'blank'); this.value = null; });
document.getElementById('fileSample').addEventListener('change', function() { if (this.files[0]) processCSV(this.files[0], 'sample'); this.value = null; });

// ==========================================
// 11. MONITOREO
// ==========================================
document.getElementById('btnMonitor').addEventListener('click', () => {
    isMonitoring = true; setView('monitor'); document.getElementById('chartTitle').innerText = "Respuesta Espectral (Monitoreo Vivo)";
    spectroChart.config.type = 'bar'; spectroChart.data.datasets[0].backgroundColor = bgColors; spectroChart.data.datasets[0].borderColor = bgColors; spectroChart.options.scales.y.max = 1050;
    if (monitorInterval) clearInterval(monitorInterval);

    monitorInterval = setInterval(() => {
        let newData = [];
        for (let i = 0; i < nm.length; i++) {
            let wl = nm[i];
            let base = wl < 580 ? 120 + (wl - 301) * 0.2 : (wl < 700 ? 180 + ((wl - 580) / 120) * 450 : 630 + (wl - 700) * 0.5);
            newData.push(Math.max(100, Math.min(1000, base + (Math.floor(Math.random() * 70) - 35))));
        }
        currentData = newData; spectroChart.data.datasets[0].data = currentData; spectroChart.update('none');
    }, 100);
});

document.getElementById('btnStop').addEventListener('click', () => { isMonitoring = false; clearInterval(monitorInterval); });
document.getElementById('btnDark').addEventListener('click', () => { darkData = [...currentData]; alert("Negro guardado."); });
document.getElementById('btnBlank').addEventListener('click', () => { blankData = [...currentData]; alert("Blanco guardado."); });
document.getElementById('btnSample').addEventListener('click', () => { sampleData = [...currentData]; alert("Muestra guardada."); });

// ==========================================
// 12. CÁLCULO DE ABSORBANCIA
// ==========================================
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
    spectroChart.options.scales.y.max = undefined;
    spectroChart.update();
});

// ==========================================
// 13. CÁLCULO DE COLOR sRGB Y CROMATICIDAD
// ==========================================
document.getElementById('btnColor').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) { alert("Requiere Negro, Blanco y Muestra."); return; }

    isMonitoring = false; clearInterval(monitorInterval); setView('colorAnalysis');

    let X = 0, Y = 0, Z = 0; let spectrumVals = [];

    // Integración espectral
    for (let i = 0; i < 288; i++) {
        let val = (sampleData[i] - darkData[i]) / Math.max(1e-4, blankData[i] - darkData[i]);
        val = Math.max(0, Math.min(2.5, val));
        spectrumVals.push(val);

        let cmf = getXYZ_CMF(nm[i]);
        X += val * cmf.x; Y += val * cmf.y; Z += val * cmf.z;
    }

    let sumY = Math.max(1e-4, Y); X /= sumY; Y /= sumY; Z /= sumY;
    let denom = X + 15 * Y + 3 * Z;
    let coords = denom === 0 ? {x:0, y:0} : {x:(4 * X) / denom, y:(9 * Y) / denom};

    let srgb = XYZto_sRGB(X, Y, Z);

    // Posicionar muestra en el diagrama
    chromaticityChart.data.datasets[1].data = [coords];
    chromaticityChart.update();

    // Gradiente de distribución espectral
    let canvasDist = document.getElementById('distributionChart');
    let ctxDist = canvasDist.getContext('2d');
    let gradient = ctxDist.createLinearGradient(0, 0, canvasDist.clientWidth, 0);

    gradient.addColorStop(0, "darkviolet"); gradient.addColorStop(0.3, "blue");
    gradient.addColorStop(0.5, "green"); gradient.addColorStop(0.7, "yellow"); gradient.addColorStop(1, "red");

    distributionChart.data.datasets[0].data = spectrumVals;
    distributionChart.data.datasets[0].backgroundColor = gradient;
    distributionChart.data.datasets[0].borderColor = "black";
    distributionChart.update();

    // Color final en pantalla
    let r_disp = Math.max(0, Math.min(255, Math.round(srgb[0] * 255)));
    let g_disp = Math.max(0, Math.min(255, Math.round(srgb[1] * 255)));
    let b_disp = Math.max(0, Math.min(255, Math.round(srgb[2] * 255)));

    document.getElementById('colorBoxDisplay').style.backgroundColor = `rgb(${r_disp}, ${g_disp}, ${b_disp})`;
    document.getElementById('srgbText').innerText = `sRGB= [${srgb[0].toFixed(3)}, ${srgb[1].toFixed(3)}, ${srgb[2].toFixed(3)}]`;
});

// EXPORTACIÓN CSV
document.getElementById('btnExport').addEventListener('click', () => {
    if (!sampleData) { alert("Requiere muestra."); return; }
    let csvContent = "data:text/csv;charset=utf-8,Wavelength(nm),Intensity\n";
    for (let i = 0; i < 288; i++) csvContent += `${nm[i]},${sampleData[i]}\n`;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Espectro_${new Date().getHours()}${new Date().getMinutes()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
});
