import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UpdateBannerComponent } from './update-banner.component';
import { ChangeEntry } from '../../../../core/services/update-notification.service';

function makeEntry(type: ChangeEntry['type'], text = 'item'): ChangeEntry {
  return { type, text };
}

describe('UpdateBannerComponent', () => {
  let component: UpdateBannerComponent;
  let fixture: ComponentFixture<UpdateBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateBannerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  describe('features getter', () => {
    it('returns only entries of type feature', () => {
      component.changes = [makeEntry('feature', 'A'), makeEntry('fix'), makeEntry('ux')];
      expect(component.features).toEqual([{ type: 'feature', text: 'A' }]);
    });

    it('returns empty array when there are no feature entries', () => {
      component.changes = [makeEntry('fix'), makeEntry('ux')];
      expect(component.features).toEqual([]);
    });

    it('returns multiple feature entries', () => {
      component.changes = [makeEntry('feature', 'A'), makeEntry('feature', 'B')];
      expect(component.features.length).toBe(2);
    });
  });

  describe('fixes getter', () => {
    it('returns only entries of type fix', () => {
      component.changes = [makeEntry('feature'), makeEntry('fix', 'B'), makeEntry('ux')];
      expect(component.fixes).toEqual([{ type: 'fix', text: 'B' }]);
    });

    it('returns empty array when there are no fix entries', () => {
      component.changes = [makeEntry('feature'), makeEntry('ux')];
      expect(component.fixes).toEqual([]);
    });
  });

  describe('hasUX getter', () => {
    it('returns true when at least one ux entry exists', () => {
      component.changes = [makeEntry('feature'), makeEntry('ux')];
      expect(component.hasUX).toBe(true);
    });

    it('returns false when no ux entries exist', () => {
      component.changes = [makeEntry('feature'), makeEntry('fix')];
      expect(component.hasUX).toBe(false);
    });

    it('returns false for empty changes array', () => {
      component.changes = [];
      expect(component.hasUX).toBe(false);
    });

    it('returns true with only ux entries', () => {
      component.changes = [makeEntry('ux'), makeEntry('ux', 'b')];
      expect(component.hasUX).toBe(true);
    });
  });

  describe('with mixed changes array', () => {
    beforeEach(() => {
      component.changes = [
        makeEntry('feature', 'Nueva funcionalidad'),
        makeEntry('fix', 'Bug corregido'),
        makeEntry('ux', 'Mejora visual'),
        makeEntry('feature', 'Otra función'),
      ];
    });

    it('separates features from fixes', () => {
      expect(component.features.length).toBe(2);
      expect(component.fixes.length).toBe(1);
    });

    it('detects ux entries', () => {
      expect(component.hasUX).toBe(true);
    });
  });

  describe('outputs', () => {
    it('emits applyUpdate on EventEmitter.emit()', () => {
      let emitted = false;
      component.applyUpdate.subscribe(() => (emitted = true));
      component.applyUpdate.emit();
      expect(emitted).toBe(true);
    });

    it('emits dismiss on EventEmitter.emit()', () => {
      let emitted = false;
      component.dismiss.subscribe(() => (emitted = true));
      component.dismiss.emit();
      expect(emitted).toBe(true);
    });
  });
});
