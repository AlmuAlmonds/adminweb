/* ========================================
   PULSE Admin - Dashboard JavaScript
   Emergency Response System
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeDashboard();
  initializeCharts();
  populateIncidentsTable();
  populateTimeline();
  initializeAutoRefresh();
  initializeSidebar();
});

// ========================================
// Dashboard Initialization
// ========================================
function initializeDashboard() {
  // Update current time
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
  
  // Simulate live data updates
  simulateLiveUpdates();
}

function updateCurrentTime() {
  const timeElement = document.getElementById('currentTime');
  if (timeElement) {
    const now = new Date();
    timeElement.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

function simulateLiveUpdates() {
  // Simulate occasional KPI updates
  setInterval(() => {
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(el => {
      // Small random fluctuations
      const currentVal = parseInt(el.textContent);
      if (!isNaN(currentVal) && Math.random() > 0.8) {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newVal = Math.max(0, currentVal + change);
        animateValue(el, currentVal, newVal, 500);
      }
    });
  }, 15000);
}

function animateValue(element, start, end, duration) {
  const range = end - start;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(start + range * progress);
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ========================================
// Chart Initialization
// ========================================
function initializeCharts() {
  initializeDailyTrendChart();
  initializeResponseTimeChart();
  initializeEmergencyTypesChart();
}

function initializeDailyTrendChart() {
  const ctx = document.getElementById('dailyTrendChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: MOCK_DATA.dailyIncidents.labels,
      datasets: [{
        label: 'Incidents',
        data: MOCK_DATA.dailyIncidents.data,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initializeResponseTimeChart() {
  const ctx = document.getElementById('responseTimeChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MOCK_DATA.responseTime.labels,
      datasets: [{
        label: 'Minutes',
        data: MOCK_DATA.responseTime.data,
        backgroundColor: [
          'rgba(46, 204, 113, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(46, 204, 113, 0.8)',
          'rgba(243, 156, 18, 0.8)',
          'rgba(46, 204, 113, 0.8)'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function initializeEmergencyTypesChart() {
  const ctx = document.getElementById('emergencyTypesChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: MOCK_DATA.emergencyTypeStats.labels,
      datasets: [{
        data: MOCK_DATA.emergencyTypeStats.data,
        backgroundColor: MOCK_DATA.emergencyTypeStats.colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// ========================================
// Incidents Table
// ========================================
function populateIncidentsTable() {
  const tableBody = document.getElementById('incidentsTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  MOCK_DATA.recentIncidents.forEach(incident => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <span class="incident-id fw-bold">${incident.id}</span>
      </td>
      <td>
        <span class="emergency-type ${Utils.getEmergencyClass(incident.type)}">
          <i class="fas ${Utils.getEmergencyIcon(incident.type)}"></i>
          ${incident.type}
        </span>
      </td>
      <td>
        <span class="location-text">
          <i class="fas fa-map-marker-alt"></i>
          ${incident.location}
        </span>
      </td>
      <td>
        <span class="time-text fw-bold text-danger">${incident.reported}</span>
      </td>
      <td>
        <span class="status-badge ${Utils.getStatusClass(incident.status)}">
          ${incident.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          ${incident.status === 'Pending' || incident.status === 'Verified' ? 
            `<button class="btn btn-sm btn-danger text-white" onclick="dispatchResponder('${incident.id}')">Assign Responder</button>` : 
            `<button class="btn btn-sm btn-outline-secondary" onclick="viewIncident('${incident.id}')">View Details</button>`
          }
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// ========================================
// Timeline
// ========================================
function populateTimeline() {
  const timeline = document.getElementById('responseTimeline');
  if (!timeline) return;
  
  timeline.innerHTML = '';
  
  MOCK_DATA.timelineEvents.forEach((event, index) => {
    const item = document.createElement('div');
    item.className = `timeline-item ${event.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <h4>${event.title}</h4>
          <span class="timeline-time">${event.time}</span>
        </div>
        <p>${event.description}</p>
      </div>
    `;
    timeline.appendChild(item);
  });
}

// ========================================
// Auto Refresh
// ========================================
function initializeAutoRefresh() {
  const refreshBtn = document.getElementById('refreshData');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshData();
    });
  }
  
  // Auto refresh every 30 seconds
  setInterval(refreshData, 30000);
}

function refreshData() {
  // Show loading indicator
  showNotification('Refreshing data...', 'info');
  
  // Simulate data refresh
  setTimeout(() => {
    populateIncidentsTable();
    populateTimeline();
    showNotification('Data refreshed successfully', 'success');
  }, 500);
}

// ========================================
// Sidebar Toggle
// ========================================
function initializeSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent?.classList.toggle('expanded');
    });
  }
  
  // Handle mobile sidebar
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }
}

// ========================================
// Action Functions
// ========================================
function viewIncident(incidentId) {
  // Navigate to incident details or show modal
  showNotification(`Opening incident ${incidentId}...`, 'info');
  // In real app: window.location.href = `incident-details.html?id=${incidentId}`;
}

function dispatchResponder(incidentId) {
  showNotification(`Dispatching responder for ${incidentId}...`, 'success');
  // In real app: Open dispatch modal or navigate to dispatch page
}

// ========================================
// Notifications
// ========================================
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas ${getNotificationIcon(type)}"></i>
    <span>${message}</span>
  `;
  
  // Get or create notification container
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  container.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  return icons[type] || icons.info;
}

// ========================================
// Export functions for global access
// ========================================
window.viewIncident = viewIncident;
window.dispatchResponder = dispatchResponder;
window.refreshData = refreshData;
window.showNotification = showNotification;
