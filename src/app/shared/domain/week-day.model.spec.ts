import { WeekDay } from './week-day.model';

describe('WeekDay', () => {
  it('should accept monday, sunday and saturday as valid values', () => {
    const values: WeekDay[] = ['monday', 'sunday', 'saturday'];

    expect(values).toEqual(['monday', 'sunday', 'saturday']);
  });
});
