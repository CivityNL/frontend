export enum FieldType {
  PlainText = 'plain_text',
  // FileInput = 'file_input',
  FileInput = 'image',
}

export interface Question {
  // TODO check if reaction requested questionnaire also contains analysis_key
  analysis_key: string
  key: string | null
  uuid: string
  label: string
  short_label: string
  field_type: FieldType
  next_rules: string | null
  required: boolean
}
