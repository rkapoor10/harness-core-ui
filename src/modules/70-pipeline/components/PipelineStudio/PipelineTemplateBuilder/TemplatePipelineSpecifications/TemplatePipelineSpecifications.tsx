/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { debounce, defaultTo, isEmpty, isEqual, noop, set } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { Container, Formik, FormikForm, Heading, Layout, PageError } from '@harness/uicore'
import { Color } from '@harness/design-system'
import type { FormikProps, FormikErrors } from 'formik'
import { produce } from 'immer'
import { getTemplateErrorMessage, replaceDefaultValues, TEMPLATE_INPUT_PATH } from '@pipeline/utils/templateUtils'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import {
  getsMergedTemplateInputYamlPromise,
  useGetTemplateInputSetYaml,
  useGetYamlWithTemplateRefsResolved
} from 'services/template-ng'
import {
  getIdentifierFromValue,
  getScopeBasedProjectPathParams,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { PageSpinner } from '@common/components'
import { PipelineInputSetFormInternal } from '@pipeline/components/PipelineInputSetForm/PipelineInputSetForm'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import type { PipelineInfoConfig } from 'services/pipeline-ng'
import { useStrings } from 'framework/strings'
import { validatePipeline } from '@pipeline/components/PipelineStudio/StepUtil'
import { ErrorsStrip } from '@pipeline/components/ErrorsStrip/ErrorsStrip'
import { useMutateAsGet } from '@common/hooks'
import { parse, stringify, yamlStringify } from '@common/utils/YamlHelperMethods'
import type { Pipeline } from '@pipeline/utils/types'
import { getGitQueryParamsWithParentScope } from '@common/utils/gitSyncUtils'
import css from './TemplatePipelineSpecifications.module.scss'

export function TemplatePipelineSpecifications(): JSX.Element {
  const {
    state: { pipeline, schemaErrors, gitDetails, storeMetadata },
    allowableTypes,
    updatePipeline,
    isReadonly,
    setIntermittentLoading
  } = usePipelineContext()
  const queryParams = useParams<ProjectPathProps>()
  const templateRef = getIdentifierFromValue(defaultTo(pipeline.template?.templateRef, ''))
  const templateVersionLabel = getIdentifierFromValue(defaultTo(pipeline.template?.versionLabel, ''))
  const templateScope = getScopeFromValue(defaultTo(pipeline.template?.templateRef, ''))
  const pipelineScope = getScopeFromDTO(pipeline)
  const [formValues, setFormValues] = React.useState<PipelineInfoConfig | undefined>()
  const [allValues, setAllValues] = React.useState<PipelineInfoConfig>()
  const [templateInputs, setTemplateInputs] = React.useState<PipelineInfoConfig | undefined>()
  const { getString } = useStrings()
  const formikRef = React.useRef<FormikProps<unknown> | null>(null)
  const formRefDom = React.useRef<HTMLElement | undefined>()
  const [formikErrors, setFormikErrors] = React.useState<FormikErrors<PipelineInfoConfig>>()
  const [showFormError, setShowFormError] = React.useState<boolean>()
  const viewTypeMetadata = { isTemplateBuilder: true }
  const [loadingMergedTemplateInputs, setLoadingMergedTemplateInputs] = React.useState<boolean>(false)

  const onChange = React.useCallback(
    debounce(async (values: PipelineInfoConfig): Promise<void> => {
      await updatePipeline({ ...pipeline, ...values })
    }, 300),
    [pipeline, updatePipeline]
  )

  const {
    data: templateInputSetYaml,
    error: templateInputSetError,
    refetch: refetchTemplateInputSet,
    loading: templateInputSetLoading
  } = useGetTemplateInputSetYaml({
    templateIdentifier: templateRef,
    queryParams: {
      ...getScopeBasedProjectPathParams(queryParams, templateScope),
      versionLabel: templateVersionLabel,
      ...getGitQueryParamsWithParentScope({
        storeMetadata,
        params: queryParams,
        repoIdentifier: gitDetails.repoIdentifier,
        branch: gitDetails.branch
      })
    }
  })

  const originalEntityYaml = React.useMemo(() => {
    const updatedPipelineWithOriginalInputs = produce(pipeline, draft => {
      set(draft, 'template.templateInputs', templateInputs)
    })

    return yamlStringify({ pipeline: updatedPipelineWithOriginalInputs })
  }, [pipeline, templateInputs])

  const {
    data: pipelineResponse,
    error: pipelineError,
    refetch: refetchPipeline,
    loading: pipelineLoading
  } = useMutateAsGet(useGetYamlWithTemplateRefsResolved, {
    queryParams: {
      ...getScopeBasedProjectPathParams(queryParams, pipelineScope),
      pipelineIdentifier: pipeline.identifier,
      ...getGitQueryParamsWithParentScope({
        storeMetadata,
        params: queryParams,
        repoIdentifier: gitDetails.repoIdentifier,
        branch: gitDetails.branch
      })
    },
    body: { originalEntityYaml },
    lazy: true
  })

  // All values need to be updated when pipelineResponse changes, even if mergedPipelineYaml is the same - this can happen when
  // version of linked pipeline template is changed. This ensures all values is updated after reset due to version change.
  React.useEffect(() => {
    if (!pipelineLoading) {
      setAllValues(parse<Pipeline>(defaultTo(pipelineResponse?.data?.mergedPipelineYaml, ''))?.pipeline)
    }
  }, [pipelineResponse?.data?.mergedPipelineYaml, pipelineLoading])

  const updateFormValues = (newTemplateInputs?: PipelineInfoConfig) => {
    const updatedPipeline = produce(pipeline, draft => {
      set(
        draft,
        'template.templateInputs',
        !isEmpty(newTemplateInputs) ? replaceDefaultValues(newTemplateInputs) : undefined
      )
    })
    setFormValues(updatedPipeline)
    updatePipeline(updatedPipeline)
  }

  React.useEffect(() => {
    if (!isEmpty(formValues) && !allValues) {
      refetchPipeline()
    }
  }, [formValues])

  const retainInputsAndUpdateFormValues = (newTemplateInputs?: PipelineInfoConfig) => {
    if (isEmpty(newTemplateInputs)) {
      updateFormValues(newTemplateInputs)
    } else {
      setLoadingMergedTemplateInputs(true)
      try {
        getsMergedTemplateInputYamlPromise({
          body: {
            oldTemplateInputs: stringify(defaultTo(pipeline?.template?.templateInputs, '')),
            newTemplateInputs: stringify(newTemplateInputs)
          },
          queryParams: {
            accountIdentifier: queryParams.accountId
          }
        }).then(response => {
          if (response && response.status === 'SUCCESS') {
            setLoadingMergedTemplateInputs(false)
            updateFormValues(parse<PipelineInfoConfig>(defaultTo(response.data?.mergedTemplateInputs, '')))
          } else {
            throw response
          }
        })
      } catch (error) {
        setLoadingMergedTemplateInputs(false)
        updateFormValues(newTemplateInputs)
      }
    }
  }

  React.useEffect(() => {
    if (templateInputSetLoading) {
      setTemplateInputs(undefined)
      setFormikErrors({})
      setAllValues(undefined)
      setFormValues(undefined)
    } else {
      const newTemplateInputs = parse<PipelineInfoConfig>(defaultTo(templateInputSetYaml?.data, ''))
      setTemplateInputs(newTemplateInputs)
      retainInputsAndUpdateFormValues(newTemplateInputs)
    }
  }, [templateInputSetLoading])

  React.useEffect(() => {
    if (schemaErrors) {
      formikRef.current?.submitForm()
      setShowFormError(true)
    }
  }, [schemaErrors])

  const validateForm = (values: PipelineInfoConfig) => {
    if (
      isEqual(values.template?.templateRef, pipeline.template?.templateRef) &&
      isEqual(values.template?.versionLabel, pipeline.template?.versionLabel) &&
      templateInputs
    ) {
      onChange?.(values)
      const errorsResponse = validatePipeline({
        pipeline: values.template?.templateInputs as PipelineInfoConfig,
        template: templateInputs,
        originalPipeline: allValues,
        getString,
        viewType: StepViewType.DeploymentForm,
        viewTypeMetadata
      })
      const newFormikErrors = set({}, TEMPLATE_INPUT_PATH, errorsResponse)
      setFormikErrors(newFormikErrors)
      return newFormikErrors
    } else {
      setFormikErrors({})
      return {}
    }
  }

  const refetch = () => {
    refetchPipeline()
    refetchTemplateInputSet()
  }

  const isLoading = pipelineLoading || templateInputSetLoading || loadingMergedTemplateInputs

  const error = defaultTo(templateInputSetError, pipelineError)

  /**
   * This effect disables/enables Save button on Pipeline and Template Studio
   * For gitx, template resolution takes a long time
   * If user clicks on Save button before resolution, template exception occurs
   */
  React.useEffect(() => {
    setIntermittentLoading(isLoading)

    // cleanup
    return () => {
      setIntermittentLoading(false)
    }
  }, [isLoading, setIntermittentLoading])

  return (
    <Container className={css.contentSection} height={'100%'} background={Color.FORM_BG}>
      {isLoading && <PageSpinner />}
      {!isLoading && error && (
        <PageError message={getTemplateErrorMessage(error, css.errorHandler)} onClick={() => refetch()} />
      )}
      {!isLoading && !error && templateInputs && allValues && formValues && (
        <>
          {showFormError && formikErrors && <ErrorsStrip formErrors={formikErrors} domRef={formRefDom} />}
          <Formik<PipelineInfoConfig>
            initialValues={formValues}
            formName="templateStageOverview"
            onSubmit={noop}
            validate={validateForm}
          >
            {(formik: FormikProps<PipelineInfoConfig>) => {
              formikRef.current = formik as FormikProps<unknown> | null
              return (
                <FormikForm>
                  <Container
                    className={css.inputsContainer}
                    ref={ref => {
                      formRefDom.current = ref as HTMLElement
                    }}
                  >
                    <Layout.Vertical padding={{ bottom: 'large' }} spacing={'xlarge'}>
                      <Heading level={5} color={Color.BLACK}>
                        {getString('pipeline.templateInputs')}
                      </Heading>
                      <Container>
                        <PipelineInputSetFormInternal
                          template={templateInputs}
                          originalPipeline={allValues}
                          path={TEMPLATE_INPUT_PATH}
                          readonly={isReadonly}
                          viewType={StepViewType.TemplateUsage}
                          allowableTypes={allowableTypes}
                          viewTypeMetadata={viewTypeMetadata}
                        />
                      </Container>
                    </Layout.Vertical>
                  </Container>
                </FormikForm>
              )
            }}
          </Formik>
        </>
      )}
    </Container>
  )
}
