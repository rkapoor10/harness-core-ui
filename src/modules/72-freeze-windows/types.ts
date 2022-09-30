/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import type { SelectOption } from '@harness/uicore'
import type { PartiallyRequired } from '@pipeline/utils/types'
import type { FreezeFilterPropertiesDTO, GetFreezeListQueryParams } from 'services/cd-ng'

export enum FreezeWindowLevels {
  ACCOUNT = 'ACCOUNT',
  ORG = 'ORG',
  PROJECT = 'PROJECT'
}

export enum FIELD_KEYS {
  EnvType = 'EnvType',
  Service = 'Service',
  Org = 'Org',
  ExcludeOrgCheckbox = 'ExcludeOrgCheckbox',
  ExcludeOrg = 'ExcludeOrg',
  Proj = 'Proj',
  ExcludeProjCheckbox = 'ExcludeProjCheckbox',
  ExcludeProj = 'ExcludeProj'
}

export interface EntityType {
  type: FIELD_KEYS
  filterType: 'All' | 'Equals' | 'NotEquals'
  entityRefs?: string[]
}

export interface EntityConfig {
  name: string
  entities: EntityType[]
}

export interface ResourcesInterface {
  orgs: SelectOption[]
  projects: SelectOption[]
  services: SelectOption[]
  servicesMap: Record<string, SelectOption>
  freezeWindowLevel: FreezeWindowLevels
}

type OptionalFreezeListUrlQueryParams = Pick<GetFreezeListQueryParams, 'page' | 'size'> &
  Pick<FreezeFilterPropertiesDTO, 'freezeStatus' | 'searchTerm' | 'sort'> & { startDate?: string; endDate?: string }

export type FreezeListUrlQueryParams = PartiallyRequired<OptionalFreezeListUrlQueryParams, 'page' | 'size' | 'sort'>
