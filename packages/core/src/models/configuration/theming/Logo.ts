/*
 * Copyright 2021 Mia srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {FromSchema} from 'json-schema-to-ts'

export const logoSchema = {
  type: 'object',
  properties: {
    url_light: {
      type: 'string',
      description: 'Light logo url',
    },
    url_dark: {
      type: 'string',
      description: 'Dark logo url',
    },
    alt: {
      type: 'string',
      description: 'Logo alt',
    },
  },
  required: ['url_light', 'alt'],
} as const

export type Logo = FromSchema<typeof logoSchema>
