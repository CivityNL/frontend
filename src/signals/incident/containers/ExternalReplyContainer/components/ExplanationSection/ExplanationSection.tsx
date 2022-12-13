import { Heading, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph'

type File = {
  description: string
  file: string
}

type ExplanationSectionProps = {
  title: string
  text: string | null
  files?: File[]
  onSelectFile?: (file: File) => void
}

const ImageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeSpacing(2)};
  margin-top: ${themeSpacing(2)};
`

const Image = styled.img`
  width: 100px;
  object-fit: cover;
  :hover {
    cursor: pointer;
    outline: 1px solid ${themeColor('tint', 'level6')};
  }
`

const StyledHeading = styled(Heading)`
  margin-bottom: 0;
`

const Section = styled.section`
  margin-bottom: ${themeSpacing(6)};
`

const ExplanationSection = ({
  title,
  text,
  files = [],
  onSelectFile,
}: ExplanationSectionProps) => {
  const handleImageKeyPress: (
    file: File
  ) => React.KeyboardEventHandler<HTMLElement> = (file) => (event) => {
    if (event.key === 'Enter' && onSelectFile) {
      onSelectFile(file)
    }
  }
  return (
    <Section>
      <StyledHeading forwardedAs="h4">{title}</StyledHeading>
      {text
        ? text.split('\n').map((line) => (
            <Paragraph key={line} gutterBottom={0}>
              {line}
            </Paragraph>
          ))
        : null}

      {files ? (
        <ImageWrapper>
          {files.map((file) => (
            <Image
              tabIndex={0}
              onKeyDown={handleImageKeyPress(file)}
              onClick={() => {
                if (onSelectFile) {
                  onSelectFile(file)
                }
              }}
              key={file.description}
              src={file.file}
              alt={file.description}
            />
          ))}
        </ImageWrapper>
      ) : null}
    </Section>
  )
}

export default ExplanationSection
