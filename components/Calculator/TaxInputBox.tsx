import { FC, useState } from 'react'
import { TEMP_KOR_AUS_RATE } from '../../common/constants'
import { roundUpKoreanWonValue } from '../../common/functions'
import { FlexCenterDiv, GridDiv } from '../../common/uiComponents'
import {
  CustomInfoIcon,
  KoreanWonLabel,
  LabelWrapper
} from '../../pages/calculator/wh'
import InfoDialog from '../Dialog/InfoDialog'
import { numToKorean, FormatOptions } from 'num-to-korean'

interface Props {
  labels: {
    koreanTitle: string
    englishSubTitle: string
  }
  inputField: JSX.Element
  koreanWon?: number
  infoTitle?: string
  infoContent?: JSX.Element
}
const TaxInputBox: FC<Props> = ({
  labels,
  inputField,
  koreanWon,
  infoTitle,
  infoContent
}) => {
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  return (
    <>
      <GridDiv
        style={{ gridTemplateColumns: '120px 1fr', alignItems: 'center' }}
      >
        <FlexCenterDiv>
          <LabelWrapper>
            <FlexCenterDiv style={{ gap: '2px' }}>
              <div>{labels.koreanTitle}</div>
              <CustomInfoIcon onClick={() => setOpenInfoDialog(true)} />
            </FlexCenterDiv>
            <div>
              <small>{labels.englishSubTitle}</small>
            </div>
          </LabelWrapper>
        </FlexCenterDiv>
        <div style={{ width: '100%' }}>
          {inputField}
          <KoreanWonLabel>
            {koreanWon ? (
              <>
                한화 약{' '}
                {numToKorean(
                  roundUpKoreanWonValue(koreanWon * TEMP_KOR_AUS_RATE),
                  FormatOptions.MIXED
                )}{' '}
                원
              </>
            ) : (
              <div style={{ height: '18px' }}></div>
            )}
          </KoreanWonLabel>
        </div>
      </GridDiv>
      {infoContent && (
        <InfoDialog
          open={openInfoDialog}
          setOpen={setOpenInfoDialog}
          title={infoTitle}
          content={infoContent}
        />
      )}
    </>
  )
}

export default TaxInputBox
