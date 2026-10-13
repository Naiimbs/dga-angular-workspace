import { Component } from '@angular/core';
import {
  DgaBreadcrumb,
  DgaAccordion, DgaAccordionItem,
  DgaCard, DgaCardIcon, DgaCardTitle, DgaCardDescription,
  DgaButtonComponent, DgaIcon,
} from '@dev-dga/angular';

/**
 * FAQ page template — a full-page composition built entirely from DGA library components, mirroring
 * the DGA FAQ reference: a tinted page-header band (breadcrumb + title + description), a DgaAccordion
 * of question/answer items (the chevron is swapped to a DGA icon-font arrow via a global style — see
 * src/styles.scss), a "contact support" DgaCard, and a "Was this page useful?" bar. Content is
 * generic placeholder copy so the page reads as a reusable template.
 */
@Component({
  standalone: true,
  selector: 'app-faq-template',
  imports: [
    DgaBreadcrumb, DgaAccordion,
    DgaCard, DgaCardIcon, DgaCardTitle, DgaCardDescription,
    DgaButtonComponent, DgaIcon,
  ],
  templateUrl: './faq-template.html',
  styleUrl: './faq-template.scss',
})
export class FaqTemplate {
  readonly crumbs = [
    { label: 'Home', routerLink: '/design-system' },
    { label: 'Templates', routerLink: '/design-system' },
    { label: 'FAQs' },
  ];

  readonly faqItems: DgaAccordionItem[] = [
    { value: 'q1', title: 'What is this FAQ section for?', content: 'This section answers the most common questions about the platform, its services, and how to use them.' },
    { value: 'q2', title: 'How do I get started?', content: 'Create an account or sign in, then follow the guided steps on your dashboard to begin.' },
    { value: 'q3', title: 'Where can I find more information?', content: 'Visit the Service Guide, or reach the support team through the channels on the Contact page.' },
    { value: 'q4', title: 'Can I customize this platform?', content: 'Yes — the design-system components are themeable through design tokens and adapt to light and dark modes.' },
    { value: 'q5', title: 'How do I contact support?', content: 'Use the "Contact us" button below, or get in touch through the Contact page.' },
  ];
}
