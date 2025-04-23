import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponent } from '../emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiPickerComponent],
  templateUrl: './messageinput.component.html',
  styleUrls: ['./messageinput.component.css']
})
export class MessageInputComponent {
  @Output() sendMessage = new EventEmitter<any>();

  message: string = '';
  showEmojiPicker: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  onEmojiSelect(emoji: string) {
    this.message += emoji;
    this.showEmojiPicker = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

  removeSelectedFile() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSendMessage() {
    if (this.message.trim() || this.selectedFile) {
      const messageData = {
        text: this.message,
        file: this.selectedFile
      };

      this.sendMessage.emit(messageData);
      this.message = '';
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }
}
