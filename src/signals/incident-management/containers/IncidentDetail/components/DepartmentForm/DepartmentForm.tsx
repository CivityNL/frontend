// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useCallback, useState, useEffect } from 'react'

import { Label, Select } from '@amsterdam/asc-ui'
import ErrorMessage, { ErrorWrapper } from 'components/ErrorMessage'
import Input from 'components/Input'
import LoadingIndicator from 'components/LoadingIndicator'
import TextArea from 'components/TextArea'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { useFetch, useEventEmitter } from 'hooks'
import { useDispatch } from 'react-redux'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

// import IncidentDetailContext from '../../context'
import type { EmailTemplate } from '../../types'
import EmailPreview from '../StatusForm/components/EmailPreview/EmailPreview'
import {
  Form,
  StyledButton,
  StyledH4,
  StyledLabel,
  StyledModal,
  StyledSection,
} from './styled'

const MAX_MESSAGE_LENGTH = 3000

interface DepartmentFormProps {
  onClose: () => void
  departments: Record<string, any>[]
  routingDepartments: Record<string, any>[]
}

let lastActiveElement: HTMLElement | null = null

const DepartmentForm: FunctionComponent<DepartmentFormProps> = ({
  onClose,
  departments,
  routingDepartments,
}) => {
  // const { incident, update } = useContext(IncidentDetailContext)
  const storeDispatch = useDispatch()
  const { listenFor, unlisten } = useEventEmitter()

  const [modalEmailPreviewIsOpen, setModalEmailPreviewIsOpen] = useState(false)
  const [isExternal, setIsExternal] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({})

  const {
    // post: getEmailTemplate,
    data: emailTemplate,
    error: emailTemplateError,
    isLoading,
  } = useFetch<EmailTemplate>()

  const closeEmailPreview = useCallback(() => {
    enablePageScroll()
    setModalEmailPreviewIsOpen(false)

    if (lastActiveElement) {
      lastActiveElement.focus()
    }
  }, [setModalEmailPreviewIsOpen])

  const openEmailPreviewModal = useCallback(() => {
    disablePageScroll()
    setModalEmailPreviewIsOpen(true)
    lastActiveElement = document.activeElement as HTMLElement
  }, [setModalEmailPreviewIsOpen])

  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === 27) {
        closeEmailPreview()
      }
    },
    [closeEmailPreview]
  )

  const onUpdate = useCallback(() => {
    // const textValue = state.text.value || state.text.defaultValue
    // update({
    //   type: PATCH_TYPE_STATUS,
    //   patch: {
    //     status: {
    //       state: state.status.key,
    //       text: textValue,
    //       send_email: state.check.checked,
    //     },
    //   },
    // })

    closeEmailPreview()
    onClose()
  }, [closeEmailPreview, onClose])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()

      const errors = {
        email:
          !email && message
            ? 'Dit veld is verplicht voor het versturen van een melding'
            : !email.includes('@')
            ? 'Dit is geen geldig e-mail adres'
            : '',
        message:
          !message && email
            ? 'Dit veld is verplicht voor het versturen van een melding'
            : message.length > MAX_MESSAGE_LENGTH
            ? `Je hebt meer dan de maximale ${MAX_MESSAGE_LENGTH} tekens ingevoerd.`
            : '',
      }
      setErrorMessages(errors)
      const isFormValid = !errors.email && !errors.message

      if (isExternal && isFormValid) {
        // getEmailTemplate(
        //   `${configuration.INCIDENTS_ENDPOINT}${incident.id}/email/preview`,
        //   {
        //     status: state.status.key,
        //     text: textValue,
        //   }
        // )
      } else if (!isExternal) {
        onUpdate()
      }
    },
    [email, message, isExternal, onUpdate]
  )

  const onDepartmentChange = useCallback((event) => {
    const selectedId = parseInt(event.target.value)
    const selectedDepartment = departments.find(
      (department) => department.id === selectedId
    )
    setIsExternal(!selectedDepartment?.isExternal)
    // setEmailIsNotSend(
    //   event.target.value === StatusCode.Afgehandeld &&
    //     state.status.key === StatusCode.VerzoekTotHeropenen
    // )
    // const selectedStatus = changeStatusOptionList.find(
    //   (status) => event.target.value === status.key
    // )
    // selectedStatus && dispatch({ type: 'SET_STATUS', payload: selectedStatus })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEmailChange = useCallback(
    ({ target }) => {
      setEmail(target.value)
      const { email, ...errors } = errorMessages
      setErrorMessages(errors)
    },
    [errorMessages]
  )

  const onMessageChange = useCallback(
    ({ target }) => {
      setMessage(target.value)
      const { message, ...errors } = errorMessages
      setErrorMessages(errors)
    },
    [errorMessages]
  )

  useEffect(() => {
    listenFor('keydown', escFunction)
    return () => {
      unlisten('keydown', escFunction)
    }
  }, [escFunction, listenFor, unlisten])

  useEffect(() => {
    if (!emailTemplate) return

    if (emailTemplate?.html) {
      openEmailPreviewModal()
      // dispatch({ type: 'SET_EMAIL_TEMPLATE', payload: emailTemplate })
    }
  }, [emailTemplate, openEmailPreviewModal])

  useEffect(() => {
    if (emailTemplateError) {
      storeDispatch(
        showGlobalNotification({
          title:
            'Er is geen email template beschikbaar voor de gegeven statustransitie',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [emailTemplateError, storeDispatch])

  return (
    <Form onSubmit={handleSubmit} data-testid="statusForm" noValidate>
      <StyledH4 forwardedAs="h2">Afdeling wijzigen</StyledH4>

      <StyledSection>
        <StyledLabel htmlFor="department" label="Afdeling" />
        <Select
          data-testid="selectDepartment"
          id="department"
          onChange={onDepartmentChange}
        >
          {!routingDepartments.length && (
            <option key={null}>Niet gekoppeld</option>
          )}
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>
      </StyledSection>

      {isExternal && (
        <>
          <StyledSection>
            <ErrorWrapper invalid={Boolean(errorMessages.email)}>
              <Label
                label={
                  <>
                    <strong>E-mail behandelaar</strong>
                    {!message && <span>&nbsp;(niet verplicht)</span>}
                  </>
                }
              />
              <ErrorMessage message={errorMessages.email} />
              <Input required={true} onChange={onEmailChange} value={email} />
            </ErrorWrapper>
          </StyledSection>
          <StyledSection>
            <ErrorWrapper invalid={Boolean(errorMessages.message)}>
              <Label
                label={
                  <>
                    <strong>Toelichting behandelaar</strong>
                    {!email && <span>&nbsp;(niet verplicht)</span>}
                  </>
                }
              />
              <ErrorMessage message={errorMessages.message} />
              <TextArea
                maxContentLength={MAX_MESSAGE_LENGTH}
                rows={12}
                value={message}
                onChange={onMessageChange}
              />
            </ErrorWrapper>
          </StyledSection>
        </>
      )}
      <div>
        <StyledButton
          data-testid="statusFormSubmitButton"
          type="submit"
          variant="secondary"
        >
          {email || message ? 'Verstuur' : 'Opslaan'}
        </StyledButton>

        <StyledButton
          data-testid="statusFormCancelButton"
          variant="tertiary"
          onClick={onClose}
        >
          Annuleer
        </StyledButton>
        {modalEmailPreviewIsOpen && (
          <StyledModal
            data-testid="emailPreviewModal"
            open
            onClose={closeEmailPreview}
            title="Email Preview"
          >
            {isLoading && <LoadingIndicator />}
            {emailTemplate?.html && (
              <EmailPreview
                emailBody={emailTemplate.html}
                onClose={closeEmailPreview}
                onUpdate={onUpdate}
              />
            )}
          </StyledModal>
        )}
      </div>
    </Form>
  )
}

export default DepartmentForm
