import { TestBed } from '@angular/core/testing';
import { TimeEntryModule } from './time-entry.module';

describe('TimeEntryModule', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({ imports: [TimeEntryModule] });
    expect(TestBed.inject(TimeEntryModule)).toBeTruthy();
  });
});
