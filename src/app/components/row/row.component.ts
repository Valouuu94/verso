import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-row',
	templateUrl: './row.component.html'
})
export class RowComponent implements OnInit {

	@Input() label: any;

	constructor() { }
	
	ngOnInit() { }
}