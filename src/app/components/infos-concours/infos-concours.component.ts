import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';

declare const app: any;
declare const lang: any;

@Component({
	selector: 'app-infos-concours',
	templateUrl: './infos-concours.component.html'
})
export class InfosConcoursComponent implements OnInit {

	@ViewChild('tableConcoursDate') tableConcoursDate!: TableComponent;
	@ViewChild('tableConcoursMontant') tableConcoursMontant!: TableComponent;
	@ViewChild('tableVersement') tableVersement!: TableComponent;
	@ViewChild('tableConcoursProduit') tableConcoursProduit!: TableComponent;

	showConcours: boolean = false;
	app: any = app;
	concours: any = null;
	isAFD: any;
	lang: any = lang;
	enableCollapse: any;

	@Input() entite: any;

	constructor() { }

	ngOnInit() {
		this.isAFD = app.isAFD(this.entite);
	}

	async getConcours(numeroConcours: any, enableCollapse: any) {
		this.concours = await app.getAllDataConcoursById(numeroConcours);
        	this.enableCollapse = enableCollapse;
		var projet = await app.getExternalData(app.getUrl('urlGetProjetByNum', this.concours.numeroProjet), 'cmp-info-concours > get projet', true);

		var concoursGCF = await app.getExternalData(app.getUrl('urlGetConcoursGCFByProjet', this.concours.numeroProjet), 'cmp-info-context > getConcoursGCF');

		if (this.isAFD) {
			var montantsDDR = await app.montantsDDRStatutEnCours(this.concours);

			this.concours.rav_newV = (this.concours.resteAVerser != null ? this.concours.resteAVerser : 0) - montantsDDR;
		}

		var impayesFormat = app.renderEmpty(await app.getImpayeSIRP(concoursGCF, this.entite, projet));

		if (!this.isAFD && impayesFormat.length > 0) {
			var impayesSplited = impayesFormat.split("<span");

			var resultMontant = impayesSplited[0];

			this.concours.impayes = resultMontant;
		}
		else
			this.concours.impayes = impayesFormat;

		this.showConcours = true;
	}
}