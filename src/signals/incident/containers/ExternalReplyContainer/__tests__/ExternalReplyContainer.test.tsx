// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { render, waitFor, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mocked } from 'jest-mock'
import * as reactRouterDom from 'react-router-dom'

import * as actions from 'containers/App/actions'
import { withAppContext } from 'test/utils'

import ExternalReplyContainer from '..'
import * as API from '../../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'
import * as constants from '../constants'

fetchMock.disableMocks()

const mockedGlobalNotification = mocked(
  actions.showGlobalNotification,
  true
).mockReturnValue({
  type: 'sia/App/SHOW_GLOBAL_NOTIFICATION',
})
jest.mock('containers/App/actions')

const mockedUseParams = mocked(reactRouterDom.useParams, true)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}))

describe('ExternalReplyContainer', () => {
  describe('active questionnaire', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        id: 'forward-to-external-questionnaire',
      }))
    })

    it('renders the external reply form correctly', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      screen.getByTestId('loadingIndicator')

      await waitFor(() => {
        // Explanation title
        screen.getByRole('heading', { name: 'Melding reactie' })

        // First explanation section
        screen.getByRole('heading', { name: 'De melding' })
        screen.getByText('Nummer: SIG-001')

        // Location
        screen.getByText('Centrum')
        screen.getByText(/herengracht 242b/i)

        // Second explanation section
        screen.getByText(/kunnen jullie deze stoeptegel vervangen\?/i)
        screen.getByRole('img', { name: /cheesecake\.jpg/i })

        // Questionnaire
        screen.getByLabelText(
          /kunt u omschrijven of en hoe de melding is opgepakt\? u mag daarbij ook een foto sturen\./i
        )
        screen.getByText(/Foto's toevoegen/)
        screen.getByRole('button', { name: 'Verstuur' })

        expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      })
    })

    it('does not submit when form is invalid', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Melding reactie' })
      })

      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Dit is een verplicht veld'
        )
      })
    })

    it('submit when form is valid', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Melding reactie' })
      })

      act(() => {
        userEvent.type(
          screen.getByLabelText(
            /kunt u omschrijven of en hoe de melding is opgepakt\? u mag daarbij ook een foto sturen\./i
          ),
          'Het is weer helemaal mooi'
        )
      })
      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.SUBMITTED_TITLE })
        screen.getByText(constants.SUBMITTED_CONTENT)
      })
    })

    it('handles file upload', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Melding reactie' })
      })

      act(() => {
        userEvent.type(
          screen.getByLabelText(
            /kunt u omschrijven of en hoe de melding is opgepakt\? u mag daarbij ook een foto sturen\./i
          ),
          'De melding is verholpen'
        )
      })

      // Upload file to file input
      const fileInput = screen.getByLabelText(/Foto's toevoegen/)
      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 }) // 1 MB
      userEvent.upload(fileInput, file)

      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.SUBMITTED_TITLE })
        screen.getByText(constants.SUBMITTED_CONTENT)
      })
    })

    it('handles errors during submit', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Melding reactie' })
      })

      act(() => {
        userEvent.type(
          screen.getByLabelText(
            /kunt u omschrijven of en hoe de melding is opgepakt\? u mag daarbij ook een foto sturen\./i
          ),
          'De melding is verholpen'
        )
      })

      mockRequestHandler({
        status: 500,
        method: 'post',
        url: API.QA_ANSWERS,
        body: {
          detail: 'Something went wrong',
        },
      })

      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))
      })

      await waitFor(() => {
        expect(mockedGlobalNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            title: constants.GENERIC_ERROR_TITLE,
            message: constants.GENERIC_ERROR_CONTENT,
          })
        )
      })
    })

    describe('location', () => {
      it('handles showing and hiding the interactive map', async () => {
        render(withAppContext(<ExternalReplyContainer />))

        await waitFor(() => {
          screen.getByRole('heading', { name: 'Melding reactie' })
        })

        act(() => {
          userEvent.click(screen.getByTestId('map-thumbnail-button'))
        })

        expect(screen.getByTestId('interactive-map')).toBeInTheDocument()

        userEvent.click(screen.getByTestId('closeButton'))

        expect(screen.queryByTestId('interactive-map')).not.toBeInTheDocument()
      })
    })

    describe('attachments viewer', () => {
      it('handles showing and hiding the attachments viewer', async () => {
        render(withAppContext(<ExternalReplyContainer />))

        await waitFor(() => {
          screen.getByRole('heading', { name: 'Melding reactie' })
        })

        userEvent.click(screen.getByRole('img', { name: /cheesecake\.jpg/i }))

        expect(
          screen.getByTestId('attachment-viewer-image')
        ).toBeInTheDocument()

        userEvent.click(screen.getByTestId('closeBtn'))

        expect(
          screen.queryByTestId('attachment-viewer-image')
        ).not.toBeInTheDocument()
      })
    })
  })

  describe('expired questionnaire', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        id: 'expired',
      }))
    })
    it('should render the correct message', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.INACCESSIBLE_TITLE })
        screen.getByText(constants.INACCESSIBLE_CONTENT)
      })
    })
  })

  describe('previously submitted questionnaire', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        id: 'locked',
      }))
    })

    it('should render the correct message', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', {
          name: constants.SUBMITTED_PREVIOUSLY_TITLE,
        })
        screen.getByText(constants.SUBMITTED_PREVIOUSLY_CONTENT)
      })
    })
  })

  describe('invalid uuid', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        id: 'invalid-uuid',
      }))
    })

    it('should render the correct message', async () => {
      render(withAppContext(<ExternalReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.GENERIC_ERROR_TITLE })
        screen.getByText(constants.GENERIC_ERROR_CONTENT)
      })
    })
  })
})
