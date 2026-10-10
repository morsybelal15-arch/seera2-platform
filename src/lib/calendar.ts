/**
 * Helper utilities for Calendar integration
 * Generates Google Calendar web links and downloadable iCalendar (.ics) files
 */

export interface CalendarEventDetails {
  title: string;
  description: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24-hour format)
  durationMinutes?: number;
}

/**
 * Builds a direct Google Calendar add event URL
 */
export function buildGoogleCalendarUrl({
  title,
  description,
  location = 'عيادة CERRAH للطب الرياضي والتأهيل ونحت القوام - القاهرة الجديدة',
  startDate,
  startTime,
  durationMinutes = 60,
}: CalendarEventDetails): string {
  // Parse date and time
  const [year, month, day] = startDate.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);

  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatUtcString = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatUtcString(start)}/${formatUtcString(end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: description,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Triggers a download of a standard .ics calendar file
 */
export function downloadIcsFile({
  title,
  description,
  location = 'عيادة CERRAH للطب الرياضي والتأهيل ونحت القوام - القاهرة الجديدة',
  startDate,
  startTime,
  durationMinutes = 60,
}: CalendarEventDetails): void {
  const [year, month, day] = startDate.split('-').map(Number);
  const [hours, minutes] = startTime.split(':').map(Number);

  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatUtcString = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const uid = `cerrah_${Date.now()}@cerrahclinic.com`;
  const now = formatUtcString(new Date());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CERRAH Clinic//Appointment Booking//AR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatUtcString(start)}`,
    `DTEND:${formatUtcString(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `موعد_عيادة_سيرا_${startDate}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
