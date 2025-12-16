export function buildBookingSearchUrl(params: {
  destination: string
  startDate: string
  endDate: string
  adults: number
}): string {
  const qs = new URLSearchParams({
    ss: params.destination,
    checkin: params.startDate,
    checkout: params.endDate,
    group_adults: String(params.adults),
    group_children: '0',
    no_rooms: '1',
    lang: 'it'
  })
  return `https://www.booking.com/searchresults.html?${qs.toString()}`
}

export function buildGetYourGuideSearchUrl(params: {
  destination: string
  date?: string
  category?: string
}): string {
  const qs = new URLSearchParams({
    q: params.destination,
    lc: 'l',
    visitor_country: 'IT'
  })
  if (params.date) qs.set('date', params.date)
  if (params.category) qs.set('categories', params.category)
  return `https://www.getyourguide.com/s/?${qs.toString()}`
}

