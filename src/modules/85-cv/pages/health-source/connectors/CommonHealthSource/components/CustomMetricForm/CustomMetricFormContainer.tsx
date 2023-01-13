/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { MutableRefObject, useContext, useEffect, useRef, useState } from 'react'
import { useModalHook } from '@harness/use-modal'
import {
  Button,
  ButtonVariation,
  Container,
  Dialog,
  getMultiTypeFromValue,
  MultiTypeInputType,
  SelectOption
} from '@harness/uicore'
import { Formik, useFormikContext } from 'formik'
import { defaultTo } from 'lodash-es'
import type { CustomHealthMetricDefinition } from 'services/cv'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import { initializeGroupNames } from '@cv/components/GroupName/GroupName.utils'
import { useStrings } from 'framework/strings'
import CardWithOuterTitle from '@common/components/CardWithOuterTitle/CardWithOuterTitle'
import CommonCustomMetric from '@cv/pages/health-source/common/CommonCustomMetric/CommonCustomMetric'
import type { CommonCustomMetricFormikInterface } from '../../CommonHealthSource.types'
import type { AddMetricForm, CustomMetricFormContainerProps } from './CustomMetricForm.types'
import {
  cleanUpMappedMetrics,
  getAddMetricInitialValues,
  getHealthSourceConfigDetails,
  getUpdatedMappedMetricsData,
  initHealthSourceCustomFormValue,
  updateParentFormikWithLatestData,
  validateAddMetricForm
} from './CustomMetricFormContainer.utils'
import { resetShowCustomMetric } from '../../CommonHealthSource.utils'
import AddMetric from './components/AddMetric/AddMetric'
import CustomMetricForm from './CustomMetricForm'
import { CommonConfigurationsFormFieldNames, CustomMetricFormFieldNames } from '../../CommonHealthSource.constants'
import { useCommonHealthSource } from './components/CommonHealthSourceContext/useCommonHealthSource'
import css from './CustomMetricForm.module.scss'

export default function CustomMetricFormContainer(props: CustomMetricFormContainerProps): JSX.Element {
  const { getString } = useStrings()
  const {
    mappedMetrics,
    selectedMetric,
    isMetricThresholdEnabled,
    createdMetrics,
    healthSourceConfig,
    groupedCreatedMetrics,
    isTemplate,
    expressions,
    connectorIdentifier: connectorRef,
    filterRemovedMetricNameThresholds
  } = props

  const {
    values: formValues,
    setValues,
    validateForm,
    setFieldTouched
  } = useFormikContext<CommonCustomMetricFormikInterface>()
  const wrapperRef = useRef(null)
  useUpdateConfigFormikOnOutsideClick(wrapperRef, mappedMetrics, selectedMetric, formValues)
  const { enabledDefaultGroupName, fieldLabel, shouldBeAbleToDeleteLastMetric, enabledRecordsAndQuery } =
    getHealthSourceConfigDetails(healthSourceConfig)
  const {
    sourceData: { existingMetricDetails }
  } = useContext(SetupSourceTabsContext)
  const { updateParentFormik } = useCommonHealthSource()
  const isConnectorRuntimeOrExpression = getMultiTypeFromValue(connectorRef) !== MultiTypeInputType.FIXED
  const [groupNames, setGroupName] = useState<SelectOption[]>(initializeGroupNames(mappedMetrics, getString))
  const [showCustomMetric, setShowCustomMetric] = useState(
    !!Array.from(defaultTo(mappedMetrics, []))?.length && healthSourceConfig?.customMetrics?.enabled
  )
  const metricDefinitions = existingMetricDetails?.spec?.metricDefinitions
  const currentSelectedMetricDetail = metricDefinitions?.find(
    (metricDefinition: CustomHealthMetricDefinition) =>
      metricDefinition.metricName === mappedMetrics.get(selectedMetric || '')?.metricName
  )
  const isEdit = Boolean(formValues?.identifier)

  function useUpdateConfigFormikOnOutsideClick(
    ref: MutableRefObject<any>,
    mappedMetricsData: Map<string, CommonCustomMetricFormikInterface>,
    selectedMetricName: string,
    formValuesData: CommonCustomMetricFormikInterface
  ): void {
    useEffect(() => {
      //  update Parent formik when clicked outside.
      async function handleClickOutside(event: { target: unknown }): Promise<void> {
        if (
          ref.current &&
          !ref.current.contains(event.target)
          // && !isEqual(mappedMetricsData.get(selectedMetricName), formValuesData)
        ) {
          // This will be executed only when current form value changes.
          const updatedMappedMetricsData = getUpdatedMappedMetricsData(
            mappedMetricsData,
            selectedMetricName,
            formValuesData
          )
          setFieldTouched(CustomMetricFormFieldNames.QUERY)
          await validateForm()
          updateParentFormikWithLatestData(updateParentFormik, updatedMappedMetricsData, selectedMetricName)
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [mappedMetricsData, ref, selectedMetricName, formValuesData])
  }

  useEffect(() => {
    resetShowCustomMetric(selectedMetric, mappedMetrics, setShowCustomMetric)
  }, [mappedMetrics, selectedMetric])

  const [openModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen
        usePortal
        autoFocus
        canEscapeKeyClose
        canOutsideClickClose
        enforceFocus={false}
        onClose={() => {
          hideModal()
          updateParentFormik(CommonConfigurationsFormFieldNames.SELECTED_METRIC, createdMetrics[0])
        }}
      >
        <Formik<AddMetricForm>
          initialValues={getAddMetricInitialValues(formValues, enabledDefaultGroupName)}
          onSubmit={values => {
            const updatedValues = { ...formValues, ...values }
            setValues(updatedValues)
            hideModal()
            setShowCustomMetric(true)
          }}
          onReset={() => {
            hideModal()
            cleanUpMappedMetrics(mappedMetrics)
            updateParentFormikWithLatestData(updateParentFormik, mappedMetrics, createdMetrics[0])
          }}
          validate={data => {
            return validateAddMetricForm(data, getString, createdMetrics, groupedCreatedMetrics, fieldLabel)
          }}
        >
          {() => {
            return (
              <AddMetric
                enableDefaultGroupName={enabledDefaultGroupName}
                currentSelectedMetricDetail={currentSelectedMetricDetail}
                groupNames={groupNames}
                setGroupName={setGroupName}
                fieldLabel={fieldLabel}
                isEdit={isEdit}
              />
            )
          }}
        </Formik>
      </Dialog>
    ),
    [formValues, groupNames, currentSelectedMetricDetail]
  )

  return (
    <>
      {showCustomMetric ? (
        <CardWithOuterTitle
          title={getString('cv.healthSource.connectors.customMetricsWithoutOptional')}
          dataTooltipId={'customMetricsTitle'}
          cardSectionClassName={css.customMetricContainer}
        >
          <CommonCustomMetric
            selectedMetric={selectedMetric}
            formikValues={formValues}
            mappedMetrics={mappedMetrics}
            createdMetrics={createdMetrics}
            groupedCreatedMetrics={groupedCreatedMetrics}
            defaultMetricName={'healthSourceMetric'}
            tooptipMessage={getString('cv.monitoringSources.gcoLogs.addQueryTooltip')}
            addFieldLabel={getString('common.addName', {
              name: fieldLabel
            })}
            initCustomForm={initHealthSourceCustomFormValue()}
            shouldBeAbleToDeleteLastMetric={shouldBeAbleToDeleteLastMetric}
            isMetricThresholdEnabled={isMetricThresholdEnabled}
            filterRemovedMetricNameThresholds={filterRemovedMetricNameThresholds}
            openEditMetricModal={openModal}
            defaultServiceInstance={healthSourceConfig.customMetrics?.assign?.defaultServiceInstance}
          >
            <Container ref={wrapperRef}>
              <CustomMetricForm
                connectorIdentifier={connectorRef}
                isTemplate={isTemplate}
                expressions={expressions}
                isConnectorRuntimeOrExpression={isConnectorRuntimeOrExpression}
                enabledRecordsAndQuery={enabledRecordsAndQuery}
                healthSourceConfig={healthSourceConfig}
              />
            </Container>
          </CommonCustomMetric>
        </CardWithOuterTitle>
      ) : (
        <Button
          icon="plus"
          variation={ButtonVariation.SECONDARY}
          onClick={openModal}
          margin={{ left: 'medium', bottom: 'small', top: 'medium' }}
        >
          {getString('common.addName', {
            name: fieldLabel
          })}
        </Button>
      )}
    </>
  )
}
