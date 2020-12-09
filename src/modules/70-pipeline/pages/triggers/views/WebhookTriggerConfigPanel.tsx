import React, { useState, useEffect } from 'react'
import { Layout, FormInput, SelectOption, Text, Heading } from '@wings-software/uikit'
import isEmpty from 'lodash/isEmpty'
import { useGetActionsList, useGetSourceRepoToEvent } from 'services/cd-ng'
import { AddDescriptionAndKVTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { useStrings } from 'framework/exports'
import { GitSourceProviders } from '../utils/TriggersListUtils'
import css from './WebhookTriggerConfigPanel.module.scss'

export interface WebhookTriggerConfigPanelPropsInterface {
  formikProps?: any
  isEdit?: boolean
}

const sourceRepoOptions = [
  { label: 'GitHub', value: GitSourceProviders.GITHUB.value },
  { label: 'GitLab', value: GitSourceProviders.GITLAB.value },
  { label: 'BitBucket', value: GitSourceProviders.BITBUCKET.value }
]

const WebhookTriggerConfigPanel: React.FC<WebhookTriggerConfigPanelPropsInterface> = ({
  formikProps,
  isEdit = false
}) => {
  const { sourceRepo, actions, event, description, tags } = formikProps.values
  const { data: ResponseSourceRepoToEvent, loading: loadingGetSourceRepoToEvent } = useGetSourceRepoToEvent({})
  const { data: actionsListResponse, refetch } = useGetActionsList({
    queryParams: { sourceRepo, event },
    lazy: true,
    debounce: 300
  })
  const [eventOptions, setEventOptions] = useState<SelectOption[]>([])
  const [actionsOptions, setActionsOptions] = useState<SelectOption[]>([]) // will need to get actions from api
  const { getString } = useStrings()
  const loading = loadingGetSourceRepoToEvent
  const defaultOpenFields = []
  if (description) {
    defaultOpenFields.push('description')
  }
  if (!isEmpty(tags)) {
    defaultOpenFields.push('tags')
  }
  useEffect(() => {
    if (sourceRepo && ResponseSourceRepoToEvent?.data?.[sourceRepo]) {
      const eventsList = ResponseSourceRepoToEvent.data[sourceRepo]
      if (eventsList.length) {
        setEventOptions(eventsList.map(e => ({ label: e, value: e })))
        if (event && !eventsList.includes(event)) {
          formikProps.setFieldValue('event', '')
        } else if (!isEmpty(event)) {
          refetch()
        }
      }
    }
  }, [ResponseSourceRepoToEvent?.data, sourceRepo])

  useEffect(() => {
    if (actionsListResponse?.data) {
      setActionsOptions(actionsListResponse.data.map(item => ({ label: item, value: item })))
    }
  }, [actionsListResponse?.data])

  useEffect(() => {
    if (!isEmpty(event) && !isEmpty(sourceRepo)) {
      refetch()
    }
  }, [event, sourceRepo])

  return (
    <Layout.Vertical className={css.webhookConfigurationContainer} padding="xxlarge">
      {loading && (
        <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
          <PageSpinner />
        </div>
      )}
      <h2 className={css.heading}>{`${getString('pipeline-triggers.triggerConfigurationLabel')}${
        !isEdit ? `: ${getString('pipeline-triggers.onNewWebhookTitle')}` : ''
      }`}</h2>
      <div style={{ backgroundColor: 'var(--white)' }}>
        <AddDescriptionAndKVTagsWithIdentifier
          className={css.triggerName}
          defaultOpenFields={defaultOpenFields}
          identifierProps={{
            inputLabel: getString('pipeline-triggers.triggerConfigurationPanel.triggerName'),
            isIdentifierEditable: !isEdit
          }}
        />
        <Heading className={css.listenOnNewWebhook} style={{ marginTop: '0!important' }} level={2}>
          {getString('pipeline-triggers.triggerConfigurationPanel.listenOnNewWebhook')}
        </Heading>
        <section style={{ width: '650px', marginTop: 'var(--spacing-small)' }}>
          <FormInput.Select
            label={getString('pipeline-triggers.triggerConfigurationPanel.payloadType')}
            name="sourceRepo"
            items={sourceRepoOptions}
          />
          <FormInput.Text name="repoUrl" label={getString('repositoryUrlLabel')} />
          <FormInput.Select
            key={event}
            label={getString('pipeline-triggers.triggerConfigurationPanel.event')}
            name="event"
            items={eventOptions}
          />
          <div className={css.actionsContainer}>
            <div>
              <Text style={{ fontSize: 13, marginBottom: 'var(--spacing-xsmall)' }}>
                {getString('pipeline-triggers.triggerConfigurationPanel.actions')}
              </Text>
              <FormInput.MultiSelect
                name="actions"
                items={actionsOptions}
                // yaml design: empty array means selecting all
                disabled={Array.isArray(actions) && isEmpty(actions)}
                onChange={e => {
                  if (!e || (Array.isArray(e) && isEmpty(e))) {
                    formikProps.setFieldValue('actions', undefined)
                  } else {
                    formikProps.setFieldValue('actions', e)
                  }
                }}
              />
            </div>
            <FormInput.CheckBox
              name="anyAction"
              key={Date.now()}
              label={getString('pipeline-triggers.triggerConfigurationPanel.anyActions')}
              defaultChecked={Array.isArray(actions) && actions.length === 0}
              className={css.anyAction}
              onClick={(e: React.FormEvent<HTMLInputElement>) => {
                if (e.currentTarget?.checked) {
                  formikProps.setFieldValue('actions', [])
                } else {
                  formikProps.setFieldValue('actions', undefined)
                }
              }}
            />
          </div>
        </section>
      </div>
    </Layout.Vertical>
  )
}
export default WebhookTriggerConfigPanel
