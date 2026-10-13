import { Component, signal } from '@angular/core';
import {
  DgaBreadcrumb,
  DgaCard, DgaCardHeader, DgaCardIcon, DgaCardTitle, DgaCardDescription, DgaCardContent, DgaCardExpandableContent,
  DgaButtonComponent, DgaIcon, DgaAlert, DgaStepper, DgaStepperItem,
} from '@dev-dga/angular';

/**
 * Service Guide page template — a full-page composition from DGA library components, mirroring the DGA
 * reference: DgaCards for the intro and eligible-cases grid, expandable DgaCards for the documents,
 * a DgaStepper for the steps, a dismissible warning DgaAlert, and a left-aligned CTA. All icons DGA.
 */
@Component({
  standalone: true,
  selector: 'app-service-guide-template',
  imports: [
    DgaBreadcrumb, DgaCard, DgaCardHeader, DgaCardIcon, DgaCardTitle, DgaCardDescription, DgaCardContent,
    DgaCardExpandableContent, DgaButtonComponent, DgaIcon, DgaAlert, DgaStepper,
  ],
  templateUrl: './service-guide-template.html',
  styleUrl: './service-guide-template.scss',
})
export class ServiceGuideTemplate {
  readonly crumbs = [
    { label: 'Home', routerLink: '/design-system' },
    { label: 'Templates', routerLink: '/design-system' },
    { label: 'Service guide' },
  ];

  readonly eligible = [
    { title: 'Critical cases', body: 'Cases that require rapid intervention or urgent transfer to a capable facility.' },
    { title: 'Specialized care', body: 'When the case needs a medical specialty or equipment not available locally.' },
    { title: 'Unsuitable for ground transport', body: 'When ground transport is unsafe or impractical given the distance or the case.' },
    { title: 'Transfer between facilities', body: 'Moving a patient from one health facility to another that can provide the needed care.' },
    { title: 'Equipment during transport', body: 'Cases that need specific medical equipment or monitoring throughout the journey.' },
  ];

  readonly basicDocs = [
    'The patient’s basic and identity data',
    'The referring and receiving health facilities',
    'The case’s medical data, including the diagnosis',
    'A recent, detailed medical report',
    'Bed acceptance form',
    'Legal liability and consent form',
  ];
  readonly conditionalDocs = [
    { title: 'DNR consent', when: 'When the case is a do-not-resuscitate case.' },
    { title: 'Passport / GCC ID', when: 'For transfers outside the Kingdom, per the destination’s rules.' },
  ];
  readonly optionalDocs = [
    { title: 'ECG and prior reports', when: 'Supporting documents that help speed up the case review.' },
  ];

  readonly steps: DgaStepperItem[] = [
    { title: 'Prepare data and documents', description: 'Make sure the patient data, medical report and facility details are ready.' },
    { title: 'Submit the request online', description: 'Fill in the request form with the patient data, medical condition and destination.' },
    { title: 'Upload attachments', description: 'Attach the medical report and supporting documents clearly and completely.' },
    { title: 'Request review', description: 'The data is reviewed to confirm the request is complete and the attachments are valid.' },
    { title: 'Medical case assessment', description: 'The case is studied to determine suitability and the request priority.' },
    { title: 'Coordination and scheduling', description: 'On approval, the relevant parties coordinate to determine the flight details.' },
    { title: 'Execution and follow-up', description: 'The request is tracked until the flight is carried out and the patient arrives.' },
  ];

  readonly showNote = signal(true);
}
