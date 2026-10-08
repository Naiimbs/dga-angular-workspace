import { Component, EventEmitter, Input, Output } from '@angular/core';

export type DgaLibraryButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export type DgaLibraryButtonSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  imports: [],
  selector: 'lib-dga-button',
  styleUrl: './dga-button.css',
  templateUrl: './dga-button.html',
})
export class DgaButton {
  @Input() variant: DgaLibraryButtonVariant = 'primary';
  @Input() size: DgaLibraryButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() readonly clicked = new EventEmitter<MouseEvent>();
}
