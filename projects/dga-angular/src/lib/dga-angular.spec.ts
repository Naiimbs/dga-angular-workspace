import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DgaAngular } from './dga-angular';

describe('DgaAngular', () => {
  let component: DgaAngular;
  let fixture: ComponentFixture<DgaAngular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgaAngular],
    }).compileComponents();

    fixture = TestBed.createComponent(DgaAngular);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
