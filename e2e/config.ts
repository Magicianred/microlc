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

import {ChromiumEnv, FirefoxEnv, setConfig, test, WebKitEnv, PlaywrightOptions} from '@playwright/test'
// @ts-ignore
import path from 'path'

setConfig({
  testDir: path.join(__dirname, '__tests__'),
  workers: 1,
  timeout: 10000,
})

const options: PlaywrightOptions = {
  headless: true,
  viewport: {width: 1920, height: 1080},
}

test.runWith(new ChromiumEnv(options), {tag: 'chromium'});
test.runWith(new FirefoxEnv(options), {tag: 'firefox'});
test.runWith(new WebKitEnv(options), {tag: 'webkit'});
