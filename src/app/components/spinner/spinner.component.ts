import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const lang: any;

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class SpinnerComponent implements OnInit {

	lang: any = lang;

	@Input() error: any;
	@Input() small: any;

	constructor() { }

	ngOnInit() { }
}