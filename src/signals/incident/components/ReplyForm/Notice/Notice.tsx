// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import {
  Column,
  Heading,
  Paragraph,
  Row,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'

const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

interface PageProps {
  title: string
  content: string
}

const Notice: FunctionComponent<PageProps> = ({ content, title }) => (
  <Row>
    <Column span={12}>
      <div>
        <StyledHeading>{title}</StyledHeading>
        <Paragraph>{content}</Paragraph>
      </div>
    </Column>
  </Row>
)

export default Notice
