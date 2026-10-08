import { Component, Input } from '@angular/core';

export type DgaIconName =
  | 'alert-circle'
  | 'alert-triangle'
  | 'arrow-left'
  | 'arrow-right'
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'external-link'
  | 'filter'
  | 'home'
  | 'info'
  | 'link'
  | 'lock'
  | 'menu'
  | 'minus'
  | 'more-horizontal'
  | 'plus'
  | 'saudi-flag'
  | 'search'
  | 'upload';

@Component({
  selector: 'dga-icon',
  standalone: true,
  template: `
    <svg [attr.viewBox]="viewBox"
      [attr.width]="name === 'saudi-flag' ? 20 : dimension" [attr.height]="name === 'saudi-flag' ? 14 : dimension"
      [attr.fill]="filled ? 'currentColor' : 'none'"
      [attr.stroke]="filled || name === 'saudi-flag' ? null : 'currentColor'"
      [attr.stroke-width]="name === 'check' ? 3 : 2" stroke-linecap="round" stroke-linejoin="round"
      [attr.role]="label ? 'img' : null" [attr.aria-label]="label || null"
      [attr.aria-hidden]="label ? null : 'true'" focusable="false">
      @switch (name) {
        @case ('alert-circle') { <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /> }
        @case ('alert-triangle') { <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /> }
        @case ('arrow-left') { <path d="M19 12H5M12 19l-7-7 7-7" /> }
        @case ('arrow-right') { <path d="M5 12h14m-7-7 7 7-7 7" /> }
        @case ('calendar') { <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /> }
        @case ('check') { <path d="M20 6 9 17l-5-5" /> }
        @case ('chevron-down') { <path d="m6 9 6 6 6-6" /> }
        @case ('chevron-left') { <path d="m15 18-6-6 6-6" /> }
        @case ('chevron-right') { <path d="m9 18 6-6-6-6" /> }
        @case ('close') { <path d="m18 6-12 12M6 6l12 12" /> }
        @case ('external-link') { <path d="M15 3h6v6m-11 5L21 3" /><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /> }
        @case ('filter') { <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" /> }
        @case ('home') { <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" /> }
        @case ('info') { <circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /> }
        @case ('link') {
          <path d="M16.2175 1.34755C14.4911-.449183 11.6792-.449181 9.95284 1.34755l-.71352.7426a.75.75 0 0 0 1.0816 1.03927l.7136-.7426c1.1361-1.18243 2.9652-1.18243 4.1014 0 1.1523 1.19929 1.1523 3.15567 0 4.35496l-3.2394 3.37142a4.25 4.25 0 0 1-.5815.47c-1.1081.6811-2.5594.5297-3.51992-.47a4.3 4.3 0 0 1-.40487-.5251.75.75 0 0 0-1.28096.7817c.16953.2777.37074.5405.60345.7827 1.4545 1.514 3.68424 1.6652 5.38694.6186.315-.1934.6107-.4297.8785-.7083l3.2394-3.37145c1.7099-1.77986 1.7098-4.65364-.0001-6.4335Z" />
          <path d="M10.7868 6.34754C9.06036 4.55082 6.24845 4.55082 4.52206 6.34754l-3.23942 3.3714c-1.71019 1.77986-1.71019 4.65366 0 6.43356 1.72639 1.7967 4.5383 1.7967 6.26469 0l.71378-.7429a.75.75 0 0 0-1.08165-1.0393l-.71378.7429c-1.13614 1.1824-2.96531 1.1824-4.10145 0-1.15235-1.1993-1.15235-3.1557 0-4.355l3.23942-3.37142c1.13614-1.18243 2.96531-1.18243 4.10145 0 .15621.16258.29112.33879.40484.52498a.75.75 0 0 0 1.28096-.7818 5.7 5.7 0 0 0-.60345-.78268Z" />
        }
        @case ('lock') {
          <path d="M5.25 14.25c0-.5523.44772-1 1-1h.00897c.55228 0 1 .4477 1 1s-.44772 1-1 1H6.25c-.55228 0-1-.4477-1-1Zm4.991 0c0-.5523.4477-1 1-1h.009c.5523 0 1 .4477 1 1s-.4477 1-1 1h-.009c-.5523 0-1-.4477-1-1Z" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7.20909V5.25C3.5 2.3505 5.8505 0 8.75 0S14 2.3505 14 5.25v1.95909c1.6908.40376 2.989 1.83935 3.2255 3.59611.1481 1.1004.2745 2.2566.2745 3.4448s-.1264 2.3444-.2745 3.4448c-.2716 2.017-1.9427 3.6107-4.0007 3.7053C11.7964 21.4658 10.3458 21.5 8.75 21.5s-3.04636-.0342-4.47478-.0999c-2.05806-.0946-3.72913-1.6883-4.000702-3.7053C.126363 16.5944 0 15.4382 0 14.25s.126363-2.3444.274518-3.4448C.511044 9.04844 1.80919 7.61285 3.5 7.20909ZM5 5.25c0-2.07107 1.67893-3.75 3.75-3.75s3.75 1.67893 3.75 3.75v1.81937C11.3032 7.02365 10.0769 7 8.75 7s-2.65324.02365-3.75.06937V5.25Zm3.75 3.25c-1.57355 0-3.0011.03372-4.4059.0983-1.309.06018-2.40481 1.08358-2.583 2.407-.14537 1.0798-.2611 2.1576-.2611 3.2447s.11573 2.1649.2611 3.2447c.17819 1.3234 1.274 2.3468 2.583 2.407 1.4048.0646 2.83235.0983 4.4059.0983s3.0011-.0337 4.4059-.0983c1.309-.0602 2.4048-1.0836 2.583-2.407.1454-1.0798.2611-2.1576.2611-3.2447s-.1157-2.1649-.2611-3.2447c-.1782-1.32342-1.274-2.34682-2.583-2.407C11.7511 8.53372 10.3236 8.5 8.75 8.5Z" />
        }
        @case ('menu') { <path d="M3 6h18M3 12h18M3 18h18" /> }
        @case ('minus') { <path d="M5 12h14" /> }
        @case ('more-horizontal') { <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /> }
        @case ('plus') { <path d="M12 5v14m-7-7h14" /> }
        @case ('saudi-flag') {
          <rect width="20" height="14" rx="1" fill="#006923" />
          <g fill="#fff">
            <rect x="3.4" y="3.6" width="3.6" height="1.1" rx=".55" />
            <rect x="7.6" y="3.6" width="2.2" height="1.1" rx=".55" />
            <rect x="10.4" y="3.6" width="2" height="1.1" rx=".55" />
            <rect x="13" y="3.6" width="3.6" height="1.1" rx=".55" />
            <rect x="4.6" y="5.5" width="2.4" height="1" rx=".5" />
            <rect x="7.8" y="5.5" width="3.2" height="1" rx=".5" />
            <rect x="11.6" y="5.5" width="3.8" height="1" rx=".5" />
            <path d="m3.2 9.7 1.4-.7v1.4z" />
            <rect x="4.4" y="9.25" width="9.4" height=".9" rx=".45" />
            <rect x="13.6" y="8.5" width=".7" height="2.4" rx=".35" />
            <rect x="14.3" y="9.25" width="1.7" height=".9" rx=".45" />
          </g>
        }
        @case ('search') { <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /> }
        @case ('upload') { <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5-5 5 5m-5-5v12" /> }
      }
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; flex: 0 0 auto; inline-size: max-content; block-size: max-content; line-height: 0; color: inherit; }
    svg { display: block; inline-size: var(--dga-icon-size, 1em); block-size: var(--dga-icon-size, 1em); color: inherit; }
    svg[viewBox="0 0 20 14"] { inline-size: auto; aspect-ratio: 20 / 14; }
    svg[viewBox^="0 0 17.5"] { inline-size: auto; aspect-ratio: 1; }
  `],
})
export class DgaIcon {
  @Input({ required: true }) name!: DgaIconName;
  @Input() label = '';
  @Input() size: 'sm' | 'md' | 'lg' | number = 'md';

  protected get dimension(): string {
    if (typeof this.size === 'number') return `${this.size}px`;
    return this.size === 'sm' ? '0.875em' : this.size === 'lg' ? '1.25em' : '1em';
  }

  protected get viewBox(): string {
    if (this.name === 'saudi-flag') return '0 0 20 14';
    if (this.name === 'lock') return '0 0 17.5 21.5';
    if (this.name === 'link') return '0 0 17.5001 17.5';
    return '0 0 24 24';
  }

  protected get filled(): boolean {
    return this.name === 'more-horizontal' || this.name === 'lock' || this.name === 'link';
  }
}
