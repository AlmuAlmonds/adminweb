/* ========================================
   PULSE Admin - Mock Data
   Emergency Response System
   ======================================== */

const MOCK_DATA = {
  // Emergency Types
  emergencyTypes: ['Medical', 'Fire', 'Crime', 'Disaster', 'Rescue'],
  
  // Status Options
  statusOptions: ['Pending', 'Verified', 'Dispatched', 'Resolved'],
  
  // Connectivity Modes
  connectivityModes: ['Online', 'Offline Sync', 'SMS'],
  
  // Priority Levels
  priorities: ['High', 'Medium', 'Low'],
  
  // Sample Locations in San Juan
  locations: [
    'Brgy. Addition Hills, San Juan City',
    'Brgy. Balong-Bato, San Juan City',
    'Brgy. Batis, San Juan City',
    'Brgy. Corazon de Jesus, San Juan City',
    'Brgy. Ermitaño, San Juan City',
    'Brgy. Greenhills, San Juan City',
    'Brgy. Isabelita, San Juan City',
    'Brgy. Kabayanan, San Juan City',
    'Brgy. Little Baguio, San Juan City',
    'Brgy. Maytunas, San Juan City',
    'Brgy. Onse, San Juan City',
    'Brgy. Pasadeña, San Juan City',
    'Brgy. Pedro Cruz, San Juan City',
    'Brgy. Progreso, San Juan City',
    'Brgy. Rivera, San Juan City',
    'Brgy. Salapan, San Juan City',
    'Brgy. San Perfecto, San Juan City',
    'Brgy. Santa Lucia, San Juan City',
    'Brgy. Tibagan, San Juan City',
    'Brgy. West Crame, San Juan City'
  ],
  
  // Recent Incidents
  recentIncidents: [
    {
      id: 'INC-2026-0147',
      type: 'Medical',
      location: 'Brgy. Greenhills, San Juan City',
      reported: '2 mins ago',
      status: 'Pending',
      mode: 'Online',
      priority: 'High'
    },
    {
      id: 'INC-2026-0146',
      type: 'Fire',
      location: 'Brgy. Addition Hills, San Juan City',
      reported: '8 mins ago',
      status: 'Dispatched',
      mode: 'Online',
      priority: 'High'
    },
    {
      id: 'INC-2026-0145',
      type: 'Crime',
      location: 'Brgy. Batis, San Juan City',
      reported: '15 mins ago',
      status: 'Verified',
      mode: 'SMS',
      priority: 'Medium'
    },
    {
      id: 'INC-2026-0144',
      type: 'Rescue',
      location: 'Brgy. Little Baguio, San Juan City',
      reported: '23 mins ago',
      status: 'Dispatched',
      mode: 'Offline Sync',
      priority: 'High'
    },
    {
      id: 'INC-2026-0143',
      type: 'Medical',
      location: 'Brgy. Corazon de Jesus, San Juan City',
      reported: '35 mins ago',
      status: 'Resolved',
      mode: 'Online',
      priority: 'Low'
    },
    {
      id: 'INC-2026-0142',
      type: 'Disaster',
      location: 'Brgy. Ermitaño, San Juan City',
      reported: '1 hour ago',
      status: 'Resolved',
      mode: 'Online',
      priority: 'Medium'
    }
  ],
  
  // Response Timeline Events
  timelineEvents: [
    {
      title: 'Fire reported at Addition Hills',
      description: 'Caller: Juan Dela Cruz - Smoke seen from 3rd floor apartment',
      time: '10:45 AM',
      completed: false
    },
    {
      title: 'Responder Unit F-02 dispatched',
      description: 'Fire truck and 6 personnel assigned',
      time: '10:47 AM',
      completed: false
    },
    {
      title: 'Medical emergency in Greenhills',
      description: 'Elderly patient experiencing chest pain',
      time: '10:42 AM',
      completed: false
    },
    {
      title: 'Rescue operation completed',
      description: 'Flood victim rescued at Little Baguio - No injuries',
      time: '10:30 AM',
      completed: true
    },
    {
      title: 'Crime incident resolved',
      description: 'Suspect apprehended at Batis - Case closed',
      time: '10:15 AM',
      completed: true
    }
  ],
  
  // Daily Incident Data (Last 7 days)
  dailyIncidents: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [18, 24, 21, 28, 22, 19, 24]
  },
  
  // Response Time Data (Last 7 days in minutes)
  responseTime: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [7.2, 6.8, 7.5, 6.5, 6.9, 7.1, 6.8]
  },
  
  // Emergency Types Distribution
  emergencyTypeStats: {
    labels: ['Medical', 'Fire', 'Crime', 'Disaster', 'Rescue'],
    data: [35, 18, 25, 8, 14],
    colors: ['#e74c3c', '#f39c12', '#3498db', '#9b59b6', '#1abc9c']
  },
  
  // Users Data
  users: [
    {
      id: 'USR-001',
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      role: 'Citizen',
      status: 'Active',
      phone: '+63 917 123 4567',
      registered: '2025-06-15'
    },
    {
      id: 'USR-002',
      name: 'Maria Santos',
      email: 'maria@cedoc.gov.ph',
      role: 'Responder',
      status: 'Active',
      phone: '+63 918 234 5678',
      registered: '2025-03-22'
    },
    {
      id: 'USR-003',
      name: 'Pedro Reyes',
      email: 'pedro@cedoc.gov.ph',
      role: 'Admin',
      status: 'Active',
      phone: '+63 919 345 6789',
      registered: '2025-01-10'
    },
    {
      id: 'USR-004',
      name: 'Ana Garcia',
      email: 'ana@email.com',
      role: 'Citizen',
      status: 'Inactive',
      phone: '+63 920 456 7890',
      registered: '2025-08-05'
    },
    {
      id: 'USR-005',
      name: 'Carlos Mendoza',
      email: 'carlos@bfp.gov.ph',
      role: 'Responder',
      status: 'Active',
      phone: '+63 921 567 8901',
      registered: '2025-02-28'
    }
  ],
  
  // Responders Data
  responders: [
    {
      id: 'RES-001',
      name: 'Unit A-01 (Ambulance)',
      type: 'Medical',
      status: 'Available',
      location: 'CEDOC HQ',
      personnel: 4
    },
    {
      id: 'RES-002',
      name: 'Unit F-01 (Fire Truck)',
      type: 'Fire',
      status: 'Dispatched',
      location: 'Brgy. Addition Hills',
      personnel: 6
    },
    {
      id: 'RES-003',
      name: 'Unit P-01 (Patrol)',
      type: 'Police',
      status: 'Available',
      location: 'CEDOC HQ',
      personnel: 2
    },
    {
      id: 'RES-004',
      name: 'Unit R-01 (Rescue)',
      type: 'Rescue',
      status: 'Dispatched',
      location: 'Brgy. Little Baguio',
      personnel: 5
    },
    {
      id: 'RES-005',
      name: 'Unit A-02 (Ambulance)',
      type: 'Medical',
      status: 'Available',
      location: 'CEDOC HQ',
      personnel: 4
    }
  ],
  
  // System Logs
  systemLogs: [
    {
      id: 'LOG-001',
      type: 'OTP',
      message: 'OTP verified for +63 917 123 4567',
      timestamp: '2026-02-04 10:45:23',
      status: 'Success'
    },
    {
      id: 'LOG-002',
      type: 'SMS',
      message: 'SMS alert sent to Brgy. Greenhills responders',
      timestamp: '2026-02-04 10:43:15',
      status: 'Success'
    },
    {
      id: 'LOG-003',
      type: 'Offline',
      message: 'Offline data synced from device ID: DEV-892',
      timestamp: '2026-02-04 10:40:08',
      status: 'Success'
    },
    {
      id: 'LOG-004',
      type: 'OTP',
      message: 'OTP expired for +63 918 234 5678',
      timestamp: '2026-02-04 10:38:45',
      status: 'Failed'
    },
    {
      id: 'LOG-005',
      type: 'SMS',
      message: 'SMS fallback activated - Internet unavailable',
      timestamp: '2026-02-04 10:35:12',
      status: 'Warning'
    },
    {
      id: 'LOG-006',
      type: 'System',
      message: 'Database backup completed',
      timestamp: '2026-02-04 10:30:00',
      status: 'Success'
    },
    {
      id: 'LOG-007',
      type: 'Offline',
      message: 'Offline queue: 3 pending syncs',
      timestamp: '2026-02-04 10:25:30',
      status: 'Warning'
    }
  ],
  
  // Dispatch Timeline for specific incident
  dispatchTimeline: [
    {
      time: '10:45:00',
      event: 'Emergency Reported',
      details: 'Citizen reported via PULSE App',
      status: 'completed'
    },
    {
      time: '10:45:30',
      event: 'Auto-verified',
      details: 'Location and type confirmed by system',
      status: 'completed'
    },
    {
      time: '10:46:15',
      event: 'Responder Assigned',
      details: 'Unit F-01 assigned to incident',
      status: 'completed'
    },
    {
      time: '10:47:00',
      event: 'Unit Dispatched',
      details: 'ETA: 5 minutes',
      status: 'completed'
    },
    {
      time: '10:52:00',
      event: 'Unit Arrived',
      details: 'Responders on scene',
      status: 'active'
    },
    {
      time: '--:--:--',
      event: 'Incident Resolved',
      details: 'Awaiting confirmation',
      status: 'pending'
    }
  ]
};

// Utility functions
const Utils = {
  // Get random item from array
  randomItem: (arr) => arr[Math.floor(Math.random() * arr.length)],
  
  // Generate random ID
  generateId: (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`,
  
  // Format time ago
  timeAgo: (minutes) => {
    if (minutes < 60) return `${minutes} mins ago`;
    if (minutes < 1440) return `${Math.floor(minutes/60)} hours ago`;
    return `${Math.floor(minutes/1440)} days ago`;
  },
  
  // Get status class
  getStatusClass: (status) => {
    const classes = {
      'Pending': 'pending',
      'Verified': 'verified',
      'Dispatched': 'dispatched',
      'Resolved': 'resolved',
      'Active': 'success',
      'Inactive': 'warning'
    };
    return classes[status] || 'pending';
  },
  
  // Get connectivity class
  getConnectivityClass: (mode) => {
    const classes = {
      'Online': 'online',
      'Offline Sync': 'offline',
      'SMS': 'sms'
    };
    return classes[mode] || 'online';
  },
  
  // Get priority class
  getPriorityClass: (priority) => {
    const classes = {
      'High': 'high',
      'Medium': 'medium',
      'Low': 'low'
    };
    return classes[priority] || 'medium';
  },
  
  // Get emergency icon
  getEmergencyIcon: (type) => {
    const icons = {
      'Medical': 'fa-heartbeat',
      'Fire': 'fa-fire',
      'Crime': 'fa-shield-alt',
      'Disaster': 'fa-house-damage',
      'Rescue': 'fa-life-ring'
    };
    return icons[type] || 'fa-exclamation-circle';
  },
  
  // Get emergency class
  getEmergencyClass: (type) => {
    const classes = {
      'Medical': 'medical',
      'Fire': 'fire',
      'Crime': 'crime',
      'Disaster': 'disaster',
      'Rescue': 'rescue'
    };
    return classes[type] || 'medical';
  }
};

// Export for use in other scripts
window.MOCK_DATA = MOCK_DATA;
window.Utils = Utils;
