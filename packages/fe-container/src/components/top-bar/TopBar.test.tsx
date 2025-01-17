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
import React from 'react'
import {cleanup, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {TopBar} from './TopBar'
import RenderWithReactIntl from '../../__tests__/utils'
import {MenuOpenedProvider} from '@contexts/MenuOpened.context'
import {ConfigurationProvider} from '@contexts/Configuration.context'
import {Plugin} from '@mia-platform/core'

jest.mock('@utils/theme/ThemeManager', () => ({
  switchTheme: jest.fn()
}))

describe('TopBar tests', function () {
  afterEach(cleanup)
  const URL_LIGHT_IMAGE = 'https://raw.githubusercontent.com/lauragift21/giftegwuenu.dev/master/src/assets/img/logo.png'
  const URL_DARK_IMAGE = 'https://raw.githubusercontent.com/lauragift21/giftegwuenu.dev/master/src/assets/img/logo-light.png'

  const theming = {
    header: {
      pageTitle: 'My Company',
      favicon: 'https://www.mia-platform.eu/static/img/favicon/apple-icon-60x60.png'
    },
    logo: {
      alt: 'My Company',
      url_light_image: URL_LIGHT_IMAGE,
      url_dark_image: URL_DARK_IMAGE,
      navigation_url: 'https://www.google.com'
    },
    variables: {
      primaryColor: 'red'
    }
  }

  const plugins: Plugin [] = [{
    id: 'qiankun-test',
    label: 'Qiankun plugin 1',
    icon: 'fab fa-react',
    order: 3,
    integrationMode: 'qiankun',
    pluginRoute: '/qiankun',
    pluginUrl: '//localhost:8764'
  },
  {
    id: 'qiankun-test2',
    label: 'Qiankun plugin 2',
    icon: 'fab fa-react',
    order: 3,
    integrationMode: 'qiankun',
    pluginRoute: '/qiankun',
    pluginUrl: '//localhost:8764'
  }]
  const helpMenu = {
    helpLink: 'https://docs.mia-platform.eu/docs/business_suite/microlc/overview'
  }

  it('TopBar is working', () => {
    RenderWithReactIntl(
      <MenuOpenedProvider value={{
        isMenuOpened: false,
        setMenuOpened: () => {
        }
      }}
      >
        <TopBar/>
      </MenuOpenedProvider>
    )
    expect(screen.queryByTestId('company-logo')).toBeTruthy()
  })

  it('TopBar logo changes with theme', async () => {
    RenderWithReactIntl(
      <ConfigurationProvider value={{theming}}>
        <MenuOpenedProvider value={{
          isMenuOpened: false,
          setMenuOpened: () => {
          }
        }}
        >
          <TopBar/>
        </MenuOpenedProvider>
      </ConfigurationProvider>
    )
    const image = screen.getAllByTestId('company-logo')[0]
    await userEvent.click(screen.getByTestId('dark-theme-toggle'))
    expect(image).toHaveAttribute('src', URL_DARK_IMAGE)
  })

  it('Closed TopBar is opening', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(

      <ConfigurationProvider value={{
        theming,
        plugins,
        helpMenu
      }}
      >
        <MenuOpenedProvider value={{isMenuOpened: false, setMenuOpened: mockBurgerClick}}>
          <TopBar/>
        </MenuOpenedProvider>
      </ConfigurationProvider>
    )
    const toggle = screen.getByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeTruthy()
  })

  it('Open TopBar is closing', () => {
    const mockBurgerClick = jest.fn(isToggled => {
    })

    RenderWithReactIntl(

      <ConfigurationProvider value={{
        theming,
        plugins,
        helpMenu
      }}
      >
        <MenuOpenedProvider value={{isMenuOpened: true, setMenuOpened: mockBurgerClick}}>
          <TopBar/>
        </MenuOpenedProvider>
      </ConfigurationProvider>
    )
    const toggle = screen.getByTestId('top-bar-side-menu-toggle')
    userEvent.click(toggle)
    expect(mockBurgerClick.mock.calls[0][0]).toBeFalsy()
  })

  it('Logo on click open new window with the url in the same page', async () => {
    window.open = jest.fn()
    RenderWithReactIntl(
    <ConfigurationProvider value={{theming}}>
      <TopBar/>
    </ConfigurationProvider>)
    const toggle = screen.getByTestId('company-logo')
    await userEvent.click(toggle)
    expect(window.open).toBeCalledWith(theming.logo.navigation_url, '_self')
  })
})
