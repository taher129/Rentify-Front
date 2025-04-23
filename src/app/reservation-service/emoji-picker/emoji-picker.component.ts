import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.css']
})
export class EmojiPickerComponent implements AfterViewInit, OnDestroy {
  @Output() emojiSelect = new EventEmitter<string>();
  @ViewChild('pickerContainer') pickerContainer!: ElementRef;

  private picker: any;

  constructor() {}

  ngAfterViewInit() {
    this.initPicker();
  }

  async initPicker() {
    try {
      // Dynamically import the Picmo libraries
      const { createPicker } = await import('picmo');

      // We will omit the categories option to use the default categories
      // This avoids the type errors since we'll let Picmo handle it internally
      this.picker = createPicker({
        animate: false,
        autoFocusSearch: false,
        className: "",
        rootElement: this.pickerContainer.nativeElement,
        showPreview: false,
        showRecents: true,
        emojiSize: '1.5rem',
        theme: 'light',
        showCategoryTabs: true,
        showSearch: true
        // Removed the categories option to avoid type errors
      });

      this.picker.addEventListener('emoji:select', (event: any) => {
        this.emojiSelect.emit(event.emoji);
      });
    } catch (error) {
      console.error('Failed to initialize emoji picker:', error);
    }
  }

  ngOnDestroy() {
    if (this.picker) {
      this.picker.destroy();
    }
  }
}
