// ==========================================
// 1. GENERACIÓN DE LONGITUDES DE ONDA (ENTEROS) Y COLORES
// ==========================================
const A_0 = 2.991638797E+02, B_1 = 2.694248478E+00, B_2 = -8.556340170E-04;
const B_3 = -9.851009025E-06, B_4 = 1.633909302E-08, B_5 = -3.346647530E-12;

let nm = [];
let bgColors = [];

// Función de colores EXACTA a la lógica de Python
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
    return "black"; // Por seguridad
}

// Calculamos los 288 puntos
for (let i = 1; i <= 288; i++) {
    // Cálculo polinómico original
    let wave = A_0 + (B_1 * i) + (B_2 * Math.pow(i, 2)) + (B_3 * Math.pow(i, 3)) + (B_4 * Math.pow(i, 4)) + (B_5 * Math.pow(i, 5));
    
    // LLEVADO A ENTEROS (redondeo estándar)
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
// 3. CONFIGURACIÓN DEL GRÁFICO (Chart.js)
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
            borderColor: 'transparent',
            borderWidth: 0,           // 👈 SOLUCIÓN 1: Quitar bordes para que no tapen el color
            barPercentage: 1.0,       // 👈 SOLUCIÓN 2: Ensanchar la barra al máximo
            categoryPercentage: 1.0   // 👈 SOLUCIÓN 3: Eliminar espacios entre barras
        }]
    },
    options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            legend: { display: false } // 👈 SOLUCIÓN 4: Oculta la caja morada que confundía
        },
        scales: {
            x: { 
                title: { display: true, text: 'Longitud de Onda en nm' },
                ticks: { maxRotation: 90, minRotation: 90 },
                grid: { display: false } // Ocultar grilla vertical para un aspecto más limpio
            },
            y: { 
                title: { display: true, text: 'counts/(μW/cm2)' }, 
                min: 0, 
                max: 1050 
            }
        }
    }
});

// ==========================================
// 4. LECTURA DE ARCHIVOS CSV (Subidas locales)
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
                
                isMonitoring = false;
                clearInterval(monitorInterval);
                document.getElementById('chartTitle').innerText = "Respuesta Espectral (Muestra Cargada por CSV)";
                
                // Restaura los colores y el tipo de gráfico
                spectroChart.config.type = 'bar';
                spectroChart.data.datasets[0].data = sampleData;
                spectroChart.data.datasets[0].backgroundColor = bgColors;
                spectroChart.data.datasets[0].borderColor = 'transparent';
                spectroChart.data.datasets[0].borderWidth = 0;
                spectroChart.update();
            }
            updateStatus();
            alert(`Archivo ${targetType.toUpperCase()} cargado exitosamente.`);
        } else {
            alert(`Error: El archivo no tiene 288 filas de datos. Encontradas: ${dataArr.length}`);
        }
    };
    reader.readAsText(file);
}

// Listeners para los inputs de tipo file
document.getElementById('fileDark').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'dark'); this.value = null; });
document.getElementById('fileBlank').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'blank'); this.value = null; });
document.getElementById('fileSample').addEventListener('change', function() { if(this.files[0]) processCSV(this.files[0], 'sample'); this.value = null; });

// ==========================================
// 5. SIMULACIÓN DE DATOS (Monitoreo en vivo)
// ==========================================
function simulateData() {
    let newData = [];
    for (let i = 0; i < nm.length; i++) {
        let wl = nm[i];
        let base = 0;
        if (wl < 580) base = 120 + (wl - 301) * 0.2;
        else if (wl < 700) base = 180 + ((wl - 580) / 120) * 450;
        else base = 630 + (wl - 700) * 0.5;
        
        let noise = Math.floor(Math.random() * 70) - 35;
        newData.push(Math.max(100, Math.min(1000, base + noise)));
    }
    return newData;
}

function updateChart() {
    if (!isMonitoring) return;
    currentData = simulateData();
    spectroChart.data.datasets[0].data = currentData;
    spectroChart.update();
}

function updateStatus() {
    document.getElementById('statusPanel').innerHTML = `
        <strong>Estado de Datos:</strong><br><br>
        Blanco: ${blankData ? "✔️ Guardado" : "❌ Vacío"}<br>
        Negro: ${darkData ? "✔️ Guardado" : "❌ Vacío"}<br>
        Muestra: ${sampleData ? "✔️ Guardada" : "❌ Vacía"}
    `;
}

// ==========================================
// 6. EVENTOS DE LOS BOTONES
// ==========================================
document.getElementById('btnMonitor').addEventListener('click', () => {
    isMonitoring = true;
    document.getElementById('chartTitle').innerText = "Respuesta Espectral (Monitoreo Vivo)";
    
    // Restaura visualización de barras a color
    spectroChart.config.type = 'bar';
    spectroChart.data.datasets[0].backgroundColor = bgColors;
    spectroChart.data.datasets[0].borderColor = 'transparent';
    spectroChart.data.datasets[0].borderWidth = 0;
    spectroChart.options.scales.y.max = 1050;
    
    if (monitorInterval) clearInterval(monitorInterval);
    monitorInterval = setInterval(updateChart, 100);
});

document.getElementById('btnStop').addEventListener('click', () => {
    isMonitoring = false;
    clearInterval(monitorInterval);
});

document.getElementById('btnDark').addEventListener('click', () => {
    darkData = [...currentData]; updateStatus(); alert("Negro guardado del monitor.");
});

document.getElementById('btnBlank').addEventListener('click', () => {
    blankData = [...currentData]; updateStatus(); alert("Blanco guardado del monitor.");
});

document.getElementById('btnSample').addEventListener('click', () => {
    sampleData = [...currentData]; updateStatus(); alert("Muestra guardada del monitor.");
});

// ==========================================
// 7. CÁLCULO DE ABSORBANCIA
// ==========================================
document.getElementById('btnAbsorbance').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) {
        alert("Debes tener cargados (en vivo o por CSV) Negro, Blanco y Muestra.");
        return;
    }
    isMonitoring = false; clearInterval(monitorInterval);

    let absorbanceData = [];
    for (let i = 0; i < 288; i++) {
        let num = sampleData[i] - darkData[i];
        let den = blankData[i] - darkData[i];
        let trans = den === 0 ? 0.0001 : num / den;
        trans = Math.max(1e-4, trans); 
        let inverse = Math.max(1e-4, 1 / trans);
        absorbanceData.push(Math.log10(inverse));
    }

    document.getElementById('chartTitle').innerText = "Absorbancia";
    
    // Cambia el gráfico a Línea (Line) y le da estilo
    spectroChart.config.type = 'line';
    spectroChart.data.datasets[0].data = absorbanceData;
    spectroChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)';
    spectroChart.data.datasets[0].borderColor = 'red';
    spectroChart.data.datasets[0].borderWidth = 2; // La línea sí necesita grosor
    spectroChart.options.scales.y.max = null; 
    spectroChart.update();
});

// ==========================================
// 8. CÁLCULO DE COLOR
// ==========================================
document.getElementById('btnColor').addEventListener('click', () => {
    if (!sampleData) { alert("Debes tener una Muestra primero."); return; }
    
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < 288; i++) {
        let wl = nm[i];
        let intensity = sampleData[i] / 1000;
        if (wl >= 400 && wl < 500) { b += intensity * (1 - (wl-400)/100); g += intensity * ((wl-400)/100)*0.5; }
        if (wl >= 500 && wl < 600) { g += intensity * (1 - Math.abs(wl-550)/50); r += intensity * ((wl-500)/100); }
        if (wl >= 600 && wl <= 700) { r += intensity * (1 - (wl-600)/100); }
    }

    let maxColor = Math.max(r, g, b, 1);
    let R_final = Math.floor((r / maxColor) * 255);
    let G_final = Math.floor((g / maxColor) * 255);
    let B_final = Math.floor((b / maxColor) * 255);

    document.getElementById('colorBox').style.backgroundColor = `rgb(${R_final}, ${G_final}, ${B_final})`;
    document.getElementById('rgbText').innerText = `RGB: (${R_final}, ${G_final}, ${B_final})`;
});

// ==========================================
// 9. EXPORTAR A CSV
// ==========================================
document.getElementById('btnExport').addEventListener('click', () => {
    if (!sampleData) { alert("Graba o carga una muestra primero para exportar."); return; }

    let csvContent = "data:text/csv;charset=utf-8,Wavelength(nm),Intensity\n";
    for (let i = 0; i < 288; i++) {
        csvContent += `${nm[i]},${sampleData[i]}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    let date = new Date();
    link.setAttribute("download", `Espectro_Muestra_${date.getHours()}${date.getMinutes()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
