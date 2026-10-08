import { booleanAttribute, Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

export type DgaTableAlignment = 'start' | 'center' | 'end';
export type DgaTableSortDirection = 'none' | 'ascending' | 'descending';

@Directive({
  selector: 'thead[dga-table-header]',
  standalone: true,
  host: { class: 'ddga-table__header' },
})
export class DgaTableHeader {}

@Directive({
  selector: 'tbody[dga-table-body]',
  standalone: true,
  host: { class: 'ddga-table__body' },
})
export class DgaTableBody {}

@Directive({
  selector: 'tfoot[dga-table-footer]',
  standalone: true,
  host: { class: 'ddga-table__footer' },
})
export class DgaTableFooter {}

@Directive({
  selector: 'tr[dga-table-row]',
  standalone: true,
  host: { class: 'ddga-table__row' },
})
export class DgaTableRowDirective {
  @Input() selected = false;
  @HostBinding('class.ddga-table__row--selected')
  protected get selectedClass(): boolean {
    return this.selected;
  }

  @HostBinding('attr.data-selected')
  protected get selectedAttribute(): 'true' | null {
    return this.selected ? 'true' : null;
  }
}

@Directive({
  selector: 'th[dga-table-head]',
  standalone: true,
  host: { class: 'ddga-table__head' },
})
export class DgaTableHeadDirective {
  @Input() align: DgaTableAlignment = 'start';
  @Input() scope: 'col' | 'row' | 'colgroup' | 'rowgroup' = 'col';
  @Input({ transform: booleanAttribute }) sortable = false;
  @Input() sortDirection: DgaTableSortDirection = 'none';
  @Input() sortLabel = 'Sort column';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() readonly sortChange = new EventEmitter<Exclude<DgaTableSortDirection, 'none'>>();

  @HostBinding('attr.scope')
  protected get scopeAttribute(): string {
    return this.scope;
  }

  @HostBinding('attr.aria-sort')
  protected get sortAttribute(): DgaTableSortDirection | null {
    return this.sortable ? this.sortDirection : null;
  }

  @HostBinding('attr.aria-disabled')
  protected get disabledAttribute(): 'true' | null {
    return this.sortable && this.disabled ? 'true' : null;
  }

  @HostBinding('attr.tabindex')
  protected get tabIndex(): '0' | null {
    return this.sortable && !this.disabled ? '0' : null;
  }

  @HostBinding('attr.title')
  protected get title(): string | null {
    return this.sortable ? this.sortLabel : null;
  }

  @HostBinding('attr.data-align')
  protected get alignmentAttribute(): DgaTableAlignment {
    return this.align;
  }

  @HostListener('click')
  protected onClick(): void {
    this.toggleSort();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.toggleSort();
  }

  private toggleSort(): void {
    if (this.disabled) {
      return;
    }
    if (!this.sortable) {
      return;
    }
    this.sortChange.emit(this.sortDirection === 'ascending' ? 'descending' : 'ascending');
  }
}

@Directive({
  selector: 'button[dga-table-filter]',
  standalone: true,
  host: { class: 'ddga-table__filter-button', type: 'button' },
})
export class DgaTableFilterDirective {
  @Input({ transform: booleanAttribute }) active = false;
  @Input() label = 'Filter column';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() readonly activeChange = new EventEmitter<boolean>();

  @HostBinding('attr.aria-label')
  protected get labelAttribute(): string {
    return this.label;
  }

  @HostBinding('attr.aria-pressed')
  protected get pressedAttribute(): 'true' | 'false' {
    return this.active ? 'true' : 'false';
  }

  @HostBinding('attr.data-active')
  protected get activeAttribute(): 'true' | null {
    return this.active ? 'true' : null;
  }

  @HostBinding('disabled')
  protected get disabledAttribute(): boolean {
    return this.disabled;
  }

  @HostListener('click')
  protected onClick(): void {
    if (!this.disabled) {
      this.activeChange.emit(!this.active);
    }
  }
}

@Directive({
  selector: 'td[dga-table-cell]',
  standalone: true,
  host: { class: 'ddga-table__cell' },
})
export class DgaTableCellDirective {
  @Input() align: DgaTableAlignment = 'start';

  @HostBinding('attr.data-align')
  protected get alignmentAttribute(): DgaTableAlignment {
    return this.align;
  }
}

@Directive({
  selector: 'caption[dga-table-caption]',
  standalone: true,
  host: { class: 'ddga-table__caption' },
})
export class DgaTableCaption {}
