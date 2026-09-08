export function localDate(value = new Date()) {
  return [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-')
}

export function weekStart(date) {
  const value = new Date(date + 'T12:00:00')
  value.setDate(value.getDate() - (value.getDay() + 6) % 7)
  return localDate(value)
}

export function menusForWeek(menus, date) {
  const start = weekStart(date)
  const end = new Date(start + 'T12:00:00')
  end.setDate(end.getDate() + 7)
  const until = localDate(end)
  return menus.filter(item => item.date >= start && item.date < until)
    .sort((a, b) => a.date.localeCompare(b.date))
}
