/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { FormikProps, FieldArray, useFormikContext } from 'formik'
import {
  AllowedTypes,
  Button,
  ButtonVariation,
  FormikForm,
  FormInput,
  getMultiTypeFromValue,
  Layout,
  Text,
  MultiTypeInputType,
  HarnessDocTooltip,
  Label
} from '@harness/uicore'
import { Color, FontVariation } from '@harness/design-system'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { get } from 'lodash-es'

import cx from 'classnames'
import { useStrings } from 'framework/strings'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import { isValueRuntimeInput } from '@common/utils/utils'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import MultiTypeDelegateSelector from '@common/components/MultiTypeDelegateSelector/MultiTypeDelegateSelector'
import { useFeatureFlag } from '@common/hooks/useFeatureFlag'
import { FeatureFlag } from '@common/featureFlags'
import MultiTypeSecretInput from '@platform/secrets/components/MutiTypeSecretInput/MultiTypeSecretInput'
import { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'

import {
  scriptInputType,
  scriptOutputType,
  ShellScriptFormData,
  ShellScriptOutputStepVariable,
  ShellScriptStepVariable
} from './shellScriptTypes'
import { MultiTypeExecutionTargetGroup } from './ExecutionTargetGroup'

import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
import css from './ShellScript.module.scss'

interface FixedExecTargetGroupProps {
  readonly?: boolean
  expressions?: string[]
  allowableTypes: AllowedTypes
  formik: FormikProps<ShellScriptFormData>
  prefix?: string
}

export const FixedExecTargetGroup = ({
  expressions,
  readonly,
  allowableTypes,
  formik,
  prefix
}: FixedExecTargetGroupProps): React.ReactElement => {
  const { getString } = useStrings()
  const formValues = formik.values
  const { setFieldValue } = formik

  if (formValues.spec?.onDelegate === 'targethost') {
    return (
      <div>
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            name={prefix ? `${prefix}spec.executionTarget.host` : 'spec.executionTarget.host'}
            placeholder={getString('cd.specifyTargetHost')}
            label={getString('targetHost')}
            style={{ marginTop: 'var(--spacing-small)' }}
            multiTextInputProps={{ expressions, disabled: readonly, allowableTypes }}
            disabled={readonly}
          />
          {getMultiTypeFromValue(formValues.spec?.executionTarget?.host) === MultiTypeInputType.RUNTIME && (
            <ConfigureOptions
              value={formValues.spec?.executionTarget?.host}
              type="String"
              variableName="spec.executionTarget.host"
              showRequiredField={false}
              showDefaultField={false}
              onChange={value => setFieldValue('spec.executionTarget.host', value)}
              style={{ marginTop: 12 }}
              isReadonly={readonly}
            />
          )}
        </div>
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <MultiTypeSecretInput
            type={formValues.spec.shell === 'PowerShell' ? 'WinRmCredentials' : 'SSHKey'}
            name={prefix ? `${prefix}spec.executionTarget.connectorRef` : 'spec.executionTarget.connectorRef'}
            label={
              formValues.spec.shell === 'PowerShell'
                ? getString('platform.secrets.typeWinRM')
                : getString('sshConnector')
            }
            expressions={expressions}
            allowableTypes={allowableTypes}
            disabled={readonly}
          />
          {getMultiTypeFromValue(formValues?.spec?.executionTarget?.connectorRef) === MultiTypeInputType.RUNTIME && (
            <ConfigureOptions
              value={formValues?.spec?.executionTarget?.connectorRef as string}
              type={
                <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                  <Text>{getString('pipelineSteps.connectorLabel')}</Text>
                </Layout.Horizontal>
              }
              variableName="spec.executionTarget.connectorRef"
              showRequiredField={false}
              showDefaultField={false}
              onChange={value => {
                setFieldValue('spec.executionTarget.connectorRef', value)
              }}
              style={{ marginTop: 4 }}
              isReadonly={readonly}
            />
          )}
        </div>
        <div className={cx(stepCss.formGroup, stepCss.md)}>
          <FormInput.MultiTextInput
            name={prefix ? `${prefix}spec.executionTarget.workingDirectory` : 'spec.executionTarget.workingDirectory'}
            placeholder={getString('cd.enterWorkDirectory')}
            label={getString('workingDirectory')}
            style={{ marginTop: 'var(--spacing-medium)' }}
            disabled={readonly}
            multiTextInputProps={{ expressions, disabled: readonly, allowableTypes }}
          />
          {getMultiTypeFromValue(formValues.spec?.executionTarget?.workingDirectory) === MultiTypeInputType.RUNTIME && (
            <ConfigureOptions
              value={formValues.spec?.executionTarget?.workingDirectory}
              type="String"
              variableName="spec.executionTarget.workingDirectory"
              showRequiredField={false}
              showDefaultField={false}
              onChange={value => setFieldValue('spec.executionTarget.workingDirectory', value)}
              style={{ marginTop: 12 }}
              isReadonly={readonly}
            />
          )}
        </div>
      </div>
    )
  }
  return <div />
}

export default function OptionalConfiguration(props: {
  formik: FormikProps<ShellScriptFormData>
  readonly?: boolean
  allowableTypes: AllowedTypes
  enableOutputVar?: boolean
  stepName?: string
}): React.ReactElement {
  const { formik, readonly, allowableTypes, enableOutputVar = true, stepName } = props
  const { projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()

  const { values: formValues, setFieldValue } = formik
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()

  const shellVariablesExportFF = useFeatureFlag(FeatureFlag.CDS_SHELL_VARIABLES_EXPORT)
  const scopeTypes = [
    {
      label: getString('common.pipeline'),
      value: 'Pipeline'
    },
    {
      label: getString('common.stage'),
      value: 'Stage'
    },
    {
      label: getString('stepGroup'),
      value: 'StepGroup'
    }
  ]

  return (
    <FormikForm>
      <div className={stepCss.stepPanel}>
        <div className={stepCss.formGroup}>
          <MultiTypeFieldSelector
            name="spec.environmentVariables"
            label={getString('pipeline.scriptInputVariables')}
            isOptional
            optionalLabel={getString('common.optionalLabel')}
            defaultValueToReset={[]}
            disableTypeSelection
            data-tooltip-id={`shellScriptInputVariable_${formValues?.spec?.shell}`}
            tooltipProps={{ dataTooltipId: `shellScriptInputVariable_${formValues?.spec?.shell}` }}
          >
            <FieldArray
              name="spec.environmentVariables"
              render={({ push, remove }) => {
                return (
                  <div className={css.panel}>
                    <div className={css.environmentVarHeader}>
                      <span className={css.label}>{getString('name')}</span>
                      <span className={css.label}>{getString('typeLabel')}</span>
                      <span className={css.label}>{getString('valueLabel')}</span>
                    </div>
                    {formValues.spec.environmentVariables?.map(({ id }: ShellScriptStepVariable, i: number) => {
                      return (
                        <div className={css.environmentVarHeader} key={id}>
                          <FormInput.Text
                            name={`spec.environmentVariables[${i}].name`}
                            placeholder={getString('name')}
                            disabled={readonly}
                          />
                          <FormInput.Select
                            items={scriptInputType}
                            name={`spec.environmentVariables[${i}].type`}
                            placeholder={getString('typeLabel')}
                            disabled={readonly}
                          />
                          <OptionalVariables
                            variablePath={`spec.environmentVariables[${i}].value`}
                            variableTypePath={`spec.environmentVariables[${i}].type`}
                            allowableTypes={allowableTypes}
                            readonly={readonly}
                          />
                          <Button
                            variation={ButtonVariation.ICON}
                            icon="main-trash"
                            data-testid={`remove-environmentVar-${i}`}
                            onClick={() => remove(i)}
                            disabled={readonly}
                          />
                        </div>
                      )
                    })}
                    <Button
                      icon="plus"
                      variation={ButtonVariation.LINK}
                      data-testid="add-environmentVar"
                      disabled={readonly}
                      onClick={() => push({ name: '', type: 'String', value: '', id: uuid() })}
                      className={css.addButton}
                    >
                      {getString('addInputVar')}
                    </Button>
                  </div>
                )
              }}
            />
          </MultiTypeFieldSelector>
        </div>
        {enableOutputVar ? (
          <div className={stepCss.formGroup}>
            <MultiTypeFieldSelector
              name="spec.outputVariables"
              label={getString('pipeline.scriptOutputVariables')}
              isOptional
              optionalLabel={getString('common.optionalLabel')}
              defaultValueToReset={[]}
              disableTypeSelection
              data-tooltip-id={`shellScriptOutputVariable_${formValues?.spec?.shell}`}
              tooltipProps={{ dataTooltipId: `shellScriptOutputVariable_${formValues?.spec?.shell}` }}
            >
              <FieldArray
                name="spec.outputVariables"
                render={({ push, remove }) => {
                  return (
                    <div className={css.panel}>
                      <div className={css.outputVarHeader}>
                        <span className={css.label}>{getString('name')}</span>
                        <span className={css.label}>{getString('typeLabel')}</span>
                        <span className={css.label}>
                          {getString('cd.steps.shellScriptOutputVariablesLabel', {
                            scriptType: formValues?.spec?.shell
                          })}
                        </span>
                      </div>
                      {formValues.spec.outputVariables?.map(({ id }: ShellScriptOutputStepVariable, i: number) => {
                        return (
                          <div className={css.outputVarHeader} key={id}>
                            <FormInput.Text
                              name={`spec.outputVariables[${i}].name`}
                              placeholder={getString('name')}
                              disabled={readonly}
                            />
                            <FormInput.Select
                              items={scriptOutputType}
                              name={`spec.outputVariables[${i}].type`}
                              placeholder={getString('typeLabel')}
                              disabled={readonly}
                            />

                            <OptionalVariables
                              variablePath={`spec.outputVariables[${i}].value`}
                              allowableTypes={allowableTypes}
                              readonly={readonly}
                              variableTypePath={`spec.outputVariables[${i}].type`}
                            />

                            <Button minimal icon="main-trash" onClick={() => remove(i)} disabled={readonly} />
                          </div>
                        )
                      })}
                      <Button
                        icon="plus"
                        variation={ButtonVariation.LINK}
                        onClick={() => push({ name: '', type: 'String', value: '', id: uuid() })}
                        disabled={readonly}
                        className={css.addButton}
                      >
                        {getString('addOutputVar')}
                      </Button>
                    </div>
                  )
                }}
              />
            </MultiTypeFieldSelector>
          </div>
        ) : null}

        {shellVariablesExportFF ? (
          <div className={stepCss.formGroup}>
            <Layout.Vertical>
              <Layout.Horizontal margin={{ bottom: 'medium' }}>
                <Text font={{ variation: FontVariation.FORM_INPUT_TEXT, weight: 'semi-bold' }} color={Color.GREY_600}>
                  {getString('pipeline.exportVars.label')}
                </Text>
              </Layout.Horizontal>
              <div className={cx(stepCss.formGroup, stepCss.lg)}>
                <FormInput.MultiTextInput
                  name={`spec.export.alias`}
                  label={getString('pipeline.exportVars.publishVarLabel')}
                  tooltipProps={{ dataTooltipId: 'publishVariableName' }}
                ></FormInput.MultiTextInput>

                {getMultiTypeFromValue(formValues.spec?.export?.alias) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec?.export?.alias}
                    type="String"
                    variableName="spec.export.alias"
                    showRequiredField={false}
                    showDefaultField={false}
                    onChange={value => setFieldValue('spec.export.alias', value)}
                    isReadonly={readonly}
                  />
                )}
              </div>
              <div className={cx(stepCss.formGroup, stepCss.lg)}>
                <FormInput.Select
                  items={scopeTypes}
                  name="spec.export.scope"
                  disabled={readonly}
                  label={getString('common.scopeLabel')}
                  placeholder={getString('pipeline.queueStep.scopePlaceholder')}
                  onChange={val => {
                    setFieldValue('spec.export.scope', val.value)
                  }}
                />
              </div>
            </Layout.Vertical>
          </div>
        ) : null}
        {stepName === StepType.SHELLSCRIPT ? (
          <>
            <Label className={css.execTargetLabel}>
              <HarnessDocTooltip tooltipId={'exec-target'} labelText={'Execution Target'} />
            </Label>
            <MultiTypeExecutionTargetGroup name="spec.onDelegate" formik={formik} readonly={readonly} />
            <MultiTypeDelegateSelector
              name={'spec.delegateSelectors'}
              disabled={readonly}
              inputProps={{ projectIdentifier, orgIdentifier }}
              expressions={expressions}
              allowableTypes={allowableTypes}
              enableConfigureOptions={true}
            />
            {getMultiTypeFromValue(formValues.spec?.onDelegate) === MultiTypeInputType.FIXED ? (
              <FixedExecTargetGroup
                expressions={expressions}
                readonly={readonly}
                allowableTypes={allowableTypes}
                formik={formik}
              />
            ) : null}
            {getMultiTypeFromValue(formValues.spec.onDelegate) === MultiTypeInputType.RUNTIME && (
              <ConfigureOptions
                value={formValues.spec.onDelegate as string}
                type="String"
                variableName="spec.onDelegate"
                className={css.minConfigBtn}
                showRequiredField={false}
                showDefaultField={false}
                onChange={value => setFieldValue('spec.onDelegate', value)}
                isReadonly={readonly}
              />
            )}
          </>
        ) : null}
      </div>
    </FormikForm>
  )
}

export function OptionalVariables({
  variablePath,
  allowableTypes,
  readonly,
  variableTypePath
}: {
  variablePath: string
  variableTypePath?: string
  allowableTypes: AllowedTypes
  readonly?: boolean
}): React.ReactElement {
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()

  const { values: formValues, setFieldValue } = useFormikContext()
  const variableValue = get(formValues, variablePath)
  const variableType = variableTypePath ? get(formValues, variableTypePath) : undefined
  const commasInAllowedValues = useFeatureFlag(FeatureFlag.PIE_MULTISELECT_AND_COMMA_IN_ALLOWED_VALUES)

  return (
    <Layout.Horizontal>
      <FormInput.MultiTextInput
        name={variablePath}
        placeholder={getString('valueLabel')}
        multiTextInputProps={{
          allowableTypes,
          expressions,
          disabled: readonly
        }}
        label=""
        disabled={readonly}
      />

      {isValueRuntimeInput(variableValue) && (
        <ConfigureOptions
          value={variableValue}
          type="String"
          variableName={variablePath}
          onChange={value => setFieldValue(variablePath, value)}
          isReadonly={readonly}
          tagsInputSeparator={commasInAllowedValues && variableType === 'String' ? '/[\n\r]/' : undefined}
        />
      )}
    </Layout.Horizontal>
  )
}
