/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

const { getServerConfig } = require('./libs/utils')

const { server: serverConfig } = getServerConfig()

const NEED_OMIT_HEADERS = ['cookie', 'referer']

const k8sResourceProxy = {
  target: serverConfig.gatewayServer.url,
  changeOrigin: true,
  events: {
    proxyReq(proxyReq, req) {
      // Set authorization
      proxyReq.setHeader('Authorization', `Bearer ${req.token}`)

      NEED_OMIT_HEADERS.forEach(key => proxyReq.removeHeader(key))
    },
  },
}

const devopsWebhookProxy = {
  target: `${
    serverConfig.gatewayServer.url
  }/kapis/devops.kubesphere.io/v1alpha2`,
  changeOrigin: true,
  ignorePath: true,
  optionsHandle(options, req) {
    options.target += `/${req.url.slice(8)}`
  },
}

const b2iFileProxy = {
  target: serverConfig.gatewayServer.url,
  changeOrigin: true,
  followRedirects: true,
  ignorePath: true,
  optionsHandle(options, req) {
    options.target += `/${req.url.slice(14)}`
  },
  events: {
    proxyReq(proxyReq, req) {
      proxyReq.setHeader('Authorization', `Bearer ${req.token}`)

      NEED_OMIT_HEADERS.forEach(key => proxyReq.removeHeader(key))
    },
  },
}

module.exports = {
  k8sResourceProxy,
  devopsWebhookProxy,
  b2iFileProxy,
}