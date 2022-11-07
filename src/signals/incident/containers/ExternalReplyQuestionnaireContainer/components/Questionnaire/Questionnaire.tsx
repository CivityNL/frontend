// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import { useForm } from 'react-hook-form'
import type { FieldError } from 'react-hook-form'
import styled from 'styled-components'

import type { Question } from 'types/api/qa/question'
import { FieldType } from 'types/api/qa/question'

import type { FormAnswer, FormData } from '../../types'
import FileInput from '../FileInput'
import Submit from '../Submit'
import TextArea from '../TextArea'

const QuestionsWrapper = styled.div`
  > * {
    margin-bottom: ${themeSpacing(8)};
  }
`

const componentMap: Record<FieldType, (props: any) => any> = {
  [FieldType.PlainText]: TextArea,
  [FieldType.FileInput]: FileInput,
}

interface QuestionnaireProps {
  onSubmit: (state: FormAnswer[]) => void
  questions: Question[]
}

const Questionnaire: FunctionComponent<QuestionnaireProps> = ({
  questions,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    trigger,
  } = useForm<FormData>()

  const submitForm = (data: FormData) => {
    onSubmit(
      Object.keys(data).map((key) => ({
        uuid: key,
        value: data[key],
        fieldType: questions.find(({ uuid }) => uuid == key)
          ?.field_type,
      }))
    )
  }

  const questionsComponent = questions.map((question) => {
    const Component = componentMap[question.field_type]

    return (
      <Component
        control={control}
        trigger={trigger}
        register={register}
        label={question.short_label}
        helpText={question.label}
        id={question.uuid}
        errorMessage={(errors[question.uuid] as FieldError)?.message}
        key={question.uuid}
      />
    )
  })

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <QuestionsWrapper>{questionsComponent}</QuestionsWrapper>
      <Submit />
    </form>
  )
}

export default Questionnaire
