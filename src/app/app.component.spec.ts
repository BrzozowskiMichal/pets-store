import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { provideHttpClient } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('AppComponent (Standalone)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent, MatSlideToggleModule, MatIconModule],
      providers: [provideHttpClient(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with dark mode off', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    component.ngOnInit();
    expect(component.isDarkMode).toBeFalsy();
  });

  it('should initialize with dark mode enabled if stored in localStorage', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('enabled');
    component.ngOnInit();
    expect(component.isDarkMode).toBeTruthy();
  });

  it('should enable dark mode and store in localStorage', () => {
    const rendererSpy = jest.spyOn(component['renderer'], 'addClass');

    component.toggleDarkMode();

    expect(component.isDarkMode).toBeTruthy();
    expect(rendererSpy).toHaveBeenCalledWith(document.body, 'dark-mode');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'dark-mode',
      'enabled'
    );
  });

  it('should disable dark mode and remove from localStorage', () => {
    const rendererSpy = jest.spyOn(component['renderer'], 'removeClass');

    component.isDarkMode = true;
    component.toggleDarkMode();

    expect(component.isDarkMode).toBeFalsy();
    expect(rendererSpy).toHaveBeenCalledWith(document.body, 'dark-mode');
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'dark-mode',
      'disabled'
    );
  });

  it('should add "dark-mode" class on enableDarkMode()', () => {
    const rendererSpy = jest.spyOn(component['renderer'], 'addClass');
    component.isDarkMode = true;
    (component as any).enableDarkMode();
    expect(rendererSpy).toHaveBeenCalledWith(document.body, 'dark-mode');
  });
});
