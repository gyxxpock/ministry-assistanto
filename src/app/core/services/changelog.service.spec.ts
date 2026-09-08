import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChangelogService } from './changelog.service';

describe('ChangelogService', () => {
  let service: ChangelogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChangelogService],
    });
    service = TestBed.inject(ChangelogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('entries starts as empty array before fetch resolves', () => {
    expect(service.entries()).toEqual([]);
    httpMock.expectOne('/assets/changelog.json').flush([]);
  });

  it('populates entries on successful fetch', () => {
    httpMock.expectOne('/assets/changelog.json').flush([
      { version: '2026-09-08', changes: [{ type: 'feature', text: 'Nueva función' }] },
      { version: '2026-09-07', changes: [{ type: 'fix', text: 'Bug corregido' }] },
    ]);
    expect(service.entries().length).toBe(2);
    expect(service.entries()[0].version).toBe('2026-09-08');
  });

  it('exposes entries as readonly signal', () => {
    httpMock.expectOne('/assets/changelog.json').flush([]);
    expect(typeof service.entries).toBe('function');
  });

  it('leaves entries empty on fetch error', () => {
    httpMock.expectOne('/assets/changelog.json').error(new ErrorEvent('network error'));
    expect(service.entries()).toEqual([]);
  });

  it('leaves entries empty when server returns null', () => {
    httpMock.expectOne('/assets/changelog.json').flush(null);
    expect(service.entries()).toEqual([]);
  });
});
