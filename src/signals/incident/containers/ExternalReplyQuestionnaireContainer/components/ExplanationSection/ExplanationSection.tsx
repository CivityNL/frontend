import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph'


type ExplanationSectionProps = {
  title: string
  text: string
}

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`

const Section = styled.section`
  margin-bottom: ${themeSpacing(6)};
`

export const ExplanationSection: React.FunctionComponent<
  ExplanationSectionProps
> = ({ title, text }) => (
  <Section>
    <StyledHeading forwardedAs="h4">{title}</StyledHeading>
    {text.split('\n').map((line) => (
      <Paragraph gutterBottom={0}>{line}</Paragraph>
    ))}
  </Section>
)
