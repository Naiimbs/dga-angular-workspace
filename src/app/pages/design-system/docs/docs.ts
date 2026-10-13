import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-docs',
  styleUrl: './docs.scss',
  templateUrl: './docs.html',
})
export class Docs {}
