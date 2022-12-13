import { useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'

import type { Attachment } from 'components/AttachmentViewer/AttachmentViewer'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch } from 'hooks'
import usePostAnswers from 'hooks/api/qa/usePostAnswers'
import { useBuildGetter } from 'hooks/api/useBuildGetter'
import configuration from 'shared/services/configuration/configuration'
import { FieldType } from 'types/api/qa/question'
import type { Session } from 'types/api/qa/session'

import * as constants from './constants'
import type { FormAnswer } from './types'

const useQuestionnaire = (id: string) => {
  const dispatch = useDispatch()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [submitFormError, setSubmitFormError] = useState(false)

  const {
    get: getQuestionnaireSession,
    error: questionnaireSessionError,
    isLoading,
    data: questionnaireData,
  } = useBuildGetter<Session>((id: string) => [
    `${configuration.QA_SESSIONS_ENDPOINT}${id}`,
  ])

  const { post: postAnswers, error: postAnswerError } = usePostAnswers()

  useEffect(() => {
    getQuestionnaireSession(id)
  }, [getQuestionnaireSession, id])

  const sessionErrorMessage = useMemo(() => {
    if (!questionnaireSessionError) return null

    const status = (questionnaireSessionError as Response)?.status

    switch (status) {
      case constants.EXPIRED_STATUS:
        return {
          title: constants.INACCESSIBLE_TITLE,
          content: constants.INACCESSIBLE_CONTENT,
        }
      case constants.SUBMITTED_PREVIOUSLY_STATUS:
        return {
          title: constants.SUBMITTED_PREVIOUSLY_TITLE,
          content: constants.SUBMITTED_PREVIOUSLY_CONTENT,
        }
      case constants.INCORRECT_STATUS_STATUS:
        return {
          title: constants.INACCESSIBLE_TITLE,
          content: constants.INACCESSIBLE_CONTENT,
        }
      default:
        return {
          title: constants.GENERIC_ERROR_TITLE,
          content: constants.GENERIC_ERROR_CONTENT,
        }
    }
  }, [questionnaireSessionError])

  const {
    post: submitQuestionnaire,
    isSuccess: isSubmitted,
    error: submitError,
  } = useFetch()

  const sessionSubmittedMessage = isSubmitted
    ? {
        title: constants.SUBMITTED_TITLE,
        content: constants.SUBMITTED_CONTENT,
      }
    : null

  const submit = async (answers: FormAnswer[]) => {
    try {
      setSubmitFormError(false)
      if (!questionnaireData || !id) throw 'No session uuid'

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
          questionnaireData._links['sia:post-attachments'].href,
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
        id,
        answers.map((answer) => ({
          payload: answer.value as string,
          question_uuid: answer.uuid,
        }))
      )

      await submitQuestionnaire(
        questionnaireData._links['sia:post-submit'].href
      )
    } catch (error) {
      setSubmitFormError(true)
    } finally {
      setIsSubmittingForm(false)
    }
  }

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

  const attachments =
    questionnaireData?.questionnaire_explanation.sections.reduce(
      (previous, current) => [
        ...previous,
        ...current.files.map(({ file }) => ({
          location: file,
        })),
      ],
      [] as Attachment[]
    ) || []

  return {
    isLoading: isLoading || isSubmittingForm,
    location: questionnaireData?.location,
    explanation: questionnaireData?.questionnaire_explanation,
    questions: questionnaireData?.path_questions,
    attachments,
    sessionErrorMessage,
    sessionSubmittedMessage,
    submit,
  }
}

export default useQuestionnaire
