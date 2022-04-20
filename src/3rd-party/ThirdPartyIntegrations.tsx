/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useEffect, useMemo } from 'react'
import { useLicenseStore } from 'framework/LicenseStore/LicenseStoreContext'
import { useAppStore } from 'framework/AppStore/AppStoreContext'
import { injectHotJar, identifyHotJarUser } from './HotJar'

export const ThirdPartyIntegrations: React.FC = () => {
  const { licenseInformation } = useLicenseStore()
  const { currentUserInfo } = useAppStore()

  // HotJar is integrated for non-paid accounts (https://harness.atlassian.net/browse/PLG-946):
  // 		1. Community = window.deploymentType is 'COMMUNITY'
  // 		2. Trial = deploymentType is 'SAAS' AND account does not have any paid module
  const shouldIntegrateHotJar = useMemo(() => {
    const isCommunity = window.deploymentType === 'COMMUNITY'
    const isTrial =
      window.deploymentType === 'SAAS' &&
      licenseInformation &&
      !Object.values(licenseInformation).find(licenseInfo => licenseInfo?.licenseType === 'PAID')

    return !window.hj && (isCommunity || isTrial)
  }, [licenseInformation])

  useEffect(() => {
    if (shouldIntegrateHotJar) {
      injectHotJar()
    }
  }, [shouldIntegrateHotJar])

  useEffect(() => {
    if (shouldIntegrateHotJar && currentUserInfo) {
      const { email } = currentUserInfo
      identifyHotJarUser(email, { email })
    }
  }, [shouldIntegrateHotJar, currentUserInfo])

  return null
}
