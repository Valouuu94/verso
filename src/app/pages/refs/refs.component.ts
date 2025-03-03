import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { TableComponent } from '../../components/table/table.component';
import { ContentComponent } from '../../components/content/content.component';

declare const app: any;
declare const appFormio: any;
declare const lang: any;

@Component({
    selector: 'app-refs',
    templateUrl: './refs.component.html',
    standalone: true,
    imports: [CommonModule, ContentComponent, TableComponent, ModalComponent]
})
export class RefsComponent implements OnInit {

	@ViewChild('tableRef') tableRef!: TableComponent;
	@ViewChild('modalRef') modalRef!: ModalComponent;

	urlType: any;
	type: any;
	lang: any = lang;

	constructor(private route: ActivatedRoute) { }

	ngOnInit() {
	}

	ngAfterViewChecked() {
		this.initType();
	}

	get modalTitle() {
		return this.type;
	}
	async initType() {
		var paramType = this.route.snapshot.paramMap.get('type');

		if (this.type != paramType) {
			this.type = paramType;

			this.urlType = 'urlGet' + app.capitalize(this.type, true);

			await app.sleep(250);

			this.tableRef.reset();
			this.tableRef.getItems();
		}
	}
	async gotoDetail(item: any) {
		app.setBDM(item);

		appFormio.loadFormIO(this.type);

		await app.sleep(250);

		app.showModal('modalRef');
	}
}