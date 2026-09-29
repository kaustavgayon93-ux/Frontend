import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals: number = 2): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatArea(ha: number): string {
  if (ha >= 100) {
    return `${formatNumber(ha / 100)} km²`;
  }
  return `${formatNumber(ha)} ha`;
}

export function statusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE': return 'bg-green-100 text-green-800';
    case 'MONITORING': return 'bg-blue-100 text-blue-800';
    case 'VERIFIED': return 'bg-purple-100 text-purple-800';
    case 'ARCHIVED': return 'bg-red-100 text-red-800';
    case 'DRAFT':
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status.toUpperCase()) {
    case 'ACTIVE': return 'success';
    case 'MONITORING': return 'default';
    case 'VERIFIED': return 'secondary';
    case 'ARCHIVED': return 'destructive';
    case 'DRAFT':
    default: return 'outline';
  }
}
