// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import styled from 'styled-components'
import TextAreaComponent from 'components/TextArea'
import type { FieldProps } from '../../types'
import { Heading } from '@amsterdam/asc-ui'
import Paragraph from 'components/Paragraph/Paragraph'

export const DEFAULT_MAX_LENGTH = 1000
const DEFAULT_ROWS = 6

const StyledHelpText = styled(Paragraph).attrs({
  light: true,
})`
  white-space: pre-wrap;
  word-break: break-word;
`

const Label = styled(Heading).attrs({
  forwardedAs: 'h4',
})`
  && {
    margin-bottom: 0;
  }
`


const TextArea: FunctionComponent<FieldProps> = ({
  errorMessage,
  helpText,
  label,
  id,
  control,
  register,
  rules,
}) => {
  const value = useWatch({
    control,
    name: id,
    defaultValue: '',
  }) as string
  const maxLength = rules?.maxLength ?? DEFAULT_MAX_LENGTH

  const infoText = useMemo(
    () => `${value.length}/${maxLength} tekens`,
    [maxLength, value.length]
  )

  const HelpText = <StyledHelpText>{helpText}</StyledHelpText>

  return (
    <>
      <Label forwardedAs="h4">{label}</Label>
      <TextAreaComponent
        errorMessage={errorMessage}
        name={id}
        id={id}
        infoText={infoText}
        label={HelpText}
        rows={DEFAULT_ROWS}
        {...register(id, {
          validate: {
            required: (value: string) => {
              if (!value.trim()) {
                return 'Dit is een verplicht veld'
              }
            },
          },
          maxLength: {
            message: `U heeft meer dan de maximale ${maxLength} tekens ingevoerd`,
            value: maxLength,
          },
        })}
      />
    </>
  )
}

export default TextArea
