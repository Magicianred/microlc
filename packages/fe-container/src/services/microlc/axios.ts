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
import axios, {AxiosRequestConfig} from 'axios'
import {Observable} from 'rxjs'
import {fromPromise} from 'rxjs/internal-compatibility'
import {map} from 'rxjs/operators'

const microlcAxiosConfig: AxiosRequestConfig = {
  baseURL: '/',
  responseType: 'json'
}

const axiosInstance = axios.create(microlcAxiosConfig)
axiosInstance.interceptors.response.use(
  undefined,
  (error) => {
    // eslint-disable-next-line
    throw {errorStatusCode: error.response.status}
  })

export const extractDataFromGet: <T>(url: string) => Observable<T> = (url) => {
  return fromPromise(axiosInstance.get(url))
    .pipe(
      map(response => response.data)
    )
}

export default axiosInstance
