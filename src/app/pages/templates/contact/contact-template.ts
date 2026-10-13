import { Component } from '@angular/core';
import {
  DgaBreadcrumb,
  DgaInput, DgaSelect, DgaSelectOption, DgaTextarea,
  DgaButtonComponent,
  DgaCard, DgaCardHeader, DgaCardContent, DgaCardTitle,
  DgaIcon, DgaFileUpload,
} from '@dev-dga/angular';

/**
 * Contact Us page template — a full-page composition from DGA library components, mirroring the DGA
 * reference: a tinted page-header band (breadcrumb + title + description), a message form
 * (DgaInput / DgaSelect / DgaTextarea / DgaFileUpload / DgaButton) and a contact-info DgaCard pulled up
 * so a small part overlaps the band. Presentational: fields are display-only placeholders.
 */
@Component({
  standalone: true,
  selector: 'app-contact-template',
  imports: [
    DgaBreadcrumb, DgaInput, DgaSelect, DgaTextarea, DgaButtonComponent,
    DgaCard, DgaCardHeader, DgaCardContent, DgaCardTitle, DgaIcon, DgaFileUpload,
  ],
  templateUrl: './contact-template.html',
  styleUrl: './contact-template.scss',
})
export class ContactTemplate {
  readonly crumbs = [
    { label: 'Home', routerLink: '/design-system' },
    { label: 'Templates', routerLink: '/design-system' },
    { label: 'Contact us' },
  ];

  readonly categories: DgaSelectOption[] = [
    { label: 'Suggestion', value: 'suggestion' },
    { label: 'Complaint', value: 'complaint' },
    { label: 'Inquiry', value: 'inquiry' },
    { label: 'Technical support', value: 'support' },
  ];

  readonly emergency = [
    { label: 'Civil defence', number: '998' },
    { label: 'Police', number: '999' },
    { label: 'Ambulance', number: '997' },
  ];
}
