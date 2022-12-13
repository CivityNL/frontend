// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { useState } from 'react'

import { Column } from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'

import AttachmentViewer from 'components/AttachmentViewer'
import CloseButton from 'components/CloseButton'
import LoadingIndicator from 'components/LoadingIndicator'

import Notice from '../../components/ReplyForm/Notice'
import QuestionnaireComponent from '../../components/ReplyForm/Questionnaire'
import ExplanationSection from './components/ExplanationSection'
import Location from './components/Location'
import {
  StyledHeading,
  Wrapper,
  Map,
  MapRow,
  QuestionnaireRow,
  StyledExplanationSection,
} from './styled'
import useQuestionnaire from './useQuestionnaire'

const ExternalReplyContainer = () => {
  const { id } = useParams<{ id: string }>()
  const [showMap, setShowMap] = useState(false)
  const [selectedAttachmentViewerImage, setSelectedAttachmentViewerImage] =
    useState('')

  const {
    explanation,
    isLoading,
    location,
    questions,
    sessionErrorMessage,
    sessionSubmittedMessage,
    submit,
    attachments,
  } = useQuestionnaire(id)

  if (sessionErrorMessage) {
    return (
      <Notice
        title={sessionErrorMessage.title}
        content={sessionErrorMessage.content}
      />
    )
  }

  if (sessionSubmittedMessage) {
    return (
      <Notice
        title={sessionSubmittedMessage.title}
        content={sessionSubmittedMessage.content}
      />
    )
  }

  if (isLoading) return <LoadingIndicator />
  if (!explanation || !questions) return null

  return (
    <>
      <QuestionnaireRow hidden={showMap}>
        <Column span={8}>
          <Wrapper>
            <StyledHeading>{explanation.title}</StyledHeading>

            <StyledExplanationSection
              title={explanation.sections[0].header}
              text={explanation.sections[0].text}
            />

            {location && (
              <Location location={location} onClick={() => setShowMap(true)} />
            )}

            {explanation.sections.slice(1).map((section) => (
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

            <QuestionnaireComponent onSubmit={submit} questions={questions} />
          </Wrapper>
        </Column>
      </QuestionnaireRow>

      {showMap && location && (
        <MapRow>
          <Map value={{ geometrie: location.geometrie }} />
          <CloseButton close={() => setShowMap(false)} />
        </MapRow>
      )}

      {selectedAttachmentViewerImage && (
        <AttachmentViewer
          attachments={attachments}
          href={selectedAttachmentViewerImage}
          onClose={() => setSelectedAttachmentViewerImage('')}
        />
      )}
    </>
  )
}

export default ExternalReplyContainer
