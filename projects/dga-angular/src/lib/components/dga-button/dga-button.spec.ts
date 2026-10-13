import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DgaButtonComponent } from './dga-button';

describe('DgaButton', () => {
  let component: DgaButtonComponent;
  let fixture: ComponentFixture<DgaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgaButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DgaButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disables the native button while loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });
});
