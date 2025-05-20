import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
})
export class AddEditProductComponent implements OnInit {
mgfDate: any;
expiryDate: any;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  productId: string | null = null;
  name: string = '';
  sku: string = '';
  price: string = '';
  stockQuantity: string = '';
  categoryId: string = '';
  description: string = '';
  isEditing: boolean = false;
  categories: Category[] = [];
  message: string = '';
  loading: boolean = false;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.fetchCategories();
    if (this.productId) {
      this.isEditing = true;
      this.fetchProductById(this.productId);
    }
  }

  // Fetch all categories
  fetchCategories(): void {
    this.apiService.getAllCategory().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.categories = res.categories;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to get categories'
        );
      },
    });
  }

  // Fetch product details by productId
  fetchProductById(productId: string): void {
    this.apiService.getProductById(productId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          const product = res.product;
          this.name = product.name;
          this.sku = product.sku;
          this.price = product.price;
          this.stockQuantity = product.stockQuantity;
          this.categoryId = product.categoryId;
          this.description = product.description;
          this.mgfDate = product.mgfDate;  
          this.expiryDate = product.expiryDate; 
        } else {
          this.showMessage(res.message);
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to fetch product'
        );
      },
    });
  }

  // Handle form submission
  handleSubmit(event: Event): void {
    event.preventDefault();
    this.loading = true;
    const productData = {
      name: this.name,
      sku: this.sku,
      price: this.price,
      stockQuantity: this.stockQuantity,
      categoryId: this.categoryId,
      description: this.description,
      mgfDate: this.mgfDate,
  expiryDate: this.expiryDate,
      productId: this.productId || undefined, // Include productId if editing
    };

    if (this.isEditing) {
      // Update product
      this.apiService.updateProduct(productData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Product updated successfully');
            this.router.navigate(['/product']);
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message || error?.message || 'Unable to update product'
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
    } else {
      // Add new product
      this.apiService.addProduct(productData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Product saved successfully');
            this.router.navigate(['/product']);
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message || error?.message || 'Unable to save product'
          );
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  // Show success/error message
  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
