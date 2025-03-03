import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from 'src/app/services/store.service';

declare const app: any;
declare const appFormio: any;
declare const crossVars: any;
declare const lang: any;

@Component({
    selector: 'app-infos-beneficiaire',
    templateUrl: './infos-beneficiaire.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class InfosBeneficiaireComponent implements OnInit {

	app: any = app;
	lang: any = lang;
	beneficiaire: any;
	concoursTiers: any;
	idBeneficiaireInput: any;
	
	@Input() showTiersUsedByConcours: boolean = true;
	@Input() objectParentRepris: boolean = false;

	constructor(public store: StoreService) { }

	ngOnInit() { }

	async getBeneficiaire(form: any, field: any, id: any, numeroConcours?: any, typeParentObject?: any, beneficiaire?: any) {
		this.idBeneficiaireInput = id;
		var idBeneficiaire;
		
		if (beneficiaire != null) {
			//recuperation du beneficiaire si passé en param
			idBeneficiaire = beneficiaire.idTiers;

			this.beneficiaire = beneficiaire;
		} else {
			//recuperation de l'id beneficiaire depuis le formio ou directement avec un id 
			idBeneficiaire = (form != null && field != null) ? appFormio.getDataValue(crossVars.forms[form], field) : id;

			this.beneficiaire = await app.getTiers(idBeneficiaire);
		}

		app.log('infos-beneficiaire > getBeneficiaire : beneficiaire', this.beneficiaire);

		// recuperation des concours liés au tiers
		this.concoursTiers = null;
		if (numeroConcours != null)
			this.concoursTiers = await app.getExternalData(app.getUrl('urlGetConcourTiersById', numeroConcours, idBeneficiaire, typeParentObject, this.store.getUserEntite()), 'infos-beneficiaire > getBeneficiaire - concours', true);
	}
}