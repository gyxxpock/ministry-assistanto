import { TestBed } from '@angular/core/testing';
import { FileUtilService } from './file-util.service';

describe('FileUtilService', () => {
  let service: FileUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FileUtilService] });
    service = TestBed.inject(FileUtilService);
  });

  describe('downloadFile()', () => {
    let createObjectURLSpy: jasmine.Spy;
    let revokeObjectURLSpy: jasmine.Spy;
    let appendChildSpy: jasmine.Spy;
    let removeChildSpy: jasmine.Spy;
    let linkEl: HTMLAnchorElement;
    let clickSpy: jasmine.Spy;

    beforeEach(() => {
      linkEl = document.createElement('a');
      clickSpy = spyOn(linkEl, 'click');
      spyOn(document, 'createElement').and.returnValue(linkEl as any);
      appendChildSpy = spyOn(document.body, 'appendChild').and.stub();
      removeChildSpy = spyOn(document.body, 'removeChild').and.stub();
      createObjectURLSpy = spyOn(window.URL, 'createObjectURL').and.returnValue('blob:mock-url');
      revokeObjectURLSpy = spyOn(window.URL, 'revokeObjectURL');
    });

    it('creates an object URL from the content', () => {
      service.downloadFile('{"data":1}', 'export.json', 'application/json');
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('sets href and download attributes on the link', () => {
      service.downloadFile('content', 'file.json', 'application/json');
      expect(linkEl.href).toContain('mock-url');
      expect(linkEl.download).toBe('file.json');
    });

    it('appends the link to the body and clicks it', () => {
      service.downloadFile('content', 'file.json', 'application/json');
      expect(appendChildSpy).toHaveBeenCalledWith(linkEl);
      expect(clickSpy).toHaveBeenCalled();
    });

    it('removes the link from the body after clicking', () => {
      service.downloadFile('content', 'file.json', 'application/json');
      expect(removeChildSpy).toHaveBeenCalledWith(linkEl);
    });

    it('revokes the object URL after download', () => {
      service.downloadFile('content', 'file.json', 'application/json');
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    it('handles errors without throwing', () => {
      createObjectURLSpy.and.throwError('URL creation failed');
      expect(() =>
        service.downloadFile('content', 'file.json', 'application/json')
      ).not.toThrow();
    });
  });

  describe('readFile()', () => {
    it('resolves with the text content of the file', async () => {
      const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
      const result = await service.readFile(file);
      expect(result).toBe('hello world');
    });

    it('resolves with JSON content', async () => {
      const json = '{"key":"value"}';
      const file = new File([json], 'data.json', { type: 'application/json' });
      const result = await service.readFile(file);
      expect(result).toBe(json);
    });

    it('rejects when FileReader encounters an error', async () => {
      const file = new File([''], 'test.txt');
      const mockReader: any = {
        result: null,
        onload: null,
        onerror: null,
        readAsText: jasmine.createSpy('readAsText').and.callFake(function (this: any) {
          Promise.resolve().then(() => this.onerror('read error'));
        }),
      };
      spyOn(window as any, 'FileReader').and.returnValue(mockReader);
      await expectAsync(service.readFile(file)).toBeRejected();
    });
  });
});
