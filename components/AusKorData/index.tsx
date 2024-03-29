import { FormControlLabel, Paper, Stack, Switch } from '@mui/material'
import { FC } from 'react'
import {
  FlexCenterDiv,
  FlexSpaceBetweenCenter,
  FlexVerticalCenterDiv,
  GridDiv
} from '../../common/uiComponents'
import { AusKorDataset } from '../../typing/interfaces'
import AUFlag from 'country-flag-icons/react/3x2/AU'
import KRFlag from 'country-flag-icons/react/3x2/KR'
import { ausKorValueHandler } from '../../common/functions'
import dayjs from 'dayjs'
import { COLOURS, KOR_DATE_WITHOUT_TIME_FORMAT } from '../../common/constants'
import styled from 'styled-components'
import { UnitType } from '../../typing/data'

const DescText = styled.div`
  font-size: 0.8rem;
  color: ${COLOURS.TEXT_GREY};
`

interface Props {
  ausKorDataset: AusKorDataset
}
const AusKorData: FC<Props> = ({ ausKorDataset }) => {
  const renderMainSubStrData = (
    unitType: UnitType,
    value: string
  ): JSX.Element => {
    const { mainData, subData } = ausKorValueHandler(unitType, value)
    return (
      <div>
        <span>{mainData}</span>
        {subData ? <small>{subData}</small> : <></>}
      </div>
    )
  }
  return (
    <>
      <FlexCenterDiv>호주 백과사전</FlexCenterDiv>
      <FlexSpaceBetweenCenter>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="한국 비교 데이터"
        />
        <div>
          <small>
            업데이트:{' '}
            {dayjs(ausKorDataset.createdAt).format(
              KOR_DATE_WITHOUT_TIME_FORMAT
            )}
          </small>
        </div>
      </FlexSpaceBetweenCenter>
      <Stack spacing={0.5}>
        {ausKorDataset.ausKorDataList.map(ausKorData => {
          return (
            <Paper
              variant="outlined"
              key={ausKorData.definition.dataLabelEng}
              style={{ padding: '10px 15px' }}
            >
              <GridDiv
                style={{ gridTemplateColumns: '1.5fr 2.5fr', gap: '6px' }}
              >
                <div>
                  <div>{ausKorData.definition.dataLabelKor}</div>
                  {ausKorData.data.ausKorCompare.aus.year && (
                    <div>{`(${ausKorData.data.ausKorCompare.aus.year})`}</div>
                  )}
                  <DescText>{ausKorData.definition.dataSourceType}</DescText>
                </div>
                {/* <div>{ausKorData.data.ausOnly.value}</div> */}
                <GridDiv style={{ gap: '5px' }}>
                  <FlexVerticalCenterDiv style={{ gap: '6px' }}>
                    <AUFlag style={{ width: '24px' }} />{' '}
                    {renderMainSubStrData(
                      ausKorData.definition.unitType,
                      ausKorData.data.ausKorCompare.aus.value
                    )}
                  </FlexVerticalCenterDiv>
                  <FlexVerticalCenterDiv style={{ gap: '6px' }}>
                    <KRFlag style={{ width: '24px' }} />{' '}
                    {renderMainSubStrData(
                      ausKorData.definition.unitType,
                      ausKorData.data.ausKorCompare.kor.value
                    )}
                  </FlexVerticalCenterDiv>
                  <DescText>{ausKorData.definition.dataDesc || ''}</DescText>
                </GridDiv>
              </GridDiv>
            </Paper>
          )
        })}
      </Stack>
    </>
  )
}

export default AusKorData
