import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-btnMenu',
	templateUrl: './btnMenu.component.html'
})
export class BtnMenuComponent implements OnInit {

	@Input() icon: any;
	@Input() side: any;
	
	constructor() { }
	
	ngOnInit() { }
}
