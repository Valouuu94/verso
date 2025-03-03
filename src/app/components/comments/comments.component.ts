import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

declare const app: any;
declare const lang: any;

@Component({
	selector: 'app-comments',
	templateUrl: './comments.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit {

	app: any = app;
	lang: any = lang;
	currentUserName: any;
	currentUserId: any;
	commentaires: any = [];
	liens: any;
	existMyComment: boolean = false;
	entite: any;
	perimetre: any;
	isDCV: any;
	disableSave: boolean = false;

	@Input() DO: any;
	@Input() numero: any;
	@Input() type: any;
	@Input() read: any;
	@Input() currentUserRole: any = null; //envoyé depuis reglement-controles et recupéré de la tache

	@Output() save = new EventEmitter();
	@Output() detectChanges = new EventEmitter();

	constructor(public store: StoreService, private cdr: ChangeDetectorRef) {
		this.cdr.detach();

		this.read = false;
	}

	async ngOnInit() {
		if (this.store.getUserContext() != null)
			this.currentUserName = this.store.getUserContext().prenom + ' ' + this.store.getUserContext().nom;

		this.currentUserId = this.store.getUserContext().idUtilisateur;

		this.entite = this.store.getUserEntite();
		this.perimetre = this.store.getUserPerimetre();
		this.isDCV = app.isDCV(this.entite, this.perimetre);

		await this.getCommentaires();

		this.liens = [];

		this.ajouterLien();

		this.cdr.detectChanges();
	}

	trackByComment(index: any, item: any) {
		return item.persistenceId;
	}

	async getCommentaires() {
		this.disableSave = false;

		var commentaires;
		if (this.numero != null)
			commentaires = await app.getExternalData(app.getUrl('urlGetCommentairesByNumero', this.type + '-' + this.numero));
		else
			commentaires = await app.getExternalData(app.getUrl('urlGetCommentaires', ((this.DO.firstStepPersistenceId != null) ? this.DO.firstStepPersistenceId : this.DO.persistenceId)));

		this.commentaires = [];
		this.existMyComment = false;
		var linksCount = 0;
		var commentsCount = 0;
		var commentsTextCount = 0;
		var existOtherUserAfter = false;

		if (commentaires != null) {
			for (var commentaire of commentaires) {
				var liens: any = [];
				for (var lien of commentaire.liens) {
					liens.push({ value: lien });

					if (!app.isEmpty(lien))
						linksCount++;
				}

				var isAnnule = ((commentaire.commentaireAnnule != null && commentaire.commentaireAnnule === true) ? true : false);

				// if (!this.isDCV && !isAnnule) { //modif suite ANO 2071 qui met le meme fonctionnement pour niveau 1 et niveau 2
				if (!isAnnule) {
					if (commentaire.acteurIdentifiant == this.currentUserId)
						this.existMyComment = true;
					else if (commentaire.acteurIdentifiant != this.currentUserId && this.existMyComment) {
						this.existMyComment = false;
						existOtherUserAfter = true;
					}
				}

				this.commentaires.push({
					userName: commentaire.auteurCommentaire,
					userId: commentaire.acteurIdentifiant,
					userRole: app.getRefLabel('refRoles', commentaire.roleCommentaire),
					userInitials: app.getUserInitiales(commentaire.auteurCommentaire),
					date: commentaire.dateCommentaire,
					comment: commentaire.texteCommentaire,
					annule: isAnnule,
					persistenceId: commentaire.persistenceId,
					existOtherUserAfter: existOtherUserAfter,
					liens: liens
				});

				if (!isAnnule)
					commentsCount++;

				if (!isAnnule && !app.isEmpty(commentaire.texteCommentaire))
					commentsTextCount++;
			}

			for (var commentaire of this.commentaires) {
				if (existOtherUserAfter) {
					commentaire.editable = false;
					if (commentaire.userId == this.currentUserId && commentaire.existOtherUserAfter)
						commentaire.editable = true;
				} else
					commentaire.editable = true;
			}
		}

		if (this.DO != null) {
			this.DO.commentCount = commentsCount;
			this.DO.commentTextCount = commentsTextCount;
			this.DO.linksCount = linksCount;

			this.detectChanges.emit();
		}
	}

	getCommentaireId() {
		return 'commentaire-controle-' + this.DO?.id;
	}

	async editCommentaire(item: any) {
		this.existMyComment = false;

		this.liens = item.liens;

		item.annule = true;

		await this.annuleCommentaire(item);

		this.cdr.detectChanges();

		await app.sleep(150);

		app.setElementValue(this.getCommentaireId(), item.comment);

		var idxLien = 0;
		for (var lien of this.liens) {
			app.setElementValue(this.getCommentaireId() + '-lien-' + idxLien, lien.value);
			idxLien++;
		}
	}

	async saveCommentaire() {
		var commentaire = app.getElementValue(this.getCommentaireId());

		if (app.isEmpty(commentaire) && this.liens != null && this.liens.length > 0 && app.isEmpty(app.getElementValue(this.getCommentaireId() + '-lien-0')))
			return;

		this.disableSave = true;

		var DO = app.getDO('commentaire');
		DO.texteCommentaire = ((commentaire == null) ? '' : commentaire);
		DO.persistenceId = null;
		DO.commentaireAnnule = false;
		DO.userName = this.store.getUserName();
		DO.roleUser = (app.isEmpty(this.currentUserRole) ? '' : this.currentUserRole);

		if (this.numero != null) {
			DO.typePartentObject = this.type + '-' + this.numero;
			DO.persistanceIdParentObject = null;
			DO.caseIdParentObject = null;
		} else {
			DO.typePartentObject = this.type;
			DO.persistanceIdParentObject = ((this.DO.firstStepPersistenceId != null) ? this.DO.firstStepPersistenceId : this.DO.persistenceId);
			DO.caseIdParentObject = this.DO.caseId;
		}

		var liens: any = [];
		var idxLien = 0;
		for (var lien of this.liens) {
			liens.push(app.getElementValue(this.getCommentaireId() + '-lien-' + idxLien));
			idxLien++;
		}
		DO.liens = liens;

		try {
			const response = await app.saveFormData(app.getRootDO('commentaire'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessAddCommentaire'));

			this.save.emit(response);

			app.setElementValue(this.getCommentaireId(), '');

			this.liens = [];
			this.ajouterLien();

			await this.getCommentaires();
		} catch (error) {
			this.save.emit(false);
		}

		this.cdr.detectChanges();
	}

	async annuleCommentaire(item: any) {
		var DO = app.getDO('commentaire');
		DO.texteCommentaire = item.comment;
		DO.commentaireAnnule = true;
		DO.persistenceId = item.persistenceId;

		if (this.numero != null) {
			DO.typePartentObject = this.type + '-' + this.numero;
			DO.persistanceIdParentObject = null;
			DO.caseIdParentObject = null;
		} else {
			DO.typePartentObject = this.type;
			DO.persistanceIdParentObject = ((this.DO.firstStepPersistenceId != null) ? this.DO.firstStepPersistenceId : this.DO.persistenceId);
			DO.caseIdParentObject = this.DO.caseId;
			DO.roleUser = (app.isEmpty(this.currentUserRole) ? '' : this.currentUserRole);
		}

		var liens: any = [];
		var idxLien = 0;
		for (var lien of this.liens) {
			liens.push(app.getElementValue(this.getCommentaireId() + '-lien-' + idxLien));
			idxLien++;
		}
		DO.liens = liens;

		await app.saveFormData(app.getRootDO('commentaire'), null, app.getUrl('urlProcessInstanciation'), app.getUrl('urlProcessAddCommentaire'));
	}

	async supprimerLien(item: any) {
		var index = -1;
		for (var i = 0; i < this.liens.length; i++)
			if (item == this.liens[i])
				index = i;

		if (index != -1)
			this.liens.splice(index, 1);

		this.cdr.detectChanges();
	}

	async ajouterLien() {
		this.liens.push({
			value: ''
		});

		this.cdr.detectChanges();
	}
}