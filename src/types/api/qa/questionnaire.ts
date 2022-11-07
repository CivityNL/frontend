import type { Question } from './question'

type ExplanationSection = {
  files: []
  header: string
  text: string
}

export type Explanation = {
    title: string
    sections: ExplanationSection[]
}

export interface Questionnaire {
  explanation: Explanation
  uuid: string
  first_question: Question
  name: string
  description: string | null
  is_active: boolean
}
