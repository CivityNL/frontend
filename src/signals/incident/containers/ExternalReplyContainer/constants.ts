// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
/**
 * Possible responses
 */
export const EXPIRED_STATUS = 410
export const EXPIRED_DETAIL = 'Expired!'

export const INCORRECT_STATUS_STATUS = 500
export const INCORRECT_STATUS_DETAIL = 'associated signal not in state'

export const SUBMITTED_PREVIOUSLY_STATUS = 410
export const SUBMITTED_PREVIOUSLY_DETAIL = 'Already used!'

/**
 * Notices
 */
export const INACCESSIBLE_TITLE = 'U kunt niet meer reageren op onze vragen'
export const INACCESSIBLE_CONTENT =
  'Deze link is vervallen, de melding is inmiddels afgehandeld'

export const SUBMITTED_PREVIOUSLY_TITLE =
  'U hebt onze vragen al eerder beantwoord'
export const SUBMITTED_PREVIOUSLY_CONTENT =
  'Wij bedanken u nogmaals voor de extra informatie die u ons hebt gegeven.'

export const SUBMITTED_TITLE = 'Bedankt'
export const SUBMITTED_CONTENT =
  'Bedankt voor het invullen van het actieformulier. Uw informatie helpt ons bij het verwerken van de melding.'

export const GENERIC_ERROR_TITLE = 'Er is iets misgegaan'
export const GENERIC_ERROR_CONTENT = 'Probeer het later nog eens.'
