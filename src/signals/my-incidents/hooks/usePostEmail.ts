// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect, useState } from 'react'

import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'

type PostEmail = (email: string) => Promise<void>

export const usePostEmail = (): [
  PostEmail,
  { errorMessage: string | null }
] => {
  const { post, error } = useFetch<null>()
  const postError = error as Response | undefined
  const [errorMessage, setErrorMessage] = useState<string>('')

  const endpoint = `${configuration.MY_SIGNALS_LOGIN_URL}`

  const postEmail = useCallback(
    (email: string) => {
      const payload = {
        email,
      }

      return post(endpoint, payload)
    },
    [endpoint, post]
  )

  useEffect(() => {
    if (postError?.status === 429) {
      setErrorMessage(
        `U hebt te vaak gevraagd om de e-mail opnieuw te versturen. Over 20 minuten kunt u het opnieuw proberen.`
      )
    } else {
      setErrorMessage('')
    }
  }, [postError])

  return [postEmail, { errorMessage }]
}
