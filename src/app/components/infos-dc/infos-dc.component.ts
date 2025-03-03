import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';

declare const app: any;
declare const lang: any;

@Component({
    selector: 'app-infos-dc',
    templateUrl: './infos-dc.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class InfosDcComponent implements OnInit {
    documentContractuel: any;
    isAR: boolean = false;
    resteARembourser: any;
    arInitiale: any;
    rembEffectuee: any;
    app: any = app;
    lang: any = lang;
    reglementEnCours: any;

    @Input() showLinkDc: boolean = false;
    @Input() versement: any;

    constructor(private router: Router, public store: StoreService) { }

    ngOnInit() { }

    async getDetailDocumentContractuel(idDocumentContractuel: any, reglementEnCours: any, deviseDDREnCours: any, montantDDREnCours: any) {
        this.reglementEnCours = reglementEnCours;
        
		if (!app.isEmpty(idDocumentContractuel)) {
			this.documentContractuel = await app.getExternalData(app.getUrl('urlGetDocumentContractuelById', idDocumentContractuel), 'infos-dc > getDocumentContractuel - DC', true);

			this.isAR = (this.documentContractuel.avance_remboursable == "1") ? true : false;

			var idDDREnCours = null;
			var statutDDREnCours = '';

			deviseDDREnCours = deviseDDREnCours;
			montantDDREnCours = montantDDREnCours;

			if (this.reglementEnCours != null && this.showLinkDc) {
				idDDREnCours = this.reglementEnCours.persistenceId;
				statutDDREnCours = this.reglementEnCours.code_statut_dossier;
			}
			//this.documentContractuel = await app.getRavProvisionnelRavActuelDC(this.documentContractuel, idDDREnCours, this.isAR);
            var montansDevisesDC = [];
            var devisesDC = this.documentContractuel.autre_devise;
            var rav_previsionnel_afd = this.documentContractuel.montant_reste_a_verserAFD;
            console.warn("this.documentContractuel.montant_reste_a_verserAFD > " + rav_previsionnel_afd)
            //devisesDC.unshift({ 'montant': this.documentContractuel.montant_afd, 'devise': this.documentContractuel.devise_afd, 'rav_previsionnel': rav_previsionnel_afd });
            devisesDC.unshift({ 'montant': this.documentContractuel.montant_afd, 'devise': this.documentContractuel.devise_afd, 'reste_a_verser_reel_dc': this.documentContractuel.reste_a_verser_reel_dc, 'montant_reste_a_verser':  this.documentContractuel.montant_reste_a_verserAFD });
            console.warn("devisesDC > " , devisesDC);
            for(var deviseDC of devisesDC) {
                console.warn("deviseDC.montant_reste_a_verser > ", deviseDC.montant_reste_a_verser);
                deviseDC.rav_previsionnel = deviseDC.montant_reste_a_verser;
                deviseDC.rav_actuel = (deviseDC.reste_a_verser_reel_dc == null) ? deviseDC.montant : deviseDC.reste_a_verser_reel_dc;
                montansDevisesDC.push(deviseDC);

            }

            console.warn("montansDevisesDC > ", montansDevisesDC);
            
            this.documentContractuel.montantsDevises = montansDevisesDC;

			// this.arInitiale = app.getMontantARInitiale(this.documentContractuel);
			this.arInitiale = (!app.isEmpty(this.documentContractuel.montant_ar_initiale)) ? this.documentContractuel.montant_ar_initiale :0;
			
			this.rembEffectuee = (!app.isEmpty(this.documentContractuel.montant_remb_effectue)) ? this.documentContractuel.montant_remb_effectue : 0;

			this.resteARembourser = this.arInitiale - this.rembEffectuee;
		}
		else
			this.documentContractuel = null;
	}
    gotoDC() {
        if(this.reglementEnCours != null)
            app.setStorageItem('idReglement', this.reglementEnCours.persistenceId);
        else
			app.setStorageItem('idVersement', this.versement.persistenceId);

        app.redirect(this.router, app.getUrl('urlGoToDocumentContractuel', this.documentContractuel.persistenceId));
    }

}