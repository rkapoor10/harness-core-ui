import React from 'react'
import cx from 'classnames'
import { Card, Container } from '@harness/uicore'
import { useServiceOverridesContext } from '@cd/components/ServiceOverrides/context/ServiceOverrideContext'
import EditableRow from './Editable/EditableRow'
import ViewOnlyRow from './ViewOnly/ViewOnlyRow'
import css from './ListRows.module.scss'

export default function ListRows(): React.ReactElement {
  const { listRowItems } = useServiceOverridesContext()

  return (
    <Container padding={{ right: 'xlarge', left: 'xlarge' }} className={css.listRowContainer}>
      {listRowItems.map((listRowItem, index) => {
        const { isNew, isEdit, isClone, overrideDetails, rowIndex, groupKey } = listRowItem
        const hasTopMargin = index === 0 ? false : groupKey !== listRowItems[index - 1].groupKey
        const hasTopBorder = index === 0 ? false : !hasTopMargin
        const hasTopBorderRadius = index === 0 || hasTopMargin
        const hasBottomBorderRadius =
          index === listRowItems.length - 1 ? true : groupKey !== listRowItems[index + 1].groupKey

        return (
          <React.Fragment key={groupKey + index}>
            {hasTopBorder && <Container height={1} />}
            <Card
              key={index}
              className={cx(css.listRowCard, {
                [css.topMargin]: hasTopMargin,
                [css.topBorderRadius]: hasTopBorderRadius,
                [css.bottomBorderRadius]: hasBottomBorderRadius,
                [css.roundedCard]: hasTopBorderRadius && hasBottomBorderRadius,
                [css.newOrEditCard]: isEdit
              })}
            >
              {isNew ? (
                <EditableRow rowIndex={rowIndex} isNew={isNew} isEdit={false} isClone={isClone} />
              ) : (
                overrideDetails &&
                (isEdit ? (
                  <EditableRow
                    rowIndex={rowIndex}
                    overrideDetails={overrideDetails}
                    isEdit={isEdit}
                    isClone={isClone}
                  />
                ) : (
                  <ViewOnlyRow rowIndex={rowIndex} overrideDetails={overrideDetails} />
                ))
              )}
            </Card>
          </React.Fragment>
        )
      })}
    </Container>
  )
}
