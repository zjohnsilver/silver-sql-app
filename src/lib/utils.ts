export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function exportToCSV(columns: string[], rows: any[][], filename: string = 'query-results.csv') {
  const csvContent = [
    columns.join(','),
    ...rows.map(row => 
      row.map(cell => {
        const value = cell === null ? '' : String(cell);
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getRecentClients(): string[] {
  if (typeof window === 'undefined') return [];
  const recent = localStorage.getItem('recent_clients');
  return recent ? JSON.parse(recent) : [];
}

export function addRecentClient(clientId: string) {
  if (typeof window === 'undefined') return;
  const recent = getRecentClients();
  const filtered = recent.filter(id => id !== clientId);
  const updated = [clientId, ...filtered].slice(0, 5);
  localStorage.setItem('recent_clients', JSON.stringify(updated));
}

