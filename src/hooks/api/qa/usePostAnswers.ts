import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import type { Answer as Response } from 'types/api/qa/answer'

type Answer = {
  question_uuid: string
  payload: string
}

const usePostAnswer = () => {
  const { post: originalPost, ...rest } = useFetch<Response>()

  const post = (id: string, payload: Answer[]) =>
    originalPost(
      `${configuration.QA_SESSIONS_ENDPOINT}${id}/answers`,
      payload as any
    )

  return { post, ...rest }
}

export default usePostAnswer
