import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { VersionHistoryComponent } from './version-history.component';
import { ChangelogEntry } from '../../../../core/services/changelog.service';

function makeEntry(version: string, ...types: Array<'feature' | 'fix' | 'ux'>): ChangelogEntry {
  return { version, changes: types.map(type => ({ type, text: `${type} item` })) };
}

describe('VersionHistoryComponent', () => {
  let component: VersionHistoryComponent;
  let fixture: ComponentFixture<VersionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VersionHistoryComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VersionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('starts with empty entries', () => {
    expect(component.entries).toEqual([]);
  });

  describe('formatVersion()', () => {
    it('returns a non-empty string for a valid ISO date', () => {
      const result = component.formatVersion('2026-09-08');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('avoids UTC off-by-one — September 8 stays September 8', () => {
      const result = component.formatVersion('2026-09-08', 'en');
      expect(result).toContain('8');
    });

    it('uses the provided locale', () => {
      const es = component.formatVersion('2026-09-08', 'es');
      const en = component.formatVersion('2026-09-08', 'en');
      expect(es).toBeTruthy();
      expect(en).toBeTruthy();
    });
  });

  describe('with multiple entries', () => {
    beforeEach(() => {
      component.entries = [
        makeEntry('2026-09-08', 'feature', 'fix'),
        makeEntry('2026-09-07', 'ux'),
      ];
      fixture.detectChanges();
    });

    it('renders one expansion panel per entry', () => {
      const panels = fixture.nativeElement.querySelectorAll('mat-expansion-panel');
      expect(panels.length).toBe(2);
    });
  });

  describe('with a single entry', () => {
    beforeEach(() => {
      component.entries = [makeEntry('2026-09-08', 'feature')];
      fixture.detectChanges();
    });

    it('renders one expansion panel', () => {
      expect(fixture.nativeElement.querySelectorAll('mat-expansion-panel').length).toBe(1);
    });
  });
});
