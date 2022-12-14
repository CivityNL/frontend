import { renderHook } from '@testing-library/react-hooks'
import * as reactRedux from 'react-redux'

import questionnaireFixture from '../../../../../../internals/mocks/fixtures/qa-forward-to-external-questionnaire.json'
import useExternalReplyQuestionnaire from '../useExternalReplyQuestionnaire'

fetchMock.disableMocks()

const dispatch = jest.fn()
jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

// Fixture includes a single attachment to be shown to the user
const attachment =
  questionnaireFixture.questionnaire_explanation.sections[2].files[0]

describe('useExternalReplyQuestionnaire', () => {
  it('returns a questionnaire', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useExternalReplyQuestionnaire('forward-to-external-questionnaire')
    )

    expect(result.current).toMatchObject({
      attachments: [],
      explanation: undefined,
      isFetchingQuestionnaire: true,
      isSubmittingForm: false,
      location: undefined,
      questionnaireErrorMessage: undefined,
      questions: undefined,
      submit: expect.any(Function),
      submitQuestionnaireSuccessMessage: undefined,
    })

    await waitForNextUpdate()

    expect(result.current).toMatchObject({
      attachments: [{ location: attachment.file }],
      explanation: questionnaireFixture.questionnaire_explanation,
      isFetchingQuestionnaire: false,
      isSubmittingForm: false,
      location: questionnaireFixture.location,
      questions: questionnaireFixture.path_questions,
      submit: expect.any(Function),
      submitQuestionnaireSuccessMessage: undefined,
    })
  })
})
