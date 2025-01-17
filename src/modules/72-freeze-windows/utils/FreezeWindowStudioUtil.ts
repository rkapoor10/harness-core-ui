/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { parse } from 'yaml'
import * as Yup from 'yup'
import { defaultTo, isEmpty, once, pick, set } from 'lodash-es'
import type { SelectOption } from '@harness/uicore'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { accountPathProps, modulePathProps, orgPathProps, projectPathProps } from '@common/utils/routeUtils'
import type { UseStringsReturn, StringKeys } from 'framework/strings'
import {
  EntityConfig,
  EntityType,
  EnvironmentType,
  FIELD_KEYS,
  FILTER_TYPE,
  FreezeWindowLevels,
  ResourcesInterface
} from '@freeze-windows/types'
import { DefaultFreezeId } from '@freeze-windows/context/FreezeWindowReducer'
import { getIdentifierFromValue } from '@common/components/EntityReference/EntityReference'

export const isAllOptionSelected = (selected?: SelectOption[]) => {
  if (Array.isArray(selected)) {
    return selected.findIndex(item => item.value === FILTER_TYPE.All) >= 0
  }
  return false
}

export const allOrgsObj = (getString: UseStringsReturn['getString']) => ({
  label: getString('freezeWindows.freezeStudio.allOrganizations'),
  value: FILTER_TYPE.All
})
export const allProjectsObj = (getString: UseStringsReturn['getString']) => ({
  label: getString('rbac.scopeItems.allProjects'),
  value: FILTER_TYPE.All
})
export const allServicesObj = (getString: UseStringsReturn['getString']) => ({
  label: getString('common.allServices'),
  value: FILTER_TYPE.All
})
export const allEnvironmentsObj = (getString: UseStringsReturn['getString']) => ({
  label: getString('common.allEnvironments'),
  value: FILTER_TYPE.All
})
export const allPipelinesObj = (getString: UseStringsReturn['getString']) => ({
  label: getString('freezeWindows.freezeWindowConfig.allPipelines'),
  value: FILTER_TYPE.All
})

export const getEnvTypeMap = once((getString: UseStringsReturn['getString']) => {
  return {
    [EnvironmentType.Production]: getString('production'),
    [EnvironmentType.PreProduction]: getString('common.preProduction'),
    All: getString('common.allEnvironments')
  }
})

export const ExcludeFieldKeys = {
  [FIELD_KEYS.Org]: {
    CheckboxKey: FIELD_KEYS.ExcludeOrgCheckbox,
    ExcludeFieldKey: FIELD_KEYS.ExcludeOrg
  },
  [FIELD_KEYS.Proj]: {
    CheckboxKey: FIELD_KEYS.ExcludeProjCheckbox,
    ExcludeFieldKey: FIELD_KEYS.ExcludeProj
  },
  [FIELD_KEYS.Pipeline]: {
    CheckboxKey: FIELD_KEYS.ExcludePipelineCheckbox,
    ExcludeFieldKey: FIELD_KEYS.ExcludePipeline
  },
  [FIELD_KEYS.Service]: {
    CheckboxKey: FIELD_KEYS.ExcludeServiceCheckbox,
    ExcludeFieldKey: FIELD_KEYS.ExcludeService
  },
  [FIELD_KEYS.Environment]: {
    CheckboxKey: FIELD_KEYS.ExcludeEnvironmentCheckbox,
    ExcludeFieldKey: FIELD_KEYS.ExcludeEnvironment
  }
}

/* istanbul ignore next */
export function isValidYaml(
  yamlHandler: YamlBuilderHandlerBinding | undefined,
  showInvalidYamlError: (error: string) => void,
  getString: UseStringsReturn['getString'],
  updateFreeze: (freezeYAML: string) => void
): boolean {
  if (yamlHandler) {
    try {
      const parsedYaml = parse(yamlHandler.getLatestYaml())?.freeze
      if (!parsedYaml || yamlHandler.getYAMLValidationErrorMap()?.size > 0) {
        showInvalidYamlError(getString('invalidYamlText'))
        return false
      }
      updateFreeze(parsedYaml)
    } catch (e) {
      showInvalidYamlError(defaultTo(e.message, getString('invalidYamlText')))
      return false
    }
  }
  return true
}

export const getInitialValues = (freezeObj: any) => {
  const pickedValues = pick(freezeObj, 'name', 'identifier', 'description', 'tags')
  if (freezeObj.identifier === DefaultFreezeId) {
    pickedValues.identifier = ''
  }
  return {
    ...pickedValues
  }
}

export interface FieldVisibility {
  showOrgField: boolean
  showProjectField: boolean
  showPipelineField: boolean
  freezeWindowLevel: FreezeWindowLevels
}

export const getFieldsVisibility = (freezeWindowLevel: FreezeWindowLevels): FieldVisibility => {
  const obj = { showOrgField: false, showProjectField: false, showPipelineField: false, freezeWindowLevel }
  if (freezeWindowLevel === FreezeWindowLevels.ACCOUNT) {
    obj.showOrgField = true
    obj.showProjectField = true
  }
  if (freezeWindowLevel === FreezeWindowLevels.ORG) {
    obj.showProjectField = true
  }
  if (freezeWindowLevel === FreezeWindowLevels.PROJECT) {
    obj.showPipelineField = true
  }
  return obj
}

const SINGLE_SELECT_FIELDS = {
  [FIELD_KEYS.EnvType]: true
}

const selectedValueForFilterTypeAll = (type: string, getString: UseStringsReturn['getString']) => {
  if (type === FIELD_KEYS.Org) {
    return [allOrgsObj(getString)]
  }
  if (type === FIELD_KEYS.Proj) {
    return [allProjectsObj(getString)]
  }
  if (type === FIELD_KEYS.Service) {
    return [allServicesObj(getString)]
  }
  if (type === FIELD_KEYS.Environment) {
    return [allEnvironmentsObj(getString)]
  }
  if (type === FIELD_KEYS.Pipeline) {
    return [allPipelinesObj(getString)]
  }
}

const makeOptions = /* istanbul ignore next */ (dataMap: Record<string, SelectOption>, keys?: string[]) => {
  return keys
    ?.map(item => {
      return {
        label: defaultTo(dataMap[item]?.label, item),
        value: defaultTo(dataMap[item]?.value, item)
      }
    })
    .filter(optn => optn)
}

/* istanbul ignore next */
const equalsOptions = (type: FIELD_KEYS, entityRefs: string[], resources: ResourcesInterface) => {
  if (type === FIELD_KEYS.Service) {
    return entityRefs.map(item => {
      return {
        label: defaultTo(resources.servicesMap[getIdentifierFromValue(item)]?.label, getIdentifierFromValue(item)),
        value: item
      }
    })
  }
  if (type === FIELD_KEYS.Environment) {
    return entityRefs.map(item => {
      return {
        label: defaultTo(resources.environmentsMap[getIdentifierFromValue(item)]?.label, getIdentifierFromValue(item)),
        value: item
      }
    })
  }
  if (type === FIELD_KEYS.Proj) {
    return makeOptions(resources.projectsMap, entityRefs)
  }
  if (type === FIELD_KEYS.Org) {
    return makeOptions(resources.orgsMap, entityRefs)
  }
  if (type === FIELD_KEYS.Pipeline) {
    return makeOptions(resources.pipelinesMap, entityRefs)
  }

  // Single Select Field
  if (type === FIELD_KEYS.EnvType) {
    return entityRefs[0]
  }
}

export const getInitialValuesForConfigSection = (
  entityConfigs: EntityConfig[],
  getString: UseStringsReturn['getString'],
  resources: ResourcesInterface
): { entity?: Array<Record<string, any>> } => {
  const initialValues = {}
  entityConfigs.forEach((c: EntityConfig, i: number) => {
    set(initialValues, `entity[${i}].name`, c.name)

    const entities = c.entities || []

    let projectResourcesMap: Record<string, SelectOption> | null = null
    if (resources.freezeWindowLevel === FreezeWindowLevels.ACCOUNT) {
      const orgObj = entities.find(entity => entity.type === FIELD_KEYS.Org) || {}
      const orgIds = (orgObj as EntityType).entityRefs
      const filterType = (orgObj as EntityType).filterType
      if (orgIds?.length === 1 && filterType && filterType !== FILTER_TYPE.All) {
        projectResourcesMap = resources.projectsByOrgId[orgIds[0]]?.projectsMap
      }
    }

    entities.forEach(entity => {
      const { type, filterType, entityRefs } = entity
      if (filterType === FILTER_TYPE.All) {
        // set filterType and entity
        set(
          initialValues,
          `entity[${i}].${type}`,
          SINGLE_SELECT_FIELDS[type as FIELD_KEYS.EnvType] ? filterType : selectedValueForFilterTypeAll(type, getString)
        )
      } else if (filterType === FILTER_TYPE.Equals) {
        set(
          initialValues,
          `entity[${i}].${type}`,
          equalsOptions(
            type,
            entityRefs || [],
            type === FIELD_KEYS.Proj && projectResourcesMap
              ? {
                  ...resources,
                  projectsMap: projectResourcesMap
                }
              : resources
          )
        )
        // equals
      } else if (filterType === FILTER_TYPE.NotEquals) {
        const excludeFieldKeys = ExcludeFieldKeys[type as 'Org' | 'Project' | 'Pipeline' | 'Service' | 'Environment']
        if (excludeFieldKeys) {
          const { CheckboxKey, ExcludeFieldKey } = excludeFieldKeys
          set(initialValues, `entity[${i}].${type}`, selectedValueForFilterTypeAll(type, getString))
          set(initialValues, `entity[${i}].${CheckboxKey}`, true)
          set(
            initialValues,
            `entity[${i}].${ExcludeFieldKey}`,
            equalsOptions(
              type,
              entityRefs || [],
              type === FIELD_KEYS.Proj && projectResourcesMap
                ? {
                    ...resources,
                    projectsMap: projectResourcesMap
                  }
                : resources
            )
          )
        }
      }
    })
  })
  return initialValues
}

const updateEntities = (obj: any, entities: any, index: number) => {
  if (obj.entityRefs.length === 0) {
    delete obj.entityRefs
  }
  if (index >= 0) {
    entities[index] = obj
  } else {
    entities.push(obj)
  }
}

export interface EntityTypeReqd extends EntityType {
  entityRefs: string[]
}

const getMetaDataForField = (fieldKey: FIELD_KEYS, entities: EntityType[], newValues: any) => {
  const index = entities.findIndex((e: any) => e.type === fieldKey)
  const isAllSelected = isAllOptionSelected(newValues[fieldKey])
  const obj: EntityTypeReqd = { type: fieldKey, filterType: FILTER_TYPE.All, entityRefs: [] }
  const isNewValueEmpty = isEmpty(newValues[fieldKey])

  return { isAllSelected, obj, index, isNewValueEmpty }
}

const adaptForOrgField = (newValues: any, entities: EntityType[]) => {
  const fieldKey = FIELD_KEYS.Org
  const {
    isAllSelected,
    obj,
    index: orgFieldIndex,
    isNewValueEmpty
  } = getMetaDataForField(fieldKey, entities, newValues)
  if (orgFieldIndex < 0 && !newValues[fieldKey]) {
    return
  }
  if (isAllSelected) {
    const hasExcludedOrgs = newValues[FIELD_KEYS.ExcludeOrgCheckbox] && !isEmpty(newValues[FIELD_KEYS.ExcludeOrg])
    obj.filterType = hasExcludedOrgs ? FILTER_TYPE.NotEquals : FILTER_TYPE.All
    if (hasExcludedOrgs) {
      obj.entityRefs.push(...(newValues[FIELD_KEYS.ExcludeOrg]?.map((field: SelectOption) => field.value) || []))
    }
    // exclude can be there
    // entityRefs reqd, if exclude is true
  } else if (isNewValueEmpty) {
    // Do nothing here
  } else {
    obj.filterType = FILTER_TYPE.Equals
    obj.entityRefs.push(...(newValues[fieldKey]?.map((field: SelectOption) => field.value) || []))
  }

  updateEntities(obj, entities, orgFieldIndex)
}

const adaptForEnvField = (newValues: any, entities: EntityType[]) => {
  const fieldKey = FIELD_KEYS.EnvType
  const index = entities.findIndex((e: any) => e.type === fieldKey)

  if (index < 0 && newValues[fieldKey]) {
    return
  }

  const obj: EntityType = { type: fieldKey, filterType: FILTER_TYPE.All, entityRefs: [] }

  if (newValues[fieldKey] === FILTER_TYPE.All) {
    obj.filterType = newValues[fieldKey]
  } else {
    obj.filterType = FILTER_TYPE.Equals
    obj.entityRefs = [newValues[fieldKey]]
    // equals, not equals
  }

  updateEntities(obj, entities, index)
}

const adaptForProjectField = (newValues: any, entities: EntityType[]) => {
  const fieldKey = FIELD_KEYS.Proj
  const { isAllSelected, obj, index, isNewValueEmpty } = getMetaDataForField(fieldKey, entities, newValues)

  // Value is empty initially and later also
  if (index < 0 && !newValues[fieldKey]) {
    return
  }

  if (isAllSelected) {
    const hasExcludedProj = newValues[FIELD_KEYS.ExcludeProjCheckbox] && !isEmpty(newValues[FIELD_KEYS.ExcludeProj])
    obj.filterType = hasExcludedProj ? FILTER_TYPE.NotEquals : FILTER_TYPE.All
    if (hasExcludedProj) {
      obj.entityRefs.push(...(newValues[FIELD_KEYS.ExcludeProj]?.map((field: SelectOption) => field.value) || []))
    }
  } else if (isNewValueEmpty) {
    // Do Nothing here
  } else {
    obj.filterType = FILTER_TYPE.Equals
    obj.entityRefs.push(...(newValues[fieldKey]?.map((field: SelectOption) => field.value) || []))
  }
  updateEntities(obj, entities, index)
}

const adaptForPipelineField = (newValues: any, entities: EntityType[]) => {
  const fieldKey = FIELD_KEYS.Pipeline
  const { isAllSelected, obj, index, isNewValueEmpty } = getMetaDataForField(fieldKey, entities, newValues)

  // Value is empty initially and later also
  if (index < 0 && !newValues[fieldKey]) {
    return
  }

  if (isAllSelected) {
    const hasExcludedPipeline =
      newValues[FIELD_KEYS.ExcludePipelineCheckbox] && !isEmpty(newValues[FIELD_KEYS.ExcludePipeline])
    obj.filterType = hasExcludedPipeline ? FILTER_TYPE.NotEquals : FILTER_TYPE.All
    if (hasExcludedPipeline) {
      obj.entityRefs.push(...(newValues[FIELD_KEYS.ExcludePipeline]?.map((field: SelectOption) => field.value) || []))
    }
  } else if (isNewValueEmpty) {
    // Do Nothing here
  } else {
    obj.filterType = FILTER_TYPE.Equals
    obj.entityRefs.push(...(newValues[fieldKey]?.map((field: SelectOption) => field.value) || []))
  }
  updateEntities(obj, entities, index)
}

const adaptForServiceEnvField = (newValues: any, entities: EntityType[], fieldKeys: FIELD_KEYS) => {
  const fieldKey = fieldKeys
  const { isAllSelected, obj, index, isNewValueEmpty } = getMetaDataForField(fieldKey, entities, newValues)
  if (index < 0 && !newValues[fieldKey]) {
    return
  }

  if (isAllSelected) {
    obj.filterType = FILTER_TYPE.All
    if (fieldKey === FIELD_KEYS.Service) {
      const hasExcludedServices =
        newValues[FIELD_KEYS.ExcludeServiceCheckbox] && !isEmpty(newValues[FIELD_KEYS.ExcludeService])
      obj.filterType = hasExcludedServices ? FILTER_TYPE.NotEquals : FILTER_TYPE.All
      if (hasExcludedServices) {
        obj.entityRefs.push(...(newValues[FIELD_KEYS.ExcludeService]?.map((field: SelectOption) => field.value) || []))
      }
    }

    if (fieldKey === FIELD_KEYS.Environment) {
      const hasExcludedEnvironments =
        newValues[FIELD_KEYS.ExcludeEnvironmentCheckbox] && !isEmpty(newValues[FIELD_KEYS.ExcludeEnvironment])
      obj.filterType = hasExcludedEnvironments ? FILTER_TYPE.NotEquals : FILTER_TYPE.All
      if (hasExcludedEnvironments) {
        obj.entityRefs.push(
          ...(newValues[FIELD_KEYS.ExcludeEnvironment]?.map((field: SelectOption) => field.value) || [])
        )
      }
    }
  } else if (isNewValueEmpty) {
    //Do nothing here
  } else {
    obj.filterType = FILTER_TYPE.Equals
    obj.entityRefs.push(...(newValues[fieldKey]?.map((field: SelectOption) => field.value) || []))
  }

  updateEntities(obj, entities, index)
}

const adaptForServiceEnvFieldAtOrgAcct = (newValues: any, entities: EntityType[], fieldKeys: FIELD_KEYS) => {
  const fieldKey = fieldKeys
  const { obj, index } = getMetaDataForField(fieldKey, entities, newValues)

  const isAllOption = isAllOptionSelected(newValues[fieldKey])
  if (index < 0 && !newValues[fieldKey]) {
    return
  }

  const entityRefValues = (newValues[fieldKey]?.map((field: SelectOption) => field.value) || []) as string[]
  if (entityRefValues?.length && !isAllOption) {
    obj.filterType = FILTER_TYPE.Equals
    obj.entityRefs.push(...entityRefValues)
  } else if (
    fieldKey === FIELD_KEYS.Service &&
    newValues[FIELD_KEYS.ExcludeServiceCheckbox] &&
    !isEmpty(newValues[FIELD_KEYS.ExcludeService])
  ) {
    obj.filterType = FILTER_TYPE.NotEquals
    obj.entityRefs.push(...(newValues[FIELD_KEYS.ExcludeService]?.map((field: SelectOption) => field.value) || []))
  } else if (
    fieldKey === FIELD_KEYS.Environment &&
    newValues[FIELD_KEYS.ExcludeEnvironmentCheckbox] &&
    !isEmpty(newValues[FIELD_KEYS.ExcludeEnvironment])
  ) {
    obj.filterType = FILTER_TYPE.NotEquals
    obj.entityRefs.push(...(newValues[FIELD_KEYS.ExcludeEnvironment]?.map((field: SelectOption) => field.value) || []))
  } else {
    obj.filterType = FILTER_TYPE.All
  }

  updateEntities(obj, entities, index)
}

export const convertValuesToYamlObj = (currentValues: any, newValues: any, fieldsVisibility: FieldVisibility) => {
  const entities = [...(currentValues.entities || [])]

  adaptForEnvField(newValues, entities as EntityType[])
  if (fieldsVisibility.freezeWindowLevel === FreezeWindowLevels.ACCOUNT) {
    adaptForOrgField(newValues, entities)
    adaptForProjectField(newValues, entities)
    adaptForServiceEnvFieldAtOrgAcct(newValues, entities, FIELD_KEYS.Service)
    adaptForServiceEnvFieldAtOrgAcct(newValues, entities, FIELD_KEYS.Environment)
  }

  if (fieldsVisibility.freezeWindowLevel === FreezeWindowLevels.PROJECT) {
    adaptForServiceEnvField(newValues, entities, FIELD_KEYS.Service)
    adaptForServiceEnvField(newValues, entities, FIELD_KEYS.Environment)
    adaptForPipelineField(newValues, entities)
  }

  if (fieldsVisibility.freezeWindowLevel === FreezeWindowLevels.ORG) {
    adaptForProjectField(newValues, entities)
    adaptForServiceEnvFieldAtOrgAcct(newValues, entities, FIELD_KEYS.Service)
    adaptForServiceEnvFieldAtOrgAcct(newValues, entities, FIELD_KEYS.Environment)
  }

  return { name: newValues.name, entities }
}

export const getEmptyEntityConfig = (fieldsVisibility: FieldVisibility): EntityConfig => {
  const entities = []
  if (fieldsVisibility.showOrgField) {
    entities.push({
      type: FIELD_KEYS.Org,
      filterType: FILTER_TYPE.All
    })
  }
  if (fieldsVisibility.showProjectField) {
    entities.push({
      type: FIELD_KEYS.Proj,
      filterType: FILTER_TYPE.All
    })
  }
  if (fieldsVisibility.showPipelineField) {
    entities.push({
      type: FIELD_KEYS.Pipeline,
      filterType: FILTER_TYPE.All
    })
  }
  entities.push({ type: FIELD_KEYS.Service, filterType: FILTER_TYPE.All })
  entities.push({ type: FIELD_KEYS.Environment, filterType: FILTER_TYPE.All })
  entities.push({ type: FIELD_KEYS.EnvType, filterType: FILTER_TYPE.All })
  return {
    name: '',
    entities: entities as EntityType[]
  }
}

export const getValidationSchema = (freezeWindowLevel: FreezeWindowLevels) => {
  if (freezeWindowLevel === FreezeWindowLevels.PROJECT) {
    return {
      [FIELD_KEYS.Service]: Yup.string().when([FIELD_KEYS.Environment, FIELD_KEYS.Pipeline], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Service is required')
      }),
      [FIELD_KEYS.Environment]: Yup.string().when([FIELD_KEYS.Service, FIELD_KEYS.Pipeline], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Environment is required')
      }),
      [FIELD_KEYS.Pipeline]: Yup.string().when([FIELD_KEYS.Service, FIELD_KEYS.Environment], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Pipeline is required')
      })
    }
  }
  if (freezeWindowLevel === FreezeWindowLevels.ORG) {
    return {
      [FIELD_KEYS.Service]: Yup.string().when([FIELD_KEYS.Proj, FIELD_KEYS.Environment], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Service is required')
      }),
      [FIELD_KEYS.Environment]: Yup.string().when([FIELD_KEYS.Proj, FIELD_KEYS.Service], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Environment is required')
      }),
      [FIELD_KEYS.Proj]: Yup.string().when([FIELD_KEYS.Service, FIELD_KEYS.Environment], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Project is required')
      })
    }
  }
  if (freezeWindowLevel === FreezeWindowLevels.ACCOUNT) {
    return {
      [FIELD_KEYS.Service]: Yup.string().when([FIELD_KEYS.Org, FIELD_KEYS.Proj, FIELD_KEYS.Environment], {
        is: (val1, val2, val3) => !(val1?.length && val2?.length) && !val3?.length,
        then: Yup.string().required('Service is required')
      }),
      [FIELD_KEYS.Environment]: Yup.string().when([FIELD_KEYS.Org, FIELD_KEYS.Proj, FIELD_KEYS.Service], {
        is: (val1, val2, val3) => !(val1?.length && val2?.length) && !val3?.length,
        then: Yup.string().required('Environment is required')
      }),
      [FIELD_KEYS.Org]: Yup.string().when([FIELD_KEYS.Service, FIELD_KEYS.Environment], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Organization is required')
      }),
      [FIELD_KEYS.Proj]: Yup.string().when([FIELD_KEYS.Service, FIELD_KEYS.Environment], {
        is: (val1, val2) => !val1?.length && !val2?.length,
        then: Yup.string().required('Project is required')
      })
    }
  }
  return {}
}

export function getContentAndTitleStringKeys(isYamlError: boolean): {
  navigationContentText: StringKeys
  navigationTitleText: StringKeys
} {
  return {
    navigationContentText: isYamlError ? 'navigationYamlError' : 'navigationCheckText',
    navigationTitleText: isYamlError ? 'navigationYamlErrorTitle' : 'navigationCheckTitle'
  }
}

export const PATH_PARAMS = {
  [FreezeWindowLevels.ACCOUNT]: {
    ...accountPathProps,
    windowIdentifier: ':windowIdentifier'
  },
  [FreezeWindowLevels.ORG]: {
    ...orgPathProps,
    windowIdentifier: ':windowIdentifier'
  },
  [FreezeWindowLevels.PROJECT]: {
    ...projectPathProps,
    ...modulePathProps,
    windowIdentifier: ':windowIdentifier'
  }
}
