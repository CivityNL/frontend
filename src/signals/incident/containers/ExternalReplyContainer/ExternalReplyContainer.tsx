// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { useEffect, useCallback, useMemo, useState } from 'react'

import { Column } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import AttachmentViewer from 'components/AttachmentViewer'
import type { Attachment } from 'components/AttachmentViewer/AttachmentViewer'
import CloseButton from 'components/CloseButton'
import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import useGetSession from 'hooks/api/qa/useGetSession'
import usePostAnswers from 'hooks/api/qa/usePostAnswers'
import useFetch from 'hooks/useFetch'
import type { FetchError } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import { FieldType } from 'types/api/qa/question'

import Notice from '../../components/ReplyForm/Notice'
import QuestionnaireComponent from '../../components/ReplyForm/Questionnaire'
import ExplanationSection from './components/ExplanationSection'
import Location from './components/Location'
import * as constants from './constants'
import { StyledHeading, Wrapper, Map, MapRow, QuestionnaireRow } from './styled'
import type { FormAnswer } from './types'

const ExternalReplyContainer = () => {
  const { id: sessionId } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [submitFormError, setSubmitFormError] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedAttachmentViewerImage, setSelectedAttachmentViewerImage] =
    useState('')

  const { post: postAnswers, error: postAnswerError } = usePostAnswers()

  const {
    post: submitQuestionnaire,
    isSuccess: isSubmitted,
    error: submitError,
  } = useFetch()

  const {
    data: session,
    get: getSession,
    error: sessionError,
    isLoading: sessionIsLoading,
  } = useGetSession()

  const showSpecificErrorMessage =
    sessionError && typeof sessionError !== 'boolean'

  const isExpired = useMemo(
    () =>
      showSpecificErrorMessage &&
      (sessionError as Response).status === constants.EXPIRED_STATUS &&
      (sessionError as FetchError).detail?.includes(constants.EXPIRED_DETAIL),
    [sessionError, showSpecificErrorMessage]
  )

  const isIncorrectStatus = useMemo(
    () =>
      showSpecificErrorMessage &&
      (sessionError as Response).status === constants.INCORRECT_STATUS_STATUS &&
      (sessionError as FetchError).detail?.includes(
        constants.INCORRECT_STATUS_DETAIL
      ),
    [sessionError, showSpecificErrorMessage]
  )

  const isSubmittedPreviously = useMemo(
    () =>
      showSpecificErrorMessage &&
      (sessionError as Response).status ===
        constants.SUBMITTED_PREVIOUSLY_STATUS &&
      (sessionError as FetchError).detail?.includes(
        constants.SUBMITTED_PREVIOUSLY_DETAIL
      ),
    [sessionError, showSpecificErrorMessage]
  )

  const submit = useCallback(
    async (answers: FormAnswer[]) => {
      try {
        setSubmitFormError(false)
        if (!session || !sessionId) throw 'No session uuid'

        setIsSubmittingForm(true)

        // The reply flow includes a single file input component
        const attachmentsQuestion = answers.find(
          (answer) => answer.fieldType === FieldType.FileInput
        )

        if (!attachmentsQuestion) return

        if ((attachmentsQuestion.value as FileList).length) {
          const formData = new FormData()
          const files = attachmentsQuestion.value as FileList
          Array.from(files).map((file) => {
            formData.append('file', file)
          })

          formData.append('question_uuid', attachmentsQuestion.uuid)

          const response = await fetch(
            `${configuration.QA_SESSIONS_ENDPOINT}${sessionId}/attachments`,
            {
              body: formData,
              method: 'POST',
            }
          )

          if (!response.ok) {
            dispatch(
              showGlobalNotification({
                title: constants.GENERIC_ERROR_TITLE,
                message: "Er is iets misgegaan bij het uploaden van de foto's",
                variant: VARIANT_ERROR,
                type: TYPE_LOCAL,
              })
            )
            throw new Error('Failed to upload files')
          }
        }

        await postAnswers(
          sessionId,
          answers.map((answer) => ({
            payload: answer.value as string,
            question_uuid: answer.uuid,
          }))
        )

        await submitQuestionnaire(
          `${configuration.QA_SESSIONS_ENDPOINT}${sessionId}/submit`
        )
      } catch (error) {
        setSubmitFormError(true)
      } finally {
        setIsSubmittingForm(false)
      }
    },
    [dispatch, postAnswers, session, sessionId, submitQuestionnaire]
  )

  useEffect(() => {
    getSession(sessionId)
  }, [getSession, sessionId])

  useEffect(() => {
    if (submitError || submitFormError || postAnswerError) {
      dispatch(
        showGlobalNotification({
          title: constants.GENERIC_ERROR_TITLE,
          message: constants.GENERIC_ERROR_CONTENT,
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [dispatch, postAnswerError, submitError, submitFormError])

  if (isExpired || isIncorrectStatus) {
    return (
      <Notice
        title={constants.INACCESSIBLE_TITLE}
        content={constants.INACCESSIBLE_CONTENT}
      />
    )
  }

  if (isSubmittedPreviously) {
    return (
      <Notice
        title={constants.SUBMITTED_PREVIOUSLY_TITLE}
        content={constants.SUBMITTED_PREVIOUSLY_CONTENT}
      />
    )
  }

  if (sessionError) {
    // Shown in case of errors other than locked/expired session
    return (
      <Notice
        title={constants.GENERIC_ERROR_TITLE}
        content={constants.GENERIC_ERROR_CONTENT}
      />
    )
  }

  if (isSubmitted) {
    return (
      <Notice
        title={constants.SUBMITTED_TITLE}
        content={constants.SUBMITTED_CONTENT}
      />
    )
  }

  if (sessionIsLoading || isSubmittingForm) {
    return <LoadingIndicator />
  }

  if (!session) return null

  const allAttachments = session.questionnaire_explanation.sections.reduce(
    (previous, current) => [
      ...previous,
      ...current.files.map(({ file }) => ({
        location: file,
      })),
    ],
    [] as Attachment[]
  )

  return (
    <>
      <QuestionnaireRow hidden={showMap}>
        <Column span={8}>
          <Wrapper>
            <StyledHeading>
              {session.questionnaire_explanation.title}
            </StyledHeading>

            <ExplanationSection
              title={session.questionnaire_explanation.sections[0].header}
              text={session.questionnaire_explanation.sections[0].text}
              onSelectFile={({ file }) =>
                setSelectedAttachmentViewerImage(file)
              }
            />

            {session.location && (
              <Location
                location={session.location}
                onClick={() => setShowMap(true)}
              />
            )}

            {session.questionnaire_explanation.sections
              .slice(1)
              .map((section) => (
                <ExplanationSection
                  key={section.header}
                  title={section.header}
                  text={section.text}
                  files={section.files}
                  onSelectFile={({ file }) =>
                    setSelectedAttachmentViewerImage(file)
                  }
                />
              ))}

            <QuestionnaireComponent
              onSubmit={submit}
              questions={session.path_questions}
            />
          </Wrapper>
        </Column>
      </QuestionnaireRow>

      {showMap && (
        <MapRow>
          <Map value={{ geometrie: session.location.geometrie }} />
          <CloseButton close={() => setShowMap(false)} />
        </MapRow>
      )}

      {selectedAttachmentViewerImage && (
        <AttachmentViewer
          attachments={allAttachments}
          href={selectedAttachmentViewerImage}
          onClose={() => setSelectedAttachmentViewerImage('')}
        />
      )}
    </>
  )
}

export default ExternalReplyContainer
