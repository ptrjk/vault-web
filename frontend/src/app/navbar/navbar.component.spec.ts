import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../services/theme.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    mockThemeService = jasmine.createSpyObj('ThemeService', [
      'getCurrentTheme',
      'toggleTheme',
      'setTheme',
    ]);

    mockThemeService.getCurrentTheme.and.returnValue('light');

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with mobile menu closed', () => {
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should toggle mobile menu state', () => {
    expect(component.isMobileMenuOpen).toBe(false);

    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(true);

    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should close mobile menu', () => {
    component.isMobileMenuOpen = true;
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should call themeService.toggleTheme when toggleTheme is called', () => {
    component.toggleTheme();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should return true when theme is dark', () => {
    mockThemeService.getCurrentTheme.and.returnValue('dark');
    expect(component.isDarkTheme).toBe(true);
  });

  it('should return false when theme is light', () => {
    mockThemeService.getCurrentTheme.and.returnValue('light');
    expect(component.isDarkTheme).toBe(false);
  });

  it('should have themeService injected', () => {
    expect(component.themeService).toBe(mockThemeService);
  });

  it('should call getCurrentTheme when accessing isDarkTheme getter', () => {
    const isDark = component.isDarkTheme;
    expect(mockThemeService.getCurrentTheme).toHaveBeenCalled();
  });

  it('should keep mobile menu state independent of theme changes', () => {
    component.isMobileMenuOpen = true;
    component.toggleTheme();
    expect(component.isMobileMenuOpen).toBe(true);
  });
});
