// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Heading, Modal, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import Button from 'components/Button'
import styled from 'styled-components'

export const Form = styled.form`
  position: relative;
  padding: ${themeSpacing(5, 5, 6, 5)};
  margin: ${themeSpacing(6)} 0;
  background-color: ${themeColor('tint', 'level2')};

  @media (min-width: ${({ theme }) => theme.layouts.big.max}px) {
    margin-left: ${themeSpacing(23)};
  }
`

export const StyledButton = styled(Button)`
  margin-right: ${themeSpacing(2)};
`

export const StyledH4 = styled(Heading)`
  margin-bottom: ${themeSpacing(4)};
  margin-top: ${themeSpacing(0)};
`

export const StyledModal = styled(Modal)`
  overflow: hidden;
  height: 75%;
`

export const StyledSection = styled.section`
  margin-bottom: ${themeSpacing(6)};
`
