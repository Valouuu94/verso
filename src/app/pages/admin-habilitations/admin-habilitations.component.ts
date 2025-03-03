import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/components/table/table.component';
import { StoreService } from 'src/app/services/store.service';

declare const app: any;
declare const lang: any;

@Component({
	selector: 'app-admin-habilitations',
	templateUrl: './admin-habilitations.component.html'
})
export class AdminHabilitationsComponent implements OnInit {

	@ViewChild('tableHabilitations') tableHabilitations!: TableComponent;

	app: any = app;
	lang: any = lang;
	rubriques: any;

	constructor(public store: StoreService) { }

	ngOnInit(): void {
		this.getHabilitations();
	}

	async getHabilitations() {
		this.rubriques = await app.getExternalData(app.getUrl('urlHabilitationsAdmin'), 'admin-habilitations > getHabilitations');

		app.sortBy(this.rubriques, [
			{ key: 'libRubrique', order: 'asc' },
			{ key: 'libFonctionnalite', order: 'asc' }
		]);

		for (var rubrique of this.rubriques) {
			rubrique.libelleRubrique = rubrique.libRubrique.charAt(0).toUpperCase() + rubrique.libRubrique.slice(1);
			rubrique.libelleFonctionnalite = rubrique.libFonctionnalite;

			var habilitations = rubrique.habilitations;

			rubrique.infosHabilitations = '<div class="badge-hab">';

			app.sortBy(habilitations, [
				{ key: 'codeRole', order: 'asc' }
			]);

			for (var habilitation of habilitations) {
				if (habilitation.niveauHabilitation == 2)
					rubrique.infosHabilitations += '<div class="badge-hab-write" title="Droit d\'ecriture">' + habilitation.codeRole + '</div>';
				else if (habilitation.niveauHabilitation == 1)
					rubrique.infosHabilitations += '<div class="badge-hab-read" title="Droit de lecture">' + habilitation.codeRole + '</div>';
				else
					rubrique.infosHabilitations += '<div class="badge-hab-no" title="Aucun droit">' + habilitation.codeRole + '</div>';
			}

		}

		await app.sleep(250);

		this.tableHabilitations.getItems();
	}
}