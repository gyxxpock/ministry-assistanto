import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { UpdateNotificationService } from './update-notification.service';

function makeVersionReady(): VersionReadyEvent {
  return {
    type: 'VERSION_READY',
    currentVersion: { hash: 'old' },
    latestVersion: { hash: 'new' },
  };
}

describe('UpdateNotificationService', () => {
  let service: UpdateNotificationService;
  let httpMock: HttpTestingController;
  let versionUpdates$: Subject<any>;
  let mockSwUpdate: { isEnabled: boolean; versionUpdates: any; activateUpdate: jasmine.Spy };

  beforeEach(() => {
    versionUpdates$ = new Subject();
    mockSwUpdate = {
      isEnabled: true,
      versionUpdates: versionUpdates$.asObservable(),
      activateUpdate: jasmine.createSpy('activateUpdate').and.returnValue(new Promise(() => {})),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UpdateNotificationService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    service = TestBed.inject(UpdateNotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('isUpdateAvailable starts as false', () => {
    expect(service.isUpdateAvailable()).toBe(false);
  });

  it('changes starts as empty array', () => {
    expect(service.changes()).toEqual([]);
  });

  describe('when VERSION_READY event fires', () => {
    beforeEach(() => {
      versionUpdates$.next(makeVersionReady());
    });

    it('sets isUpdateAvailable to true after fetching changelog', () => {
      httpMock.expectOne(r => r.url.includes('/assets/changelog.json')).flush([]);
      expect(service.isUpdateAvailable()).toBe(true);
    });

    it('populates changes from the latest changelog entry', () => {
      httpMock.expectOne(r => r.url.includes('/assets/changelog.json')).flush([
        { version: '2026-09-07', changes: [{ type: 'feature', text: 'Nueva función' }] },
      ]);
      expect(service.changes()).toEqual([{ type: 'feature', text: 'Nueva función' }]);
    });

    it('uses the first entry in the changelog array (newest)', () => {
      httpMock.expectOne(r => r.url.includes('/assets/changelog.json')).flush([
        { version: '2026-09-07', changes: [{ type: 'fix', text: 'Fix reciente' }] },
        { version: '2026-08-01', changes: [{ type: 'feature', text: 'Feature antigua' }] },
      ]);
      expect(service.changes()[0].text).toBe('Fix reciente');
    });
  });

  describe('dismiss()', () => {
    it('hides the banner even after update is available', () => {
      versionUpdates$.next(makeVersionReady());
      httpMock.expectOne(r => r.url.includes('/assets/changelog.json')).flush([]);

      service.dismiss();
      expect(service.isUpdateAvailable()).toBe(false);
    });
  });

  describe('applyUpdate()', () => {
    it('calls swUpdate.activateUpdate()', () => {
      service.applyUpdate();
      expect(mockSwUpdate.activateUpdate).toHaveBeenCalled();
    });
  });

});

describe('UpdateNotificationService when SwUpdate is disabled', () => {
  let service: UpdateNotificationService;
  let versionUpdates$: Subject<any>;

  beforeEach(() => {
    versionUpdates$ = new Subject();
    const mockSwUpdate = {
      isEnabled: false,
      versionUpdates: versionUpdates$.asObservable(),
      activateUpdate: jasmine.createSpy('activateUpdate').and.returnValue(new Promise(() => {})),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UpdateNotificationService,
        { provide: SwUpdate, useValue: mockSwUpdate },
      ],
    });

    service = TestBed.inject(UpdateNotificationService);
  });

  it('does not react to version events', () => {
    versionUpdates$.next(makeVersionReady());
    expect(service.isUpdateAvailable()).toBe(false);
  });
});
