/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { getMultiTypeFromValue, MultiTypeInputType, RUNTIME_INPUT_VALUE } from '@harness/uicore'
import { defaultTo, isEmpty, isNil, set, get } from 'lodash-es'
import { isValueExpression } from '@common/utils/utils'
import { StageElementWrapperConfig } from 'services/pipeline-ng'
import type {
  DeployEnvironmentEntityConfig,
  DeployEnvironmentEntityCustomStepPropsWithStages,
  DeployEnvironmentEntityFormState
} from '../../types'

export function processSingleEnvironmentInitialValues(
  environment: DeployEnvironmentEntityConfig['environment'],
  customStepProps: DeployEnvironmentEntityCustomStepPropsWithStages
): DeployEnvironmentEntityFormState {
  const formState: DeployEnvironmentEntityFormState = {}
  const { gitOpsEnabled, serviceIdentifiers, stages = [] as StageElementWrapperConfig[] } = customStepProps
  const isOverridesEnabled = (customStepProps as any).isOverridesEnabled

  if (environment) {
    if (getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.RUNTIME) {
      set(formState, 'environment', RUNTIME_INPUT_VALUE)
      set(formState, 'provisioner', environment.provisioner)
    } else {
      const useFromStageValue = environment?.useFromStage?.stage
      if (useFromStageValue) {
        set(
          formState,
          'propagateFrom',
          useFromStageValue ? { label: useFromStageValue, value: useFromStageValue } : { label: '', value: '' }
        )
        // In order to show environment and override inputs properly in a readonly manner, resolved values are required in formik
        // for stage which propagates env data from a previous stage
        const propagatedFromStage = (stages as StageElementWrapperConfig[])?.find(
          stage => stage?.stage?.identifier === useFromStageValue
        )
        const environmentDetails = get(propagatedFromStage, 'stage.spec.environment')
        if (!isEmpty(environmentDetails)) {
          set(formState, 'environment', environmentDetails.environmentRef)

          if (getMultiTypeFromValue(environmentDetails.environmentRef) === MultiTypeInputType.FIXED) {
            set(formState, 'environmentInputs', {
              [environmentDetails.environmentRef as string]: environmentDetails?.environmentInputs
            })
          } else if (isValueExpression(environmentDetails.environmentRef)) {
            set(formState, 'environmentInputs', { environment: { expression: environmentDetails.environmentInputs } })
          } else {
            set(formState, 'environmentInputs', {})
          }

          if (!isNil(environmentDetails.serviceOverrideInputs) && !isEmpty(environmentDetails.serviceOverrideInputs)) {
            if (
              getMultiTypeFromValue(environmentDetails.environmentRef) === MultiTypeInputType.FIXED &&
              serviceIdentifiers?.length
            ) {
              set(formState, 'serviceOverrideInputs', {
                [environmentDetails.environmentRef as string]: {
                  [serviceIdentifiers?.[0] as string]: environmentDetails?.serviceOverrideInputs
                }
              })
            } else if (isValueExpression(environmentDetails.environmentRef)) {
              set(formState, 'serviceOverrideInputs', {
                environment: { expression: environmentDetails.serviceOverrideInputs }
              })
            } else {
              set(formState, 'serviceOverrideInputs', {})
            }
          }
        }
      } else {
        set(formState, 'environment', environment.environmentRef)
        set(formState, 'provisioner', environment.provisioner)
        // if environmentRef is a FIXED value and contains selected environment
        set(
          formState,
          'environmentInputs',
          getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.FIXED
            ? { [environment.environmentRef as string]: environment?.environmentInputs }
            : isValueExpression(environment.environmentRef)
            ? { environment: { expression: environment.environmentInputs } }
            : {}
        )

        if (isOverridesEnabled) {
          if (!isNil(environment.servicesOverrides) && !isEmpty(environment.servicesOverrides)) {
            environment.servicesOverrides.forEach(serviceOverride => {
              set(
                formState,
                'serviceOverrideInputs',
                getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.FIXED
                  ? {
                      [environment.environmentRef as string]: {
                        [serviceOverride.serviceRef]: serviceOverride.serviceOverrideInputs
                      }
                    }
                  : isValueExpression(environment.environmentRef)
                  ? { environment: { expression: environment.servicesOverrides } }
                  : {}
              )
            })
          } else if (!isNil(environment.serviceOverrideInputs) && !isEmpty(environment.serviceOverrideInputs)) {
            set(
              formState,
              'serviceOverrideInputs',
              getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.FIXED &&
                serviceIdentifiers?.length
                ? {
                    [environment.environmentRef as string]: {
                      [serviceIdentifiers?.[0] as string]: environment?.serviceOverrideInputs
                    }
                  }
                : isValueExpression(environment.environmentRef)
                ? { environment: { expression: environment.serviceOverrideInputs } }
                : {}
            )
          }
        } else {
          set(
            formState,
            'serviceOverrideInputs',
            getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.FIXED && serviceIdentifiers?.length
              ? {
                  [environment.environmentRef as string]: {
                    [serviceIdentifiers?.[0] as string]: environment?.serviceOverrideInputs
                  }
                }
              : isValueExpression(environment.environmentRef)
              ? { environment: { expression: environment.serviceOverrideInputs } }
              : {}
          )
        }

        // This is clusters specific handling
        if (gitOpsEnabled) {
          const gitOpsClusters = environment.gitOpsClusters

          // infrastructure is 1st identifier if gitOpsClusters is an array
          const cluster = Array.isArray(gitOpsClusters) ? gitOpsClusters[0]?.identifier : gitOpsClusters

          set(formState, 'cluster', cluster)
        } else {
          const infrastructureDefinitions = environment.infrastructureDefinitions

          // infrastructure is 1st identifier if infrastructureDefinitions is an array
          const infrastructure = Array.isArray(infrastructureDefinitions)
            ? infrastructureDefinitions[0]?.identifier
            : infrastructureDefinitions

          set(formState, 'infrastructure', infrastructure)
          // if infrastructureDefinitions is an array and contains selected infrastructure
          set(
            formState,
            'infrastructureInputs',
            isValueExpression(infrastructure)
              ? {
                  environment: {
                    infrastructure: { expression: infrastructureDefinitions?.[0]?.inputs }
                  }
                }
              : Array.isArray(infrastructureDefinitions) && infrastructure
              ? {
                  [environment.environmentRef as string]: {
                    [infrastructure]: infrastructureDefinitions?.[0]?.inputs
                  }
                }
              : {}
          )
        }
      }
    }
  }

  formState.category = 'single'
  return formState
}

export function processSingleEnvironmentGitOpsInitialValues(
  environment: DeployEnvironmentEntityConfig['environment']
): DeployEnvironmentEntityFormState {
  const formState: DeployEnvironmentEntityFormState = {}

  if (environment) {
    if (getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.RUNTIME) {
      set(formState, 'environment', RUNTIME_INPUT_VALUE)
      set(formState, 'provisioner', environment.provisioner)
      const filters = defaultTo((environment as any).filters, [])
      if (filters.length) {
        set(formState, 'environmentFilters.runtime', filters)
      }
    } else {
      set(formState, 'environment', environment.environmentRef)
      // if environmentRef is a FIXED value and contains selected environment
      set(
        formState,
        'environmentInputs',
        getMultiTypeFromValue(environment.environmentRef) === MultiTypeInputType.FIXED
          ? { [environment.environmentRef as string]: environment?.environmentInputs }
          : {}
      )
      set(formState, 'provisioner', environment.provisioner)
      if (environment.deployToAll !== true) {
        set(
          formState,
          `clusters.${environment.environmentRef}`,
          Array.isArray(environment.gitOpsClusters)
            ? environment.gitOpsClusters?.map(gitOpsCluster => ({
                label: gitOpsCluster.identifier,
                value: gitOpsCluster.identifier
              }))
            : environment.gitOpsClusters
        )
      }
    }
  }

  formState.category = 'single'
  return formState
}
