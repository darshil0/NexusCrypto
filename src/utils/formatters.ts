/**
 * Utility functions for precise, safe financial formatting
 */

export function formatUSD(value: number, minDecimals = 2, maxDecimals?: number): string {
  if (isNaN(value) || value === null || value === undefined) return '$0.00';
  
  let min = Math.max(0, Math.min(20, minDecimals));
  let max = maxDecimals !== undefined ? Math.max(0, Math.min(20, maxDecimals)) : Math.max(min, 2);

  // For small prices like $0.0001 or $0.584 if default decimals used
  if (Math.abs(value) > 0 && Math.abs(value) < 1 && minDecimals === 2 && (maxDecimals === undefined || maxDecimals === 2)) {
    min = 4;
    max = 4;
  }

  if (max < min) {
    max = min;
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(value);
  } catch {
    return `$${value.toFixed(min)}`;
  }
}

export function formatCrypto(value: number, decimals = 4): string {
  if (isNaN(value) || value === null || value === undefined) return '0.0000';
  
  if (value === 0) return '0';
  if (Math.abs(value) < 0.00001) {
    return value.toFixed(Math.min(8, Math.max(decimals, 8)));
  }
  if (Math.abs(value) < 1) {
    const d = Math.max(decimals >= 4 ? decimals : 4, 0);
    return value.toFixed(Math.min(20, d));
  }

  const max = Math.max(0, Math.min(20, decimals));
  const min = Math.min(max, 2);

  try {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    });
  } catch {
    return value.toFixed(max);
  }
}

export function formatPercent(value: number, includeSign = true): string {
  if (isNaN(value) || value === null || value === undefined) return '0.00%';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return '$0';
  if (Math.abs(value) >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatUSD(value);
}

export function formatTimestamp(timestamp: number, format: 'short' | 'full' | 'time' = 'short'): string {
  const date = new Date(timestamp);
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour12: false });
  }
  if (format === 'full') {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Generates and triggers browser download of CSV string
 */
export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(field => {
        const str = String(field ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
