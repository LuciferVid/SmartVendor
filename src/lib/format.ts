import { format, formatDistance, isPast } from 'date-fns'

export const formatCurrency = (amount: number, currency: string = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatDate = (date: Date | string) => {
  return format(new Date(date), 'dd MMM yyyy')
}

export const formatDateTime = (date: Date | string) => {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

export const formatDateRelative = (date: Date | string) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export const getDaysUntil = (date: Date | string) => {
  const days = Math.ceil(
    (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  return days
}

export const isDateOverdue = (date: Date | string) => {
  return isPast(new Date(date))
}

export const formatPercentage = (value: number, decimals: number = 0) => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const truncate = (str: string, length: number) => {
  return str.length > length ? str.substring(0, length) + '...' : str
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
