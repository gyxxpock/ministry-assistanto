import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import {
  AuxiliaryGoalConfig,
  Goal,
  GoalConfig,
  RegularGoalConfig,
} from '../domain/models';
import { IGoalRepository } from '../domain/i-goal.repository';
import { GOAL_REPOSITORY_TOKEN } from '../goals.tokens';
import { GoalsFacade } from './goals.facade';

function makeRegularConfig(serviceYear = 2027): RegularGoalConfig {
  return { type: 'regular', serviceYear };
}

function makeAuxConfig(serviceYear = 2027, monthlyTarget: 15 | 30 = 30): AuxiliaryGoalConfig {
  return { type: 'auxiliary', serviceYear, monthlyTarget, permanent: true };
}

function makeGoal(config: GoalConfig = makeRegularConfig()): Goal {
  return { id: 'test-goal', config, active: true };
}

describe('GoalsFacade', () => {
  let facade: GoalsFacade;
  let mockRepo: jasmine.SpyObj<IGoalRepository>;

  beforeEach(() => {
    mockRepo = jasmine.createSpyObj<IGoalRepository>('IGoalRepository', [
      'getActive',
      'setActive',
      'clearActive',
    ]);
    mockRepo.getActive.and.returnValue(Promise.resolve(null));
    mockRepo.setActive.and.returnValue(Promise.resolve());
    mockRepo.clearActive.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        GoalsFacade,
        { provide: GOAL_REPOSITORY_TOKEN, useValue: mockRepo },
      ],
    });

    // Constructor does NOT call loadGoal() — safe to inject outside fakeAsync.
    // If loadGoal() is ever added to the constructor, move injection inside fakeAsync per
    // feedback-fakeAsync-constructor-inject memory.
    facade = TestBed.inject(GoalsFacade);
  });

  describe('initial state', () => {
    it('activeGoal is null before any load', () => {
      expect(facade.activeGoal()).toBeNull();
    });

    it('accumulatedHours starts at 0', () => {
      expect(facade.accumulatedHours()).toBe(0);
    });

    it('goalProgress is null when no active goal', () => {
      expect(facade.goalProgress()).toBeNull();
    });
  });

  describe('loadGoal()', () => {
    it('sets activeGoal when repository returns a RegularGoalConfig', fakeAsync(() => {
      const config = makeRegularConfig();
      mockRepo.getActive.and.returnValue(Promise.resolve(config));

      facade.loadGoal();
      flushMicrotasks();

      const goal = facade.activeGoal();
      expect(goal).not.toBeNull();
      expect(goal!.config).toEqual(config);
      expect(goal!.active).toBeTrue();
    }));

    it('sets activeGoal when repository returns an AuxiliaryGoalConfig', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeAuxConfig()));

      facade.loadGoal();
      flushMicrotasks();

      expect(facade.activeGoal()!.config.type).toBe('auxiliary');
    }));

    it('sets activeGoal to null when repository is empty', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(null));

      facade.loadGoal();
      flushMicrotasks();

      expect(facade.activeGoal()).toBeNull();
    }));

    it('replaces a previously loaded goal on second call', fakeAsync(() => {
      mockRepo.getActive.and.returnValues(
        Promise.resolve(makeRegularConfig()),
        Promise.resolve(makeAuxConfig()),
      );

      facade.loadGoal();
      flushMicrotasks();
      expect(facade.activeGoal()!.config.type).toBe('regular');

      facade.loadGoal();
      flushMicrotasks();
      expect(facade.activeGoal()!.config.type).toBe('auxiliary');
    }));
  });

  describe('setGoal()', () => {
    it('calls repo.setActive with the goal config', fakeAsync(() => {
      const goal = makeGoal();

      facade.setGoal(goal);
      flushMicrotasks();

      expect(mockRepo.setActive).toHaveBeenCalledWith(goal.config);
      expect(mockRepo.setActive).toHaveBeenCalledTimes(1);
    }));

    it('updates activeGoal signal to the provided goal', fakeAsync(() => {
      const goal = makeGoal();

      facade.setGoal(goal);
      flushMicrotasks();

      expect(facade.activeGoal()).toEqual(goal);
    }));
  });

  describe('clearGoal()', () => {
    it('calls repo.clearActive', fakeAsync(() => {
      facade.clearGoal();
      flushMicrotasks();

      expect(mockRepo.clearActive).toHaveBeenCalledTimes(1);
    }));

    it('sets activeGoal to null', fakeAsync(() => {
      facade.setGoal(makeGoal());
      flushMicrotasks();

      facade.clearGoal();
      flushMicrotasks();

      expect(facade.activeGoal()).toBeNull();
    }));

    it('goalProgress becomes null after clear', fakeAsync(() => {
      facade.setGoal(makeGoal());
      flushMicrotasks();
      facade.setAccumulatedHours(100);
      expect(facade.goalProgress()).not.toBeNull();

      facade.clearGoal();
      flushMicrotasks();

      expect(facade.goalProgress()).toBeNull();
    }));
  });

  describe('setAccumulatedHours()', () => {
    it('updates accumulatedHours signal synchronously', () => {
      facade.setAccumulatedHours(150);
      expect(facade.accumulatedHours()).toBe(150);
    });

    it('overwriting with 0 resets the signal', () => {
      facade.setAccumulatedHours(200);
      facade.setAccumulatedHours(0);
      expect(facade.accumulatedHours()).toBe(0);
    });
  });

  describe('goalProgress computed', () => {
    it('remains null when activeGoal is null regardless of accumulatedHours', () => {
      facade.setAccumulatedHours(300);
      expect(facade.goalProgress()).toBeNull();
    });

    it('recomputes when accumulatedHours changes', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));
      facade.loadGoal();
      flushMicrotasks();

      facade.setAccumulatedHours(100);
      expect(facade.goalProgress()!.accumulatedHours).toBe(100);

      facade.setAccumulatedHours(300);
      expect(facade.goalProgress()!.accumulatedHours).toBe(300);
    }));

    it('computes targetHours=600 for a regular goal', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeRegularConfig()));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.goalProgress()!.targetHours).toBe(600);
    }));

    it('computes targetHours=360 for permanent auxiliary monthlyTarget=30', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeAuxConfig(2027, 30)));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.goalProgress()!.targetHours).toBe(360);
    }));

    it('computes targetHours=180 for permanent auxiliary monthlyTarget=15', fakeAsync(() => {
      mockRepo.getActive.and.returnValue(Promise.resolve(makeAuxConfig(2027, 15)));
      facade.loadGoal();
      flushMicrotasks();

      expect(facade.goalProgress()!.targetHours).toBe(180);
    }));

    it('updates goalProgress when activeGoal changes via setGoal', fakeAsync(() => {
      facade.setGoal(makeGoal(makeRegularConfig()));
      flushMicrotasks();
      expect(facade.goalProgress()!.targetHours).toBe(600);

      facade.setGoal(makeGoal(makeAuxConfig(2027, 30)));
      flushMicrotasks();
      expect(facade.goalProgress()!.targetHours).toBe(360);
    }));
  });
});
