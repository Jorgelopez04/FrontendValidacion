import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ProductDetailDialog } from './product-detail-dialog';
import { Product } from '../../../../../core/models/product.model';

describe('ProductDetailDialog', () => {
  let component: ProductDetailDialog;
  let fixture: ComponentFixture<ProductDetailDialog>;

  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ProductDetailDialog>>;

  beforeEach(async () => {

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailDialog],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id_product: 1,
            name: 'Producto test'
          } as Product
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailDialog);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive injected product data', () => {
    expect(component.product).toBeTruthy();
    expect(component.product.name).toBe('Producto test');
  });

  it('should close dialog', () => {
    component.onClose();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

});