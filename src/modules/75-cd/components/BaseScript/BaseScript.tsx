/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { FormEvent } from 'react'
import type { FormikProps } from 'formik'
import cx from 'classnames'
import { get } from 'lodash-es'

import {
  FormInput,
  getMultiTypeFromValue,
  MultiTypeInputType,
  SelectOption,
  AllowedTypes,
  ExpressionInput,
  EXPRESSION_INPUT_PLACEHOLDER
} from '@harness/uicore'
import { useStrings } from 'framework/strings'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { ShellScriptMonacoField, ScriptType } from '@common/components/ShellScriptMonaco/ShellScriptMonaco'
import FileStoreSelectField from '@platform/filestore/components/MultiTypeFileSelect/FileStoreSelect/FileStoreSelectField'
import { FileUsage } from '@platform/filestore/interfaces/FileStore'

import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'
import type { ShellScriptFormData } from '@cd/components/PipelineSteps/ShellScriptStep/shellScriptTypes'
import MultiTypeConfigFileSelect from '@pipeline/components/StartupScriptSelection/MultiTypeConfigFileSelect'
import { LocationType } from '../PipelineSteps/CommandScripts/CommandScriptsTypes'
import stepCss from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'
import css from '../PipelineSteps/ShellScriptStep/ShellScript.module.scss'

export const shellScriptType: SelectOption[] = [
  { label: 'Bash', value: 'Bash' },
  { label: 'PowerShell', value: 'PowerShell' }
]

export default function BaseScript(props: {
  formik: FormikProps<ShellScriptFormData>
  readonly?: boolean
  allowableTypes: AllowedTypes
}): React.ReactElement {
  const { formik, readonly, allowableTypes } = props
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  const { values: formValues, setFieldValue } = formik
  const scriptType: ScriptType = formValues.spec.shell || 'Bash'

  return (
    <>
      <div className={cx(stepCss.formGroup, stepCss.sm)}>
        <FormInput.Select
          items={shellScriptType}
          name="spec.shell"
          disabled={readonly}
          label={getString('common.scriptType')}
          placeholder={getString('common.scriptType')}
          onChange={() => {
            setFieldValue('spec.onDelegate', 'delegate')
          }}
        />
      </div>
      <FormInput.RadioGroup
        name="spec.source.type"
        label={getString('cd.steps.commands.selectScriptLocation')}
        items={[
          {
            label: getString('cd.steps.commands.locationFileStore'),
            value: LocationType.HARNESS
          },
          {
            label: getString('inline'),
            value: LocationType.INLINE
          }
        ]}
        radioGroup={{ inline: true }}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          if (e.currentTarget?.value === LocationType.HARNESS) {
            setFieldValue('spec.source.spec.script', undefined)
          } else {
            setFieldValue('spec.source.spec.file', undefined)
          }
        }}
      />
      {formik?.values?.spec?.source?.type === LocationType.INLINE ? (
        <div className={cx(stepCss.formGroup)}>
          <MultiTypeFieldSelector
            name="spec.source.spec.script"
            label={getString('common.script')}
            defaultValueToReset=""
            disabled={readonly}
            allowedTypes={allowableTypes}
            disableTypeSelection={readonly}
            skipRenderValueInExpressionLabel
            expressionRender={() => {
              return (
                <ShellScriptMonacoField
                  name="spec.source.spec.script"
                  scriptType={scriptType}
                  disabled={readonly}
                  expressions={expressions}
                />
              )
            }}
          >
            <ShellScriptMonacoField
              name="spec.source.spec.script"
              scriptType={scriptType}
              disabled={readonly}
              expressions={expressions}
            />
          </MultiTypeFieldSelector>
          {getMultiTypeFromValue(formValues.spec.source?.spec?.script) === MultiTypeInputType.RUNTIME && (
            <ConfigureOptions
              value={formValues.spec?.source?.spec?.script as string}
              type="String"
              variableName="spec.source.spec.script"
              className={css.minConfigBtn}
              showRequiredField={false}
              showDefaultField={false}
              onChange={/* istanbul ignore next */ value => setFieldValue('spec.source.spec.script', value)}
              isReadonly={readonly}
            />
          )}
        </div>
      ) : null}
      {formik?.values?.spec?.source?.type === LocationType.HARNESS ? (
        <MultiTypeConfigFileSelect
          name={'spec.source.spec.file'}
          label={''}
          defaultValueToReset={''}
          hideError={true}
          style={{ marginBottom: 0, marginTop: 0 }}
          disableTypeSelection={false}
          supportListOfExpressions={true}
          onTypeChange={() => {
            formik?.setFieldValue('spec.source.spec.script', undefined)
          }}
          defaultType={getMultiTypeFromValue(
            get(formik?.values, 'spec.source.spec.file'),
            [MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION, MultiTypeInputType.RUNTIME],
            true
          )}
          allowedTypes={[MultiTypeInputType.FIXED, MultiTypeInputType.EXPRESSION, MultiTypeInputType.RUNTIME]}
          expressionRender={() => {
            return (
              <ExpressionInput
                name={'spec.source.spec.file'}
                value={get(formik?.values, 'spec.source.spec.file')}
                disabled={false}
                inputProps={{ placeholder: EXPRESSION_INPUT_PLACEHOLDER }}
                items={expressions}
                onChange={val =>
                  /* istanbul ignore next */
                  formik?.setFieldValue('spec.source.spec.file', val)
                }
              />
            )
          }}
        >
          <FileStoreSelectField
            label={getString('common.git.filePath')}
            name="spec.source.spec.file"
            onChange={newValue => {
              formik?.setFieldValue('spec.source.spec.file', newValue)
              formik?.setFieldValue('spec.source.spec.script', undefined)
            }}
            fileUsage={FileUsage.SCRIPT}
          />
        </MultiTypeConfigFileSelect>
      ) : null}
    </>
  )
}
