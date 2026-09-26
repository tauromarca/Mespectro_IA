// ==========================================
// 1. GENERACIÓN DE LONGITUDES DE ONDA (nm)
// Basado en el polinomio de tu código Python (Num serie 23D00088)
// ==========================================
const A_0 = 2.991638797E+02, B_1 = 2.694248478E+00, B_2 = -8.556340170E-04;
const B_3 = -9.851009025E-06, B_4 = 1.633909302E-08, B_5 = -3.346647530E-12;

let nm = [];
let bgColors = [];

// Función para mapear nm a colores para el gráfico de barras
function nmToRGB(wavelength) {
    if (wavelength < 380) return "darkviolet";
    if (wavelength < 410) return "blueviolet";
    if (wavelength < 450) return "violet";
    if (wavelength < 480) return "blue";
    if (wavelength < 500) return "cyan";
    if (wavelength < 550) return "green";
    if (wavelength < 570) return "greenyellow";
    if (wavelength < 580) return "yellow";
    if (wavelength < 620) return "orange";
    if (wavelength < 700) return "red";
    if (wavelength < 760) return "darkred";
    return "maroon";
}

for (let i = 1; i <= 288; i++) {
    let wave = A_0 + (B_1 * i) + (B_2 * Math.pow(i, 2)) + (B_3 * Math.pow(i, 3)) + (B_4 * Math.pow(i, 4)) + (B_5 * Math.pow(i, 5));
    nm.push(wave.toFixed(1)); // Redondeado a 1 decimal
    bgColors.push(nmToRGB(wave));
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
            label: 'Intensidad (counts)',
            data: currentData,
            backgroundColor: bgColors,
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        animation: { duration: 0 }, // Sin animación para que se vea como en tiempo real
        scales: {
            x: { title: { display: true, text: 'Longitud de Onda (nm)' } },
            y: { title: { display: true, text: 'counts/(μW/cm2)' }, min: 0, max: 1050 }
        }
    }
});

// ==========================================
// 4. SIMULACIÓN DE DATOS (Misma lógica de Python)
// ==========================================
function simulateData() {
    let newData = [];
    for (let i = 0; i < nm.length; i++) {
        let wl = parseFloat(nm[i]);
        let base = 0;
        if (wl < 580) {
            base = 120 + (wl - 301) * 0.2;
        } else if (wl < 700) {
            base = 180 + ((wl - 580) / 120) * 450;
        } else {
            base = 630 + (wl - 700) * 0.5;
        }
        let noise = Math.floor(Math.random() * 70) - 35; // Ruido +-35
        let finalVal = Math.max(100, Math.min(1000, base + noise));
        newData.push(finalVal);
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
        Blanco: ${blankData ? "✔️ Guardado" : "❌ No guardado"}<br>
        Negro: ${darkData ? "✔️ Guardado" : "❌ No guardado"}<br>
        Muestra: ${sampleData ? "✔️ Guardada" : "❌ No guardada"}
    `;
}

// ==========================================
// 5. EVENTOS DE LOS BOTONES
// ==========================================

// Iniciar Monitoreo
document.getElementById('btnMonitor').addEventListener('click', () => {
    isMonitoring = true;
    document.getElementById('chartTitle').innerText = "Respuesta Espectral (Monitoreo)";
    spectroChart.config.type = 'bar';
    spectroChart.data.datasets[0].backgroundColor = bgColors;
    spectroChart.options.scales.y.max = 1050;
    if (monitorInterval) clearInterval(monitorInterval);
    monitorInterval = setInterval(updateChart, 100); // Actualiza cada 100ms
});

// Detener
document.getElementById('btnStop').addEventListener('click', () => {
    isMonitoring = false;
    clearInterval(monitorInterval);
});

// Grabar Negro
document.getElementById('btnDark').addEventListener('click', () => {
    darkData = [...currentData]; // Copia el arreglo actual
    updateStatus();
    alert("Datos de negro guardados.");
});

// Grabar Blanco
document.getElementById('btnBlank').addEventListener('click', () => {
    blankData = [...currentData];
    updateStatus();
    alert("Datos de blanco guardados.");
});

// Grabar Muestra
document.getElementById('btnSample').addEventListener('click', () => {
    sampleData = [...currentData];
    updateStatus();
    alert("Datos de muestra guardados.");
});

// ==========================================
// 6. CÁLCULO DE ABSORBANCIA (Matemática de Python)
// ==========================================
document.getElementById('btnAbsorbance').addEventListener('click', () => {
    if (!blankData || !darkData || !sampleData) {
        alert("Debes grabar Negro, Blanco y Muestra antes de calcular la absorbancia.");
        return;
    }

    isMonitoring = false; // Detener monitoreo
    clearInterval(monitorInterval);

    let absorbanceData = [];
    for (let i = 0; i < 288; i++) {
        // list_1= ((spectroReadings3-negro)/(blanco-negro))
        let num = sampleData[i] - darkData[i];
        let den = blankData[i] - darkData[i];
        
        let trans = den === 0 ? 0.0001 : num / den;
        trans = Math.max(1e-4, trans); // Evitar negativos y ceros
        
        let inverse = 1 / trans;
        inverse = Math.max(1e-4, inverse);
        
        let abs = Math.log10(inverse);
        absorbanceData.push(abs);
    }

    // Cambiar gráfico a línea para Absorbancia
    document.getElementById('chartTitle').innerText = "Absorbancia";
    spectroChart.config.type = 'line';
    spectroChart.data.datasets[0].data = absorbanceData;
    spectroChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)';
    spectroChart.data.datasets[0].borderColor = 'red';
    spectroChart.options.scales.y.max = null; // Auto escala
    spectroChart.update();
});

// ==========================================
// 7. CÁLCULO DE COLOR APROXIMADO
// ==========================================
document.getElementById('btnColor').addEventListener('click', () => {
    if (!sampleData) {
        alert("Debes grabar una Muestra primero.");
        return;
    }
    
    // Algoritmo simplificado de conversión de espectro a RGB
    let r = 0, g = 0, b = 0;
    
    for (let i = 0; i < 288; i++) {
        let wl = parseFloat(nm[i]);
        let intensity = sampleData[i] / 1000; // Normalizado
        
        // Curvas de coincidencia de color CIE (Aproximación simple)
        if (wl >= 400 && wl < 500) { b += intensity * (1 - (wl-400)/100); g += intensity * ((wl-400)/100)*0.5; }
        if (wl >= 500 && wl < 600) { g += intensity * (1 - Math.abs(wl-550)/50); r += intensity * ((wl-500)/100); }
        if (wl >= 600 && wl <= 700) { r += intensity * (1 - (wl-600)/100); }
    }

    // Normalizar a 255
    let maxColor = Math.max(r, g, b, 1);
    let R_final = Math.floor((r / maxColor) * 255);
    let G_final = Math.floor((g / maxColor) * 255);
    let B_final = Math.floor((b / maxColor) * 255);

    document.getElementById('colorBox').style.backgroundColor = `rgb(${R_final}, ${G_final}, ${B_final})`;
    document.getElementById('rgbText').innerText = `RGB: (${R_final}, ${G_final}, ${B_final})`;
});

// ==========================================
// 8. EXPORTAR A CSV
// ==========================================
document.getElementById('btnExport').addEventListener('click', () => {
    if (!sampleData) {
        alert("Graba una muestra primero para exportar.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Wavelength(nm),Intensity\n";
    
    for (let i = 0; i < 288; i++) {
        csvContent += `${nm[i]},${sampleData[i]}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    let date = new Date();
    link.setAttribute("download", `Espectro_${date.getHours()}${date.getMinutes()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
