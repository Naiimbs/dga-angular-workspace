import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DgaButtonComponent } from '../components/dga-button/dga-button';
import { DgaIcon } from '../icons/dga-icon';

export type DgaFileUploadState = 'idle' | 'loading' | 'uploaded' | 'error';

/**
 * File upload — a browse-and-attach control with the DGA file states: Loading, Uploaded (green check)
 * and Error (red "!" + helper text), RTL-aware. The picked file is validated against `accept` and
 * `maxSizeMb`; a valid pick shows the Loading chip, then Uploaded, and emits the File. The chip carries
 * a status icon, the (LTR-isolated) file name and an X to remove.
 *
 * The Loading → Uploaded transition is a short SIMULATED timer — this component owns the UI/validation
 * only, not the transport. Consumers listen to `fileSelected` and perform the real upload; drive the
 * visible state from the outside through `state` when you need it tied to a real request.
 */
@Component({
  selector: 'dga-file-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DgaButtonComponent, DgaIcon],
  template: `
    @if (state() === 'idle') {
      <div class="file-upload__drop">
        <span class="file-upload__label">{{ label() }}</span>
        @if (hint()) { <p class="file-upload__hint">{{ hint() }}</p> }
        <dga-button variant="black" size="sm" type="button" startIcon="upload" (clicked)="picker.click()">
          {{ browseLabel() }}
        </dga-button>
      </div>
    } @else {
      <div class="file-upload__file"
           [class.file-upload__file--loading]="state() === 'loading'"
           [class.file-upload__file--ok]="state() === 'uploaded'"
           [class.file-upload__file--error]="state() === 'error'">
        <span class="file-upload__icon" aria-hidden="true">
          @switch (state()) {
            @case ('loading') { <span class="file-upload__spinner"></span> }
            @case ('uploaded') { <span class="file-upload__badge file-upload__badge--ok"><dga-icon name="check" /></span> }
            @case ('error') { <span class="file-upload__badge file-upload__badge--error">!</span> }
          }
        </span>
        <span class="file-upload__name"><bdi dir="ltr">{{ fileName() }}</bdi></span>
        <button type="button" class="file-upload__remove" (click)="remove()" [attr.aria-label]="removeLabel()">
          <dga-icon name="close" />
        </button>
      </div>
      @if (state() === 'error' && errorText()) {
        <p class="file-upload__helper" role="alert">{{ errorText() }}</p>
      }
    }
    <input #picker type="file" [accept]="accept()" hidden (change)="pick(picker)" />
  `,
  styles: [`
    :host { display: block; }

    .file-upload__drop {
      border: 1px dashed var(--ddga-color-border, #d2d6db);
      border-radius: var(--ddga-radius-md, 12px);
      padding: var(--ddga-space-4, 16px);
    }
    .file-upload__label { display: block; font-weight: var(--ddga-font-weight-medium, 600); font-size: var(--ddga-font-size-sm, 14px); color: var(--ddga-text-primary); }
    .file-upload__hint { margin: var(--ddga-space-1, 4px) 0 var(--ddga-space-3, 12px); font-size: var(--ddga-font-size-xs, 13px); color: var(--ddga-text-secondary); }

    /* File chip — icon (start) · name · remove (end); mirrors in RTL via the logical grid. */
    .file-upload__file {
      display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
      gap: var(--ddga-space-3, 12px);
      padding: var(--ddga-space-3, 12px) var(--ddga-space-4, 16px);
      border-radius: var(--ddga-radius-sm, 8px);
      border: 1px solid var(--ddga-color-border, #e5e7eb);
      background: var(--ddga-color-muted, #f9fafb);
    }
    .file-upload__file--error { border-color: var(--ddga-color-destructive, #d92d20); }

    .file-upload__icon { display: inline-flex; align-items: center; }
    .file-upload__badge {
      display: inline-grid; place-items: center; inline-size: 22px; block-size: 22px;
      border-radius: 50%; color: #fff; font-size: 13px; font-weight: 700; line-height: 1;
    }
    .file-upload__badge dga-icon { font-size: 13px; }
    .file-upload__badge--ok { background: var(--ddga-color-success, #079455); }
    .file-upload__badge--error { background: var(--ddga-color-destructive, #d92d20); }

    .file-upload__name {
      min-inline-size: 0; font-size: var(--ddga-font-size-sm, 14px); color: var(--ddga-text-primary);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }

    .file-upload__remove {
      display: inline-grid; place-items: center; inline-size: 28px; block-size: 28px;
      border: none; background: transparent; cursor: pointer; border-radius: var(--ddga-radius-xs, 6px);
      color: var(--ddga-text-secondary); font-size: 18px;
    }
    .file-upload__remove:hover { background: var(--ddga-color-muted, #f3f4f6); color: var(--ddga-text-primary); }

    .file-upload__spinner {
      inline-size: 20px; block-size: 20px; border-radius: 50%;
      border: 2px solid var(--ddga-color-border, #e5e7eb);
      border-top-color: var(--ddga-color-primary, #1b8354);
      animation: dga-file-spin .7s linear infinite;
    }
    @keyframes dga-file-spin { to { transform: rotate(360deg); } }

    .file-upload__helper { margin: var(--ddga-space-2, 6px) 0 0; font-size: var(--ddga-font-size-xs, 13px); color: var(--ddga-color-destructive, #d92d20); }
  `],
})
export class DgaFileUpload {
  readonly label = input('Upload files');
  readonly hint = input('');
  readonly browseLabel = input('Browse files');
  readonly removeLabel = input('Remove');
  readonly maxSizeMb = input(2);
  readonly accept = input('.jpg,.jpeg,.png,.pdf');
  readonly formatError = input('Unsupported file format.');
  readonly sizeError = input('File exceeds the size limit.');

  /** Emits the accepted File once uploaded, or null when it is removed or rejected. */
  readonly fileSelected = output<File | null>();
  readonly stateChange = output<DgaFileUploadState>();

  readonly state = signal<DgaFileUploadState>('idle');
  readonly fileName = signal('');
  readonly errorText = signal('');

  pick(picker: HTMLInputElement): void {
    const file = picker.files?.[0] ?? null;
    picker.value = ''; // allow re-picking the same file after a remove
    if (!file) return;
    this.fileName.set(file.name);

    const exts = this.accept().split(',').map(e => e.trim().toLowerCase());
    if (!exts.some(ext => file.name.toLowerCase().endsWith(ext))) {
      this.fail(this.formatError());
      return;
    }
    if (file.size > this.maxSizeMb() * 1024 * 1024) {
      this.fail(this.sizeError());
      return;
    }
    this.beginUpload(file);
  }

  /** Simulated transport: Loading, then Uploaded. Consumers do the real upload off `fileSelected`. */
  private beginUpload(file: File): void {
    this.errorText.set('');
    this.setState('loading');
    setTimeout(() => {
      this.setState('uploaded');
      this.fileSelected.emit(file);
    }, 1000);
  }

  private fail(message: string): void {
    this.errorText.set(message);
    this.setState('error');
    this.fileSelected.emit(null);
  }

  remove(): void {
    this.fileName.set('');
    this.errorText.set('');
    this.setState('idle');
    this.fileSelected.emit(null);
  }

  private setState(next: DgaFileUploadState): void {
    this.state.set(next);
    this.stateChange.emit(next);
  }
}
