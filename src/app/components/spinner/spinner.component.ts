import { Component, Input, OnInit } from '@angular/core';

declare const lang: any;

@Component({
	selector: 'app-spinner',
	templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit {

	lang: any = lang;

	@Input() error: any;
	@Input() small: any;

	constructor() { }

	ngOnInit() { }
}