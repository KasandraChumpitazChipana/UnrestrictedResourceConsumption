let attackInterval;
let isAttacking = false;
let requestCount = 0;
let blockedRequests = 0;
let memoryUsage = 45;
let cpuUsage = 20;
let responseTime = 150;

// Actualizar slider de intensidad
document.getElementById('attackIntensity').oninput = function () {
    document.getElementById('intensityValue').textContent = this.value;
};

function addLog(message, type = 'info') {
    const logs = document.getElementById('systemLogs');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    logs.appendChild(logEntry);
    logs.scrollTop = logs.scrollHeight;

    // Mantener solo los últimos 50 logs
    while (logs.children.length > 50) {
        logs.removeChild(logs.firstChild);
    }
}

function updateSystemStatus() {
    const systemLoad = Math.min((memoryUsage + cpuUsage) / 2, 100);
    const loadBar = document.getElementById('systemLoad');
    const statusIndicator = document.getElementById('systemStatus');
    const statusText = document.getElementById('systemStatusText');

    loadBar.style.width = systemLoad + '%';

    if (systemLoad < 50) {
        statusIndicator.className = 'status-indicator status-normal';
        statusText.textContent = 'Normal';
    } else if (systemLoad < 80) {
        statusIndicator.className = 'status-indicator status-warning';
        statusText.textContent = 'Sobrecargado';
    } else {
        statusIndicator.className = 'status-indicator status-critical';
        statusText.textContent = 'Crítico';
        if (systemLoad > 90) {
            statusText.textContent = 'Sistema Caído';
        }
    }
}

function simulateAttack() {
    const attackType = document.getElementById('attackType').value;
    const intensity = parseInt(document.getElementById('attackIntensity').value);

    requestCount++;
    document.getElementById('requestCount').textContent = requestCount;

    // Simular carga del sistema basada en tipo de ataque
    switch (attackType) {
        case 'mass_registration':
            memoryUsage = Math.min(memoryUsage + (intensity * 0.5), 100);
            cpuUsage = Math.min(cpuUsage + (intensity * 0.3), 100);
            responseTime = Math.min(responseTime + (intensity * 2), 5000);
            addLog(`Registro masivo detectado - ${intensity} usuarios/seg`, 'warning');
            break;
        case 'large_images':
            memoryUsage = Math.min(memoryUsage + (intensity * 0.8), 100);
            cpuUsage = Math.min(cpuUsage + (intensity * 0.2), 100);
            responseTime = Math.min(responseTime + (intensity * 3), 8000);
            addLog(`Subida de imagen grande - ${intensity * 10}MB`, 'error');
            break;
        case 'unlimited_queries':
            cpuUsage = Math.min(cpuUsage + (intensity * 0.6), 100);
            responseTime = Math.min(responseTime + (intensity * 4), 10000);
            addLog(`Consulta sin paginación - ${intensity * 1000} registros`, 'error');
            break;
        case 'brute_force':
            cpuUsage = Math.min(cpuUsage + (intensity * 0.4), 100);
            responseTime = Math.min(responseTime + (intensity * 1.5), 3000);
            addLog(`Ataque de fuerza bruta - ${intensity} intentos/seg`, 'error');
            break;
    }

    // Actualizar métricas
    document.getElementById('memoryUsage').textContent = Math.round(memoryUsage) + '%';
    document.getElementById('cpuUsage').textContent = Math.round(cpuUsage) + '%';
    document.getElementById('responseTime').textContent = Math.round(responseTime) + 'ms';

    updateSystemStatus();

    // Si el sistema está sobrecargado, simular errores
    if (memoryUsage > 85 || cpuUsage > 85) {
        addLog('ERROR: Sistema sobrecargado - Rechazando conexiones', 'error');
        if (Math.random() < 0.3) {
            addLog('CRITICAL: OutOfMemoryError detectado', 'error');
        }
    }
}

function startAttack() {
    if (isAttacking) return;

    isAttacking = true;
    const intensity = parseInt(document.getElementById('attackIntensity').value);
    const attackType = document.getElementById('attackType').value;

    addLog(`Iniciando ataque: ${attackType} con intensidad ${intensity}`, 'warning');

    // Agregar clase de animación
    document.querySelector('.demo-card.vulnerable').classList.add('attacking');

    attackInterval = setInterval(simulateAttack, Math.max(1000 / intensity, 50));
}

function stopAttack() {
    if (!isAttacking) return;

    isAttacking = false;
    clearInterval(attackInterval);

    // Remover animación
    document.querySelector('.demo-card.vulnerable').classList.remove('attacking');

    addLog('Ataque detenido - Sistema recuperándose', 'info');

    // Simular recuperación gradual del sistema
    const recoveryInterval = setInterval(() => {
        if (memoryUsage > 45) memoryUsage = Math.max(memoryUsage - 2, 45);
        if (cpuUsage > 20) cpuUsage = Math.max(cpuUsage - 1.5, 20);
        if (responseTime > 150) responseTime = Math.max(responseTime - 50, 150);

        document.getElementById('memoryUsage').textContent = Math.round(memoryUsage) + '%';
        document.getElementById('cpuUsage').textContent = Math.round(cpuUsage) + '%';
        document.getElementById('responseTime').textContent = Math.round(responseTime) + 'ms';

        updateSystemStatus();

        if (memoryUsage <= 45 && cpuUsage <= 20 && responseTime <= 150) {
            clearInterval(recoveryInterval);
            addLog('Sistema completamente recuperado', 'success');
        }
    }, 500);
}

function testProtections() {
    const rateLimiting = document.getElementById('rateLimiting').checked;
    const inputValidation = document.getElementById('inputValidation').checked;
    const memoryLimits = document.getElementById('memoryLimits').checked;
    const pagination = document.getElementById('pagination').checked;

    addLog('Probando protecciones del sistema seguro...', 'info');

    // Simular intentos de ataque y protecciones
    let protectionsActive = 0;
    if (rateLimiting) protectionsActive++;
    if (inputValidation) protectionsActive++;
    if (memoryLimits) protectionsActive++;
    if (pagination) protectionsActive++;

    // Simular bloqueo de requests maliciosas
    const newBlockedRequests = Math.floor(Math.random() * 50) + 10;
    blockedRequests += newBlockedRequests;
    document.getElementById('blockedRequests').textContent = blockedRequests;

    if (rateLimiting) {
        addLog('✅ Rate Limiting: Bloqueadas 25 requests por exceso de límite', 'success');
    }

    if (inputValidation) {
        addLog('✅ Validación Input: Rechazada imagen de 15MB', 'success');
    }

    if (memoryLimits) {
        addLog('✅ Límites Memoria: Aplicado throttling automático', 'success');
    }

    if (pagination) {
        addLog('✅ Paginación: Limitada consulta a 20 registros máximo', 'success');
    }

    // El sistema protegido mantiene recursos estables
    const protectedMemory = Math.max(25 + (Math.random() * 10), 25);
    const protectedCpu = Math.max(15 + (Math.random() * 8), 15);
    const protectedResponse = Math.max(80 + (Math.random() * 20), 80);

    document.getElementById('protectedMemory').textContent = Math.round(protectedMemory) + '%';
    document.getElementById('protectedCpu').textContent = Math.round(protectedCpu) + '%';
    document.getElementById('protectedResponse').textContent = Math.round(protectedResponse) + 'ms';

    const protectedLoad = (protectedMemory + protectedCpu) / 2;
    document.getElementById('protectedLoad').style.width = protectedLoad + '%';

    addLog(`Sistema protegido: ${protectionsActive}/4 protecciones activas`, 'success');
}

// Inicializar estado
updateSystemStatus();

// Simular actividad normal del sistema cada 5 segundos
setInterval(() => {
    if (!isAttacking) {
        // Pequeñas variaciones normales
        const memoryVariation = (Math.random() - 0.5) * 2;
        const cpuVariation = (Math.random() - 0.5) * 3;

        memoryUsage = Math.max(Math.min(memoryUsage + memoryVariation, 50), 40);
        cpuUsage = Math.max(Math.min(cpuUsage + cpuVariation, 25), 15);

        document.getElementById('memoryUsage').textContent = Math.round(memoryUsage) + '%';
        document.getElementById('cpuUsage').textContent = Math.round(cpuUsage) + '%';

        updateSystemStatus();
    }
}, 5000);

// Agregar eventos de teclado para hacer la demo más interactiva
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (isAttacking) {
            stopAttack();
        } else {
            startAttack();
        }
    }
});

// Mostrar información adicional cuando se selecciona un tipo de ataque
document.getElementById('attackType').addEventListener('change', function () {
    const attackType = this.value;
    let description = '';

    switch (attackType) {
        case 'mass_registration':
            description = 'Simula la creación masiva de cuentas de usuario para agotar recursos de base de datos y memoria.';
            break;
        case 'large_images':
            description = 'Simula la subida de imágenes enormes en el campo userImage para agotar espacio y memoria.';
            break;
        case 'unlimited_queries':
            description = 'Simula consultas que retornan todos los usuarios sin paginación, agotando CPU y memoria.';
            break;
        case 'brute_force':
            description = 'Simula intentos masivos de login para agotar recursos de CPU y conexiones de base de datos.';
            break;
    }

    addLog(`Ataque seleccionado: ${description}`, 'info');
});