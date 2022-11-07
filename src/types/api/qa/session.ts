import type { Question } from "./question"
import type { Explanation } from "./questionnaire"

export interface Session {
  _links: {
    'sia:questionnaire': {
      href: string
    }
    'sia:public-signal': {
      href: string
    }
  }
  questionnaire_explanation: Explanation
  path_questions: Question[]
  uuid: string
  started_at: string | null
  submit_before: string
  duration: string
  created_at: string
}
