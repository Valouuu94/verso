import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent } from 'src/app/components/table/table.component';
import { StoreService } from 'src/app/services/store.service';
import { ExportExcelComponent } from 'src/app/components/export-excel/export-excel.component';

declare const app: any;
declare const lang: any;

@Component({
	selector: 'app-historique-dossiers-raj',
	templateUrl: './historique-dossiers-raj.component.html'
})
export class HistoriqueDossiersRajComponent implements OnInit {

	@ViewChild('tableDossiersRaj') tableDossiersRaj!: TableComponent;
	@ViewChild('exportDossiersRaj') exportDossiersRaj!: ExportExcelComponent;

	app: any = app;
	lang: any = lang;
	dossiersRaj: any = [];
	dossiersRajCopy: any = [];
	filterSelected: any = '';

	constructor(private router: Router, public store: StoreService) { }

	ngOnInit() { }

	async ngAfterViewInit() {
		await this.getDossiersRaj();
	}

	async getDossiersRaj() {
		this.tableDossiersRaj.setLoading(true);

		this.dossiersRaj = await app.getExternalData(app.getUrl('urlGetDossiersControlesRAJByProjet', ''), 'historique-dossiers-raj > getDossiersRaj');
		this.dossiersRajCopy = app.copy(this.dossiersRaj);

		await app.sleep(150);

		this.tableDossiersRaj.getItems();
	}

	async gotoDossierRaj(item: any) {
		app.redirect(this.router, app.getUrl('urlGotoHistoriqueDossierRaj', item.persistenceId));
	}

	async filterRajBy(type: any) {
		this.filterSelected = type;

		var searchResult = [];
		for (var elt of this.dossiersRajCopy)
			if ((type == '0' && elt.rajZero) || (type != '0' && !elt.rajZero))
				searchResult.push(elt);

		this.dossiersRaj = searchResult;

		await app.sleep(50);

		this.tableDossiersRaj.getItems();
	}

	async filterRajReset() {
		this.filterSelected = "";

		this.dossiersRaj = this.dossiersRajCopy;

		await app.sleep(150);

		this.tableDossiersRaj.resetPage();
		this.tableDossiersRaj.filterItems();
		this.tableDossiersRaj.sortByDefault();
		this.tableDossiersRaj.getItems();
	}

	filterRajSelected(value: any) {
		return this.filterSelected == value;
	}

	async exportExcel() {
		this.tableDossiersRaj.loadingExport = true;

		var items = this.tableDossiersRaj.itemsFiltered;

		for (var item of items) {
			item.agenceGestion = app.getRefLabel('refAgencesGestions', item.agenceGestion);
			item.montant = item.montantAvance + " " + item.deviseAvance;
			item.typeAvance = app.getRefLabel('refTypeAvance', item.typeAvance);
			item.produitFinancier = app.getRefLabel('refProduitsFinancier', item.produitFinancier);
			item.infosDatesMaj = app.formatDate(item.dateModification) + " (crée le " + app.formatDate(item.dateCreation) + ")";
		}

		this.exportDossiersRaj.exportExcel('histoRAJ', items, null, null);

		this.tableDossiersRaj.loadingExport = false;
	}
}