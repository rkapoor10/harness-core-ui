/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import {
  Card,
  getMultiTypeFromValue,
  HarnessDocTooltip,
  Layout,
  MultiTypeInputType,
  RUNTIME_INPUT_VALUE
} from '@harness/uicore'
import React from 'react'
import cx from 'classnames'
import { produce } from 'immer'
import { isEmpty, set, unset } from 'lodash-es'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { FailureStrategyWithRef } from '@pipeline/components/PipelineStudio/FailureStrategy/FailureStrategy'
import type { StepFormikRef } from '@pipeline/components/PipelineStudio/StepCommands/StepCommands'
import ConditionalExecution from '@pipeline/components/PipelineStudio/ConditionalExecution/ConditionalExecution'
import { DelegateSelectorWithRef } from '@pipeline/components/PipelineStudio/DelegateSelector/DelegateSelector'
import { useStrings } from 'framework/strings'
import { useTelemetry } from '@common/hooks/useTelemetry'
import { StepActions } from '@common/constants/TrackingConstants'
import type { BuildStageElementConfig } from '@pipeline/utils/pipelineTypes'
import { LoopingStrategy } from '@pipeline/components/PipelineStudio/LoopingStrategy/LoopingStrategy'
import MultiTypeSelectorButton from '@common/components/MultiTypeSelectorButton/MultiTypeSelectorButton'
import { isMultiTypeRuntime, isValueRuntimeInput } from '@common/utils/utils'
import { BuildTabs } from '../CIPipelineStagesUtils'
import css from './BuildAdvancedSpecifications.module.scss'

export interface AdvancedSpecifications {
  context?: string
}
const BuildAdvancedSpecifications: React.FC<AdvancedSpecifications> = ({ children }): JSX.Element => {
  const { getString } = useStrings()
  const { trackEvent } = useTelemetry()

  const {
    state: {
      selectionState: { selectedStageId }
    },
    isReadonly,
    getStageFromPipeline,
    updateStage
  } = usePipelineContext()
  const { stage } = getStageFromPipeline(selectedStageId || '')

  const formikRef = React.useRef<StepFormikRef | null>(null)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <div className={cx(css.stageSection, css.editStageGrid)}>
      <div className={css.contentSection} ref={scrollRef}>
        <div className={css.tabHeading}>
          <span data-tooltip-id="delegateSelectorDeployStage">
            {getString('pipeline.delegate.DelegateSelectorOptional')}
          </span>
        </div>
        <Card className={css.sectionCard} id="delegateSelector">
          <Layout.Horizontal>
            <div>
              <DelegateSelectorWithRef
                selectedStage={stage}
                isReadonly={isReadonly}
                ref={formikRef}
                onUpdate={delegateSelectors => {
                  const valuePassed = delegateSelectors.delegateSelectors
                  const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
                  /* istanbul ignore else */
                  if (pipelineStage && pipelineStage.stage) {
                    const stageData = produce(pipelineStage, draft => {
                      set(draft, 'stage.delegateSelectors', valuePassed)
                      if (isEmpty(valuePassed) || valuePassed[0] === '') {
                        unset(draft.stage, 'delegateSelectors')
                      }
                    })
                    /* istanbul ignore else */
                    if (stageData.stage) {
                      updateStage(stageData.stage)
                    }
                  }
                }}
                tabName={BuildTabs.ADVANCED}
              />
            </div>
          </Layout.Horizontal>
        </Card>
        <div className={css.tabHeading}>
          <span data-tooltip-id="conditionalExecutionBuildStage">
            {getString('pipeline.conditionalExecution.title')}
          </span>
          <MultiTypeSelectorButton
            className={css.multiTypeBtn}
            type={getMultiTypeFromValue(stage?.stage?.when as any)}
            allowedTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]}
            disabled={isReadonly}
            onChange={type => {
              const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
              if (pipelineStage && pipelineStage.stage) {
                const stageData = produce(pipelineStage, draft => {
                  if (isMultiTypeRuntime(type)) {
                    set(draft, 'stage.when', RUNTIME_INPUT_VALUE)
                  } else {
                    unset(draft, 'stage.when')
                  }
                })

                if (stageData.stage) {
                  updateStage(stageData.stage)
                }
              }
            }}
          />
          <HarnessDocTooltip tooltipId="conditionalExecutionBuildStage" useStandAlone={true} />
        </div>
        {!!stage && (
          <Card className={css.sectionCard} id="conditionalExecution">
            <Layout.Horizontal>
              <div className={css.stageSection}>
                <div className={cx(css.stageCreate, css.stageDetails)}>
                  <ConditionalExecution
                    isReadonly={isReadonly}
                    selectedStage={stage}
                    onUpdate={when => {
                      const { stage: pipelineStage } = getStageFromPipeline<BuildStageElementConfig>(
                        selectedStageId || ''
                      )
                      if (pipelineStage && pipelineStage.stage) {
                        const stageData = produce(pipelineStage, draft => {
                          set(draft, 'stage.when', when)
                        })

                        if (stageData.stage) updateStage(stageData.stage)
                      }
                    }}
                  />
                </div>
              </div>
            </Layout.Horizontal>
          </Card>
        )}
        <div className={css.tabHeading}>
          <span data-tooltip-id="loopingStrategyBuildStage">{getString('pipeline.loopingStrategy.title')}</span>
          <MultiTypeSelectorButton
            className={css.multiTypeBtn}
            type={getMultiTypeFromValue(stage?.stage?.strategy as any)}
            allowedTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]}
            disabled={isReadonly}
            onChange={type => {
              const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
              if (pipelineStage && pipelineStage.stage) {
                const stageData = produce(pipelineStage, draft => {
                  if (isMultiTypeRuntime(type)) {
                    set(draft, 'stage.strategy', RUNTIME_INPUT_VALUE)
                  } else {
                    unset(draft, 'stage.strategy')
                  }
                })

                if (stageData.stage) {
                  updateStage(stageData.stage)
                }
              }
            }}
          />
          <HarnessDocTooltip tooltipId="loopingStrategyBuildStage" useStandAlone={true} />
        </div>
        <Card className={css.sectionCard} id="loopingStrategy">
          <LoopingStrategy
            selectedStage={stage}
            isReadonly={isReadonly}
            onUpdateStrategy={strategy => {
              const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
              if (pipelineStage && pipelineStage.stage) {
                const stageData = produce(pipelineStage, draft => {
                  if (isEmpty(strategy)) {
                    unset(draft, 'stage.strategy')
                  } else {
                    set(draft, 'stage.strategy', strategy)
                  }
                })
                if (stageData.stage) updateStage(stageData.stage)
              }
            }}
          />
        </Card>
        <div className={css.tabHeading}>
          <span data-tooltip-id="failureStrategyBuildStage">{getString('pipeline.failureStrategies.title')}</span>
          <MultiTypeSelectorButton
            className={css.multiTypeBtn}
            type={getMultiTypeFromValue(stage?.stage?.failureStrategies as any)}
            allowedTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.RUNTIME]}
            disabled={isReadonly}
            onChange={type => {
              const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
              if (pipelineStage && pipelineStage.stage) {
                const stageData = produce(pipelineStage, draft => {
                  if (isMultiTypeRuntime(type)) {
                    set(draft, 'stage.failureStrategies', RUNTIME_INPUT_VALUE)
                  } else {
                    unset(draft, 'stage.failureStrategies')
                  }
                })

                if (stageData.stage) {
                  updateStage(stageData.stage)
                }
              }
            }}
          />
          <HarnessDocTooltip tooltipId="failureStrategyBuildStage" useStandAlone={true} />
        </div>
        <Card className={css.sectionCard} id="failureStrategy">
          <Layout.Horizontal>
            <div className={css.stageSection}>
              <div className={cx(css.stageCreate, css.stageDetails)}>
                <FailureStrategyWithRef
                  selectedStage={stage}
                  isReadonly={isReadonly}
                  ref={formikRef}
                  onUpdate={({ failureStrategies }) => {
                    const { stage: pipelineStage } = getStageFromPipeline(selectedStageId || '')
                    if (pipelineStage && pipelineStage.stage) {
                      const stageData = produce(pipelineStage, draft => {
                        if (
                          (Array.isArray(failureStrategies) && failureStrategies.length > 0) ||
                          isValueRuntimeInput(failureStrategies as any)
                        ) {
                          set(draft, 'stage.failureStrategies', failureStrategies)
                        } else {
                          unset(draft, 'stage.failureStrategies')
                        }
                      })

                      if (stageData.stage) {
                        updateStage(stageData.stage)
                        const errors = formikRef.current?.getErrors()
                        if (isEmpty(errors) && Array.isArray(failureStrategies)) {
                          const telemetryData = failureStrategies.map(strategy => ({
                            onError: strategy.onFailure?.errors?.join(', '),
                            action: strategy.onFailure?.action?.type
                          }))
                          telemetryData.length &&
                            trackEvent(StepActions.AddEditFailureStrategy, { data: JSON.stringify(telemetryData) })
                        }
                      }
                    }
                  }}
                  tabName={BuildTabs.ADVANCED}
                />
              </div>
            </div>
          </Layout.Horizontal>
        </Card>
        <div className={cx(css.navigationButtons)}>{children}</div>
      </div>
    </div>
  )
}

export default BuildAdvancedSpecifications
