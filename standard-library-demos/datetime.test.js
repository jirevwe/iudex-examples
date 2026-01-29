import { describe, test, expect } from 'iudex';

describe('Standard Library - DateTime', { prefix: 'stdlib.datetime' }, () => {
  test('should get current time', async ({ std }) => {
    const now = std.datetime.now();
    expect(now).toBeGreaterThan(0);

    const nowISO = std.datetime.nowISO();
    expect(nowISO).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);

    const today = std.datetime.today();
    expect(today).toBeInstanceOf(Date);
  }, { id: 'current_time' });

  test('should format dates', async ({ std }) => {
    const date = new Date('2024-01-15T10:30:00Z');

    expect(std.datetime.format(date, 'YYYY-MM-DD')).toBe('2024-01-15');
    expect(std.datetime.format(date, 'DD/MM/YYYY')).toBe('15/01/2024');
    expect(std.datetime.format(date, 'MMMM D, YYYY')).toContain('January 15, 2024');
  }, { id: 'date_formatting' });

  test('should convert dates', async ({ std }) => {
    const date = new Date('2024-01-15T10:30:00Z');

    const iso = std.datetime.toISO(date);
    expect(iso).toMatch(/2024-01-15T10:30:00/);

    const unix = std.datetime.toUnix(date);
    expect(unix).toBeGreaterThan(0);

    const fromUnix = std.datetime.fromUnix(unix);
    expect(fromUnix).toBeInstanceOf(Date);
  }, { id: 'date_conversion' });

  test('should perform date arithmetic', async ({ std }) => {
    const date = new Date('2024-01-15');

    const tomorrow = std.datetime.add(date, 1, 'day');
    expect(tomorrow.getDate()).toBe(16);

    const nextWeek = std.datetime.add(date, 7, 'days');
    expect(nextWeek.getDate()).toBe(22);

    const yesterday = std.datetime.subtract(date, 1, 'day');
    expect(yesterday.getDate()).toBe(14);

    const lastMonth = std.datetime.subtract(date, 1, 'month');
    expect(lastMonth.getMonth()).toBe(11); // December (0-indexed)
  }, { id: 'date_arithmetic' });

  test('should calculate date differences', async ({ std }) => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-15');

    const daysDiff = std.datetime.diff(date2, date1, 'days');
    expect(daysDiff).toBe(14);

    const weeksDiff = std.datetime.diff(date2, date1, 'weeks');
    expect(weeksDiff).toBe(2);
  }, { id: 'date_difference' });

  test('should compare dates', async ({ std }) => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-15');

    expect(std.datetime.isBefore(date1, date2)).toBe(true);
    expect(std.datetime.isAfter(date2, date1)).toBe(true);
    expect(std.datetime.isSame(date1, date1)).toBe(true);
  }, { id: 'date_comparison' });

  test('should check if date is between', async ({ std }) => {
    const start = new Date('2024-01-01');
    const end = new Date('2024-01-31');
    const middle = new Date('2024-01-15');
    const outside = new Date('2024-02-15');

    expect(std.datetime.isBetween(middle, start, end)).toBe(true);
    expect(std.datetime.isBetween(outside, start, end)).toBe(false);
  }, { id: 'date_between' });

  test('should get start and end of time units', async ({ std }) => {
    const date = new Date('2024-01-15T14:30:45');

    const startOfDay = std.datetime.startOf(date, 'day');
    expect(startOfDay.getHours()).toBe(0);
    expect(startOfDay.getMinutes()).toBe(0);

    const endOfDay = std.datetime.endOf(date, 'day');
    expect(endOfDay.getHours()).toBe(23);
    expect(endOfDay.getMinutes()).toBe(59);
  }, { id: 'start_end_of_units' });

  test('should validate dates', async ({ std }) => {
    expect(std.datetime.isValid('2024-01-15')).toBe(true);
    expect(std.datetime.isValid('invalid')).toBe(false);
    expect(std.datetime.isValid(new Date())).toBe(true);
  }, { id: 'date_validation' });

  test('should extract date components', async ({ std }) => {
    const date = new Date('2024-01-15');

    expect(std.datetime.year(date)).toBe(2024);
    expect(std.datetime.month(date)).toBe(0); // January (0-indexed)
    expect(std.datetime.dayOfMonth(date)).toBe(15);
  }, { id: 'date_components' });

  test('should use timestamp in API request', async ({ std, request }) => {
    const timestamp = std.datetime.nowISO();

    const response = await request.post('https://httpbin.org/post', {
      timestamp: timestamp,
      message: 'Test message'
    });

    expect(response).toHaveStatus(200);
    expect(response.body.json.timestamp).toBe(timestamp);
  }, { id: 'timestamp_in_api' });

  test('should filter data by date range', async ({ std, request }) => {
    const startDate = std.datetime.format(
      std.datetime.subtract(new Date(), 7, 'days'),
      'YYYY-MM-DD'
    );
    const endDate = std.datetime.format(new Date(), 'YYYY-MM-DD');

    const response = await request.get('https://httpbin.org/get', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });

    expect(response).toHaveStatus(200);
    expect(response.body.args.start_date).toBe(startDate);
    expect(response.body.args.end_date).toBe(endDate);
  }, { id: 'date_range_filter' });
});
