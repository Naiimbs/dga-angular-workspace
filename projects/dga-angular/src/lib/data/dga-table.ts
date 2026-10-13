import { Component, Input } from '@angular/core';

export interface DgaTableColumn {
  key: string;
  label: string;
}

export type DgaTableRow = Readonly<Record<string, string | number>>;

@Component({
  selector: 'dga-table',
  standalone: true,
  template: `
    <div class="table-wrap" [class.table-wrap--contained]="contained"
      [style.max-block-size]="maxHeight" [attr.role]="caption ? 'region' : null"
      [attr.aria-label]="caption || null" [attr.tabindex]="caption ? 0 : null" [attr.aria-busy]="loading ? 'true' : null">
      <table class="ddga-table" [class.ddga-table--striped]="striped" [class.ddga-table--sticky]="stickyHeader"
        [class.ddga-table--sm]="size === 'sm'" [class.ddga-table--lg]="size === 'lg'">
        @if (columns.length) {
          <caption class="ddga-table__visually-hidden">{{ caption }}</caption>
          <thead class="ddga-table__header"><tr class="ddga-table__row">
            @for (column of columns; track column.key) { <th class="ddga-table__head" scope="col">{{ column.label }}</th> }
          </tr></thead>
          <tbody class="ddga-table__body">
            @if (loading) {
              <tr class="ddga-table__row"><td class="ddga-table__empty" [attr.colspan]="columns.length" role="status">{{ loadingMessage }}</td></tr>
            } @else {
              @for (row of rows; track $index) {
                <tr class="ddga-table__row" [attr.data-selected]="selectedRows.includes($index) ? 'true' : null">
                  @for (column of columns; track column.key) { <td class="ddga-table__cell">{{ row[column.key] }}</td> }
                </tr>
              } @empty {
                <tr class="ddga-table__row"><td class="ddga-table__empty" [attr.colspan]="columns.length">{{ emptyMessage }}</td></tr>
              }
            }
          </tbody>
        } @else {
          <ng-content></ng-content>
        }
      </table>
    </div>
  `,
})
export class DgaTable {
  @Input() columns: readonly DgaTableColumn[] = [];
  @Input() rows: readonly DgaTableRow[] = [];
  @Input() caption = 'Data table';
  @Input() emptyMessage = 'No records found.';
  @Input() loadingMessage = 'Loading records…';
  @Input() loading = false;
  @Input() selectedRows: readonly number[] = [];
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() striped = false;
  @Input() contained = true;
  @Input() stickyHeader = false;
  @Input() maxHeight = '';
}
