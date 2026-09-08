import { REGULAR_GOAL_TARGET, REGULAR_GOAL_MARGIN } from './models';

describe('Models', () => {
  it('should define REGULAR_GOAL_TARGET', () => {
    expect(REGULAR_GOAL_TARGET).toBe(600);
  });

  it('should define REGULAR_GOAL_MARGIN', () => {
    expect(REGULAR_GOAL_MARGIN).toBe(560);
  });
});
