// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useEffect, useCallback, useMemo, useState } from 'react'

import { Column, Row } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import useGetSession from 'hooks/api/qa/useGetSession'
import { usePostAnswer } from 'hooks/api/qa/usePostAnswer'
import useFetch from 'hooks/useFetch'
import type { FetchError } from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'

import { ExplanationSection } from './components/ExplanationSection/ExplanationSection'
import Notice from './components/Notice/Notice'
import QuestionnaireComponent from './components/Questionnaire'
import * as constants from './constants'
import { StyledHeading, Wrapper } from './styled'
import type { FormAnswer } from './types'

const IncidentReplyContainer = () => {
  const { uuid: sessionUuid } = useParams<{ uuid: string }>()
  const dispatch = useDispatch()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [submitFormError, setSubmitFormError] = useState(false)

  const { post: postAnswer, error: postAnswerError } = usePostAnswer()

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
        if (!session || !session.uuid) throw 'No session uuid'

        setIsSubmittingForm(true)

        // The reply flow includes a single question
        const answer = answers[0]

        // The reply flow includes a single file input component
        // const files = answers.find(
        //   (answer) => answer.fieldType === FieldType.FileInput
        // )?.value as FileList

        // TODO submit
        // if (files.length) {
        //   await filesUpload({
        //     url: `${configuration.INCIDENT_PUBLIC_ENDPOINT}${incident.signal_id}/attachments/`,
        //     files,
        //   })
        // }

        await postAnswer(sessionUuid, answer.uuid, answer.value)
        await submitQuestionnaire(
          `${configuration.QA_SESSIONS_ENDPOINT}${session.uuid}/submit`
        )
      } catch (error) {
        setSubmitFormError(true)
      } finally {
        setIsSubmittingForm(false)
      }
    },
    [postAnswer, session, sessionUuid, submitQuestionnaire]
  )

  useEffect(() => {
    getSession(sessionUuid)
  }, [getSession, sessionUuid])

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

  return (
    <Row>
      <Column span={8}>
        <Wrapper>
          <StyledHeading>
            {session.questionnaire_explanation.title}
          </StyledHeading>
          {session.questionnaire_explanation.sections.map((section) => (
            <ExplanationSection
              key={section.header}
              title={section.header}
              text={section.text}
            />
          ))}
          <QuestionnaireComponent
            onSubmit={submit}
            questions={session.path_questions}
          />
        </Wrapper>
      </Column>
    </Row>
  )
}

export default IncidentReplyContainer
