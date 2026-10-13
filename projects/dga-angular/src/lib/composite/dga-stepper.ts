import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DgaIcon } from '../icons/dga-icon';

export interface DgaStepperItem {
  title: string;
  description?: string;
  /** Completed steps show a filled check marker; otherwise a numbered outline marker. */
  completed?: boolean;
}

/**
 * Vertical stepper — a numbered sequence of steps with a connecting rail, matching the DGA step
 * states: a filled primary check for completed steps and a primary-outlined number for the rest.
 * Markers sit at the inline-start and the rail mirrors in RTL. Icons are DGA (`check`).
 */
@Component({
  selector: 'dga-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DgaIcon],
  template: `
    <ol class="stepper">
      @for (s of steps(); track $index; let i = $index; let last = $last) {
        <li class="stepper__item" [class.stepper__item--done]="s.completed">
          <div class="stepper__rail">
            <span class="stepper__dot">
              @if (s.completed) { <dga-icon name="check" /> } @else { <span class="stepper__num">{{ i + 1 }}</span> }
            </span>
            @if (!last) { <span class="stepper__line"></span> }
          </div>
          <div class="stepper__body">
            <h3 class="stepper__title">{{ s.title }}</h3>
            @if (s.description) { <p class="stepper__desc">{{ s.description }}</p> }
          </div>
        </li>
      }
    </ol>
  `,
  styles: [`
    :host { display: block; }
    .stepper { list-style: none; margin: 0; padding: 0; }
    .stepper__item { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: var(--ddga-space-4, 16px); }
    .stepper__rail { display: flex; flex-direction: column; align-items: center; }

    .stepper__dot {
      flex: none; display: inline-grid; place-items: center;
      inline-size: 32px; block-size: 32px; border-radius: 50%;
      border: 2px solid var(--ddga-color-primary, #25935f);
      color: var(--ddga-color-primary, #1b8354);
      background: var(--ddga-color-background, #fff);
      font-size: var(--ddga-font-size-sm, 14px); font-weight: var(--ddga-font-weight-bold, 700); line-height: 1;
    }
    .stepper__num { font-size: 13px; }
    .stepper__item--done .stepper__dot {
      background: var(--ddga-color-primary, #1b8354);
      border-color: var(--ddga-color-primary, #1b8354);
      color: var(--ddga-color-primary-foreground, #fff); font-size: 16px;
    }

    .stepper__line {
      inline-size: 2px; flex: 1 1 auto; min-block-size: 18px;
      background: var(--ddga-color-border, #e5e7eb); margin-block: 4px;
    }
    .stepper__item--done .stepper__line { background: var(--ddga-color-primary, #25935f); }

    .stepper__body { padding-block-end: var(--ddga-space-6, 24px); }
    .stepper__item:last-child .stepper__body { padding-block-end: 0; }
    .stepper__title { margin: 4px 0 2px; font-size: 15.5px; font-weight: var(--ddga-font-weight-bold, 700); color: var(--ddga-text-primary); }
    .stepper__desc { margin: 0; font-size: var(--ddga-font-size-sm, 14px); line-height: 1.7; color: var(--ddga-text-secondary); }
  `],
})
export class DgaStepper {
  readonly steps = input<DgaStepperItem[]>([]);
}
