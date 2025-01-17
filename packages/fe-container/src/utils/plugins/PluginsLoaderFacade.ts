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
import {createBrowserHistory} from 'history'
import {addErrorHandler, registerMicroApps, RegistrableApp, start} from 'qiankun'
import {Plugin, User} from '@mia-platform/core'

import {INTEGRATION_METHODS, MICROLC_QIANKUN_CONTAINER, RESERVED_PATH} from '@constants'
import {noOpStrategy} from '@utils/plugins/strategies/NoOpStrategy'
import {hrefStrategy} from '@utils/plugins/strategies/HrefStrategy'
import {routeStrategy} from '@utils/plugins/strategies/RouteStrategy'
import {PluginStrategy} from '@utils/plugins/strategies/PluginStrategy'

const registeredPluginsStrategies = new Map<string, PluginStrategy>()
const registeredPlugins: Plugin[] = []

export const registerPlugin = (plugin: Plugin) => {
  const pluginStrategy: PluginStrategy = strategyBuilder(plugin)
  registeredPlugins.push(plugin)
  registeredPluginsStrategies.set(plugin.id, pluginStrategy)
}

export const retrievePluginStrategy = (plugin: Plugin) => {
  return registeredPluginsStrategies.get(plugin.id) || noOpStrategy()
}

export const isPluginLoaded = (plugin: Plugin) =>
  plugin.pluginRoute ? window.location.pathname.startsWith(plugin.pluginRoute) : false

export const findCurrentPlugin = () => {
  return registeredPlugins.find(isPluginLoaded)
}

export const isCurrentPluginLoaded = () => {
  return isReservedPage() || findCurrentPlugin() !== undefined
}

const isReservedPage = () => {
  return RESERVED_PATH.getMicrolcPaths()
    .reduce((previousValue, currentValue) =>
      previousValue || window.location.pathname.endsWith(currentValue), false)
}

const strategyBuilder = (plugin: Plugin) => {
  switch (plugin.integrationMode) {
    case INTEGRATION_METHODS.HREF:
      return hrefStrategy(plugin.externalLink)
    case INTEGRATION_METHODS.QIANKUN:
    case INTEGRATION_METHODS.IFRAME:
      return routeStrategy(plugin)
    default:
      return noOpStrategy()
  }
}

export const finish = (user: Partial<User>) => {
  const basePath = retrieveBasePath()
  history = createBrowserHistory({basename: basePath})
  const pluginMapper = pluginToQiankunMapper(user, basePath)
  const quiankunConfig = registeredPlugins
    .filter(plugin => plugin.integrationMode === INTEGRATION_METHODS.QIANKUN)
    .map<RegistrableApp<any>>(pluginMapper)
  registerMicroApps(quiankunConfig)
  addErrorHandler(_ => history.push(RESERVED_PATH.INTERNAL_ERROR))
  start()
}

const pluginToQiankunMapper = (user: Partial<User>, basePath: string) => {
  return (plugin: Plugin) => ({
    name: plugin.id,
    entry: plugin.pluginUrl || '',
    container: `#${MICROLC_QIANKUN_CONTAINER}`,
    activeRule: `${basePath}${plugin.pluginRoute || ''}`,
    props: {
      ...plugin.props,
      basePath,
      activeRule: `${basePath}${plugin.pluginRoute || ''}`,
      currentUser: user
    }
  })
}

const DOUBLE_SLASH = /\/\//g

const cleanReservedPath = (basePath: string) => {
  return RESERVED_PATH.getMicrolcPaths()
    .reduce((previousValue: string, currentValue: string) =>
      previousValue.replace(new RegExp(currentValue, 'g'), ''), basePath)
}

const retrieveBasePath = () => {
  let basePath = findCurrentPlugin() ? '/' : `${window.location.pathname}`
  basePath = cleanReservedPath(basePath).replace(DOUBLE_SLASH, '/')
  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
}

export let history = createBrowserHistory({basename: window.location.pathname})
