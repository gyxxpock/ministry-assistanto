import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OptionPillGroupComponent, PillOption } from './option-pill-group.component';

const TEST_OPTIONS: PillOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B', icon: 'star' },
];

describe('OptionPillGroupComponent', () => {
  let component: OptionPillGroupComponent;
  let fixture: ComponentFixture<OptionPillGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // OptionPillGroupComponent es standalone (Angular 20+): se coloca en
      // imports, no en declarations. TranslateModule.forRoot() provee un
      // TranslateService real (sin loader) para el pipe `translate` que usa
      // internamente el template del componente.
      imports: [TranslateModule.forRoot(), OptionPillGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionPillGroupComponent);
    component = fixture.componentInstance;
    component.options = TEST_OPTIONS;
    component.value = 'a';
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('accepts options input', () => {
    expect(component.options).toBe(TEST_OPTIONS);
  });

  it('accepts value input', () => {
    component.value = 'b';
    expect(component.value).toBe('b');
  });

  it('select() emits the selected value via valueChange', () => {
    let emittedValue: string | undefined;
    component.valueChange.subscribe((v: string) => (emittedValue = v));
    component.select('b');
    expect(emittedValue).toBe('b');
  });

  it('select() emits any string value', () => {
    const emitted: string[] = [];
    component.valueChange.subscribe((v: string) => emitted.push(v));
    component.select('a');
    component.select('b');
    expect(emitted).toEqual(['a', 'b']);
  });
});
