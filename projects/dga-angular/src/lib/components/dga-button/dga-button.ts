import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DgaIcon } from '../../icons/dga-icon';
import type { DgaIconName } from '../../icons/dga-icon';

export type DgaButtonVariant =
  | 'primary'
  | 'secondary'
  | 'black'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'
  | 'destructive-outline'
  | 'destructive-subtle'
  | 'destructive-ghost';

export type DgaButtonSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'icon'
  | 'icon-md'
  | 'icon-sm'
  | 'icon-xs';

@Component({
  selector: 'dga-button',
  standalone: true,
  imports: [DgaIcon],
  templateUrl: './dga-button.html',
  styleUrl: './dga-button.scss',
})
export class DgaButtonComponent {
  @Input() variant: DgaButtonVariant = 'primary';
  @Input() size: DgaButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() onColor = false;
  @Input() startIcon: DgaIconName | '' = '';
  @Input() endIcon: DgaIconName | '' = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
