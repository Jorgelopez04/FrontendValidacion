import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { OrdersService } from '../../../../services/orders.service';
import { OrderWithProducts, ProductDetail } from '../../../../core/models/order.model';
import { ResponseDto } from '../../../../core/models/response.dto';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true, // 🔥 IMPORTANTE
  templateUrl: './order-details-dialog.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatButtonModule
  ]
})
export class OrderDetailsDialog implements OnInit {

  order!: OrderWithProducts;
  products: ProductDetail[] = [];
  isLoadingProducts = true;

  constructor(
    private ordersService: OrdersService,
    private dialogRef: MatDialogRef<OrderDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number }
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.ordersService.getById(this.data.orderId).subscribe({
      next: (response: ResponseDto<OrderWithProducts>) => {
        this.order = response.data;
        this.products = this.order.products || [];
        this.isLoadingProducts = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoadingProducts = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}