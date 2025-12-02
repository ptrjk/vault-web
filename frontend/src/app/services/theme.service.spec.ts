import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        localStorageMock[key] = value;
      },
    );

    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStorageMock[key];
    });

    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageMock = {};
    });

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should initialize with saved theme from localStorage', () => {
    localStorageMock['vault-web-theme'] = 'dark';
    const newService = new ThemeService();
    expect(newService.getCurrentTheme()).toBe('dark');
  });

  it('should toggle theme from light to dark', () => {
    service.setTheme('light');
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    service.setTheme('dark');
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light');
  });

  it('should save theme to localStorage when setTheme is called', () => {
    service.setTheme('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'vault-web-theme',
      'dark',
    );
    expect(localStorageMock['vault-web-theme']).toBe('dark');
  });

  it('should apply dark theme class to document element', () => {
    const htmlElement = document.documentElement;
    service.setTheme('dark');

    expect(htmlElement.classList.contains('dark-theme')).toBe(true);
    expect(htmlElement.classList.contains('light-theme')).toBe(false);
  });

  it('should apply light theme class to document element', () => {
    const htmlElement = document.documentElement;
    service.setTheme('light');

    expect(htmlElement.classList.contains('light-theme')).toBe(true);
    expect(htmlElement.classList.contains('dark-theme')).toBe(false);
  });

  it('should emit theme changes through observable', (done) => {
    service.currentTheme$.subscribe((theme: Theme) => {
      if (theme === 'dark') {
        expect(theme).toBe('dark');
        done();
      }
    });

    service.setTheme('dark');
  });

  it('should handle localStorage errors gracefully when saving', () => {
    spyOn(console, 'error');
    (localStorage.setItem as jasmine.Spy).and.throwError('Storage full');

    expect(() => service.setTheme('dark')).not.toThrow();
    expect(console.error).toHaveBeenCalled();
  });

  it('should return light theme when localStorage fails to retrieve', () => {
    (localStorage.getItem as jasmine.Spy).and.throwError('Storage error');

    const newService = new ThemeService();
    expect(newService.getCurrentTheme()).toBe('light');
  });

  it('should return light theme when invalid value is stored', () => {
    localStorageMock['vault-web-theme'] = 'invalid-theme';
    const newService = new ThemeService();
    expect(newService.getCurrentTheme()).toBe('light');
  });
});
