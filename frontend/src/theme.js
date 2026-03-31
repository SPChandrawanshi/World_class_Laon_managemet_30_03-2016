// ============================================================
// LENDANET – Central Theme & Config
// Change colors here and they propagate across the whole app.
// ============================================================

export const THEME = {
  // Brand colors (use CSS-compatible values)
  brand: {
    primary:        '#1e40af',   // deep blue
    primaryHover:   '#1d4ed8',
    primaryLight:   '#dbeafe',
    primaryDark:    '#1e3a8a',
    secondary:      '#0ea5e9',   // sky
    accent:         '#6366f1',   // indigo
  },
  role: {
    admin: {
      primary:  '#1e40af',
      light:    '#dbeafe',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
    },
    staff: {
      primary:  '#4f46e5',
      light:    '#e0e7ff',
      gradient: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
    },
    borrower: {
      primary:  '#0f172a',
      light:    '#f1f5f9',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    },
    agent: {
      primary:  '#7c3aed',
      light:    '#f5f3ff',
      gradient: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
    },
  },
  risk: {
    GREEN: {
      bg:      '#f0fdf4',
      border:  '#bbf7d0',
      text:    '#166534',
      badge:   '#dcfce7',
      dot:     '#22c55e',
      label:   'Low Risk',
    },
    AMBER: {
      bg:      '#fffbeb',
      border:  '#fde68a',
      text:    '#92400e',
      badge:   '#fef3c7',
      dot:     '#f59e0b',
      label:   'Medium Risk',
    },
    RED: {
      bg:      '#fef2f2',
      border:  '#fecaca',
      text:    '#991b1b',
      badge:   '#fee2e2',
      dot:     '#ef4444',
      label:   'High Risk',
    },
  },
  status: {
    active:           { bg: '#dcfce7', text: '#166534', dot: '#22c55e' }, // Green
    pending:          { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' }, // Orange
    approved:         { bg: '#dcfce7', text: '#166534', dot: '#22c55e' }, // Green
    rejected:         { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' }, // Red
    paid:             { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
    verified:         { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
    defaulted:        { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    late:             { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    overdue:          { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    completed:        { bg: '#e0f2fe', text: '#075985', dot: '#0ea5e9' }, // Blue
    suspended:        { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' },
    terms_set:        { bg: '#faf5ff', text: '#6b21a8', dot: '#a855f7' }, // Purple
    terms_accepted:   { bg: '#f0fdf4', text: '#15803d', dot: '#4ade80' }, // Light Green
    funds_confirmed:  { bg: '#eff6ff', text: '#1d4ed8', dot: '#60a5fa' }, // Blue
    upcoming:         { bg: '#eff6ff', text: '#1d4ed8', dot: '#60a5fa' },
    'due-today':      { bg: '#fef3c7', text: '#b45309', dot: '#f59e0b' },
  },
};

export const DEMO_CREDENTIALS = [
  {
    role: 'admin',
    name: 'System Admin',
    phone: '0000000001',
    email: 'admin@lendanet.com',
    password: 'password123',
    initials: 'SA',
    verificationStatus: 'verified'
  },
  {
    role: 'staff',
    name: 'Global Node',
    phone: '0000000002',
    email: 'staff@lendanet.com',
    password: 'password123',
    initials: 'GN',
    verificationStatus: 'verified'
  },
  {
    role: 'borrower',
    name: 'David Zulu',
    phone: '0000000003',
    email: 'borrower@lendanet.com',
    password: 'password123',
    initials: 'DZ',
    verificationStatus: 'verified',
    idScanUrl: 'https://example.com/id.jpg'
  },
  {
    role: 'agent',
    name: 'Alice Agent',
    phone: '0000000004',
    email: 'agent@lendanet.com',
    password: 'password123',
    initials: 'AA',
    verificationStatus: 'verified'
  },
];

