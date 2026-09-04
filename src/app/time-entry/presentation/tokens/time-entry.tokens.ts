import { InjectionToken } from '@angular/core';
import { ITimeEntryRepository } from '../../domain/i-time-entry.repository';

export const TIME_ENTRY_REPOSITORY =
  new InjectionToken<ITimeEntryRepository>('TIME_ENTRY_REPOSITORY');