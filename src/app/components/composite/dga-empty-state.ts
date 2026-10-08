import { Component, Input } from '@angular/core';

export type DgaEmptyStateVariant = 'default' | 'error' | 'success';

@Component({
  selector: 'dga-empty-state',
  standalone: true,
  template: `
    <section class="empty-state"
      [class]="'empty-state empty-state--' + variant + ' empty-state--' + size"
      role="status" aria-live="polite">
      @if (icon) {
        <span class="empty-state__media" aria-hidden="true">{{ icon }}</span>
      }
      @if (title) { <h3 class="empty-state__title">{{ title }}</h3> }
      @if (description) { <p class="empty-state__description">{{ description }}</p> }
      <div class="empty-state__actions"><ng-content></ng-content></div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .empty-state { --empty-media-size: 3.5rem; --empty-icon-size: 1.75rem; --empty-tint-bg: var(--ddga-gray-100); --empty-tint-fg: var(--ddga-gray-600); display: flex; flex-direction: column; align-items: center; gap: var(--ddga-space-4); max-inline-size: 28rem; margin-inline: auto; padding-block: var(--ddga-space-8); padding-inline: var(--ddga-space-4); color: var(--ddga-text-primary); text-align: center; }
    .empty-state__media { display: flex; flex: none; align-items: center; justify-content: center; inline-size: var(--empty-media-size); block-size: var(--empty-media-size); border-radius: var(--ddga-radius-full); background: var(--empty-tint-bg); color: var(--empty-tint-fg); font-size: var(--empty-icon-size); }
    .empty-state__title { margin: 0; color: var(--ddga-text-primary); font-size: var(--ddga-font-size-lg); font-weight: var(--ddga-font-weight-semibold); line-height: 1.4; }
    .empty-state__description { margin: 0; color: var(--ddga-text-secondary); font-size: var(--ddga-font-size-base); line-height: 1.5; }
    .empty-state__actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--ddga-space-3); margin-block-start: var(--ddga-space-2); }
    .empty-state--error { --empty-tint-bg: var(--ddga-error-50); --empty-tint-fg: var(--ddga-error-600); }
    .empty-state--success { --empty-tint-bg: var(--ddga-success-50); --empty-tint-fg: var(--ddga-success-600); }
    .empty-state--sm { --empty-media-size: 2.75rem; --empty-icon-size: 1.375rem; gap: var(--ddga-space-3); padding-block: var(--ddga-space-6); }
    .empty-state--sm .empty-state__title { font-size: var(--ddga-font-size-base); }
    .empty-state--sm .empty-state__description { font-size: var(--ddga-font-size-sm); }
    .empty-state--lg { --empty-media-size: 4.5rem; --empty-icon-size: 2.25rem; gap: var(--ddga-space-5); padding-block: var(--ddga-space-12); }
    .empty-state--lg .empty-state__title { font-size: var(--ddga-font-size-xl); }
    @media (forced-colors: active) { .empty-state__media { border: 1px solid CanvasText; } }
  `],
})
export class DgaEmptyState {
  @Input() variant: DgaEmptyStateVariant = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon = '○';
  @Input() title = '';
  @Input() description = '';
}
