// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
export const CHANGE_CATEGORY = {
  buttonCancel: '[data-testid=cancel-subcategory-button]',
  buttonEdit: '[data-testid=edit-subcategory-button]',
  buttonSubmit: '[data-testid=submit-subcategory-button]',
  inputCategory: '[data-testid=input]',
};

export const CHANGE_LOCATION = {
  buttonCancel: '[data-testid=cancel-btn]',
  buttonEdit: '[data-testid="edit-location-button"]',
  buttonLocationDetailEdit: '[data-testid=location-preview-button-edit]',
  buttonSubmit: '[data-testid=submit-btn]',
  map: '[data-testid="map-input"]',
};

export const CHANGE_STATUS = {
  alertNoEmail: '[data-testid=split-incident-warning]',
  buttonCancel: '[data-testid=status-form-cancelButton]',
  buttonEdit: '[data-testid=edit-status-button]',
  buttonSubmit: '[data-testid=status-form-submit-button]',
  checkboxSendEmail: '[data-testid="send-email-checkbox"]',
  originalStatus: '[data-testid="original-status"]',
  inputToelichting: '[data-testid=text]',
  radioButtonGemeld: '[data-testid=status-m]',
  radioButtonInAfwachting: '[data-testid=status-i]',
  radioButtonIngepland: '[data-testid=status-ingepland]',
  radioButtonInBehandeling: '[data-testid=status-b]',
  radioButtonExtern: '[data-testid="status-closure requested"]',
  radioButtonAfgehandeld: '[data-testid=status-o]',
  radioButtonHeropend: '[data-testid=status-reopened]',
  radioButtonGeannuleerd: '[data-testid=status-a]',
  statusNotification: '[data-testid="status-form-toelichting"]',
  statusWarning: '[data-testid=end-status-warning]',
  warningDeelmeldingenOpen: '[data-testid="has-open-child-incidents-warning"]',
};

export const CHANGE_TYPE = {
  buttonCancel: '[data-testid=cancel-type-button]',
  buttonEdit: '[data-testid=edit-type-button]',
  buttonSubmit: '[data-testid=submit-type-button]',
  radioButtonMelding: '[data-testid=input-SIG]',
  radioButtonAanvraag: '[data-testid=input-REQ]',
  radioButtonVraag: '[data-testid=input-QUE]',
  radioButtonKlacht: '[data-testid=input-COM]',
  radioButtonGrootOnderhoud: '[data-testid=input-MAI]',
};

export const CHANGE_URGENCY = {
  buttonCancel: '[data-testid=cancelPriorityButton]',
  buttonEdit: '[data-testid=editPriorityButton]',
  buttonSubmit: '[data-testid=submitPriorityButton]',
  radioButtonHoog: '[data-testid=input-high]',
  radioButtonLaag: '[data-testid=input-low]',
  radioButtonNormaal: '[data-testid=input-normal]',
};

export const DEELMELDING = {
  buttonAdd: '[data-testid="incident-split-form-incident-split-button"]',
  buttonCancel: '[data-testid="incident-split-form-cancel-button"]',
  buttonEditDirectingDepartment: '[data-testid="edit-directing_departments-button"]',
  buttonNoAction: '[data-testid="no-action-button"]',
  buttonSubmit: '[data-testid="incident-split-form-submit-button"]',
  buttonSubmitDirectingDepartment: '[data-testid="submit-directing_departments-button"]',
  childIncident: '[data-testid="child-incident-list-item"]',
  childIncidents: '[data-testid="child-incidents"]',
  disclaimer: '[data-testid="split-form-bottom-disclaimer"]',
  dropdownSubcategory01: '[data-testid="part1.subcategory"]',
  dropdownSubcategory02: '[data-testid="part2.subcategory"]',
  dropdownSubcategory03: '[data-testid="part3.subcategory"]',
  inputDeelmeldingDescription02: '[data-testid="incident-split-form-incident-description-text-2"]',
  inputDeelmeldingDescription03: '[data-testid="incident-split-form-incident-description-text-3"]',
  inputNote: '[data-testid="incident-split-form-parent-incident-note"]',
  labelDescription02: '[for="description-2"]',
  labelDescription03: '[for="description-3"]',
  linkParent: '[data-testid="parent-link"]',
  messageLabel: '[role="alert"]',
  notification: '[data-testid="notification"]',
  radioButtonASC: '#department-ASC',
  radioButtonVerantwoordelijkeAfdeling: '#department-null',
  radioButtonEditASC: '[data-testid="input-ASC"]',
  radioButtonEditVerantwoordelijkeAfdeling: '[data-testid="input-null"]',
  titleDeelmelding: '[data-testid="incident-split-form-incident-title"]',
};

export const SIGNAL_DETAILS = {
  addressCity: '[data-testid="location-value-address-city"]',
  addressStreet: '[data-testid="location-value-address-street"]',
  buttonAddNote: '[data-testid=add-note-new-note-button]',
  buttonCancel: '[data-testid=cancel-button]',
  buttonCancelNote: '[data-testid=add-note-cancel-note-button]',
  buttonCloseImageViewer: '[data-testid=close-button]',
  buttonCreateDeelmelding: '[data-testid="detail-header-button-split"]',
  buttonEdit: '[data-testid="edit-button"]',
  buttonSaveNote: '[data-testid=add-note-save-note-button]',
  buttonSubmit: '[data-testid=submit-button]',
  buttonTHOR: '[data-testid=detail-header-button-thor]',
  creationDate: '[data-testid=meta-list-date-value]',
  deelmeldingBlock: '[data-testid="child-incidents"] > li',
  deelmeldingBlockValue: '[data-testid="child-incidents-display-value"]',
  deelmeldingen: '[data-testid="child-incidents"]',
  deelmeldingId: '[data-testid="child-incidents-display-value"]',
  descriptionText: '[data-testid="detail-title"]',
  directingDepartment: '[data-testid="meta-list-directing_departments-value"]',
  doorlooptijd: '[data-testid=meta-list-process-time-value]',
  email: '[data-testid="detail-email-value"]',
  errorMessage: '[data-testid="error"]',
  handlingTime: '[data-testid="meta-list-handling-time-value"]',
  historyAction: '[data-testid="history-list-item-action"]',
  historyListItem: '[data-testid="history-list-item-description"]',
  imageLocation: '[data-testid=map-static-image]',
  infoText: '[data-testid=info-text]',
  inputNoteText: '[data-testid=add-note-text]',
  ktoAmounts: '[data-testid=detail-reporter-value] > div',
  labelDoorlooptijd: '[data-testid=meta-list-process-time-definition]',
  labelEmail: '[data-testid=detail-email-definition]',
  labelLocatie: '[data-testid=detail-location]',
  labelMeldigenMelder: '[data-testid="detail-reporter-definition"]',
  labelMeldingenOmgeving: '[data-testid=detail-area-definition]',
  labelOverlast: '[class*=Detail__DefinitionList] > :nth-child(1)',
  labelTelefoon: '[data-testid=detail-phone-definition]',
  labelToestemming: '[data-testid=detail-sharing-definition]',
  linkMeldingenMelder: '[data-testid="detail-reporter-value"] > a',
  linkMeldingenOmgeving: '[data-testid=detail-area-value] > a',
  linkParent: '[data-testid=meta-list-parent-link]',
  linkTerugNaarOverzicht: '[data-testid=backlink]',
  mainCategory: '[data-testid="meta-list-main-category-value"]',
  phoneNumber: '[data-testid="detail-phone-value"]',
  phoneNumberLink: '[data-testid=detail-phone-value] a',
  photo: '[data-testid="attachments-value-button"]',
  photoViewerImage: '[data-testid="attachment-viewer-image"]',
  regie: '[data-testid=meta-list-directing_departments-value] > [data-testid=value-path]',
  shareContactDetails: '[data-testid="detail-sharing-value"]',
  signalHeaderTitle: '[data-testid=detail-header-title]',
  signalId: '[data-testid=detail-header-title] > span',
  source: '[data-testid="meta-list-source-value"]',
  stadsdeel: '[data-testid="location-value-address-district"]',
  status: '[data-testid="meta-list-status-value"]',
  subCategory: '[data-testid="meta-list-subcategory-value"]',
  titleDeelmelding: '[class*= ChildIncidents__Title]',
  type: '[data-testid="meta-list-type-value"]',
  urgency: '[data-testid="meta-list-priority-value"]',
};
