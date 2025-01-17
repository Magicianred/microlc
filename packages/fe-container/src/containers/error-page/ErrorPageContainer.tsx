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

import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'

import './ErrorPageContainer.less'

const errorProps = {
  children: PropTypes.any.isRequired,
  descriptionKeys: PropTypes.array.isRequired,
  titleKey: PropTypes.string.isRequired
}

type ErrorProps = PropTypes.InferProps<typeof errorProps>

export const ErrorPageContainer: React.FC<ErrorProps> = ({children, titleKey, descriptionKeys}) => {
  const descriptionMapper = useCallback((descriptionKey: string) => {
    return (
      <div className='descriptionMessage' key={descriptionKey}>
        <FormattedMessage id={descriptionKey}/>
      </div>
    )
  }, [])

  return (
    <div className='errorPage_container'>
      {children}
      <p className='mainMessage'>
        <FormattedMessage id={titleKey}/>
      </p>
      {descriptionKeys.map(descriptionMapper)}
    </div>
  )
}

ErrorPageContainer.propTypes = errorProps
