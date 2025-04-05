import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  private fb = inject(FormBuilder);
  contactForm: FormGroup;
  formSubmitted = false;
  showSuccessMessage = false;
  
  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  
  // Getter methods for form controls - easy access in the template
  get nameControl() { return this.contactForm.get('name'); }
  get emailControl() { return this.contactForm.get('email'); }
  get messageControl() { return this.contactForm.get('message'); }
  
  onSubmit() {
    this.formSubmitted = true;
    
    if (this.contactForm.valid) {
      console.log('Form Submitted:', this.contactForm.value);
      
      this.showSuccessMessage = true;
      this.formSubmitted = false;
      this.contactForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    }
  }
}