import Box from '@mui/material/Box'
import { FC, useState, useCallback, useContext } from 'react'
import { FlexCenterDiv, GridDiv } from '../../../common/uiComponents'
import Stack from '@mui/material/Stack'
import {
  COLOURS,
  GUEST_UID,
  TEMP_KOR_AUS_RATE
} from '../../../common/constants'
import Button from '@mui/material/Button'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  CalculatorLogType,
  Feature,
  FinancialYear,
  FinancialYears
} from '../../../typing/enums'
import {
  CustomCurrencyInput,
  KoreanWonLabel,
  LabelWrapper,
  TaxDisclaimer
} from '.'
import {
  calculateWHTax,
  roundUpKoreanWonValue
} from '../../../common/functions'
import TaxInputBox from '../../../components/Calculator/TaxInputBox'
import { insertCalculatorLog } from '../../../common/insert'
import { UserContext } from '../../../common/context'
import dayjs from 'dayjs'
import { updateFeatureDetail } from '../../../common/update'
import Tooltip from '@mui/material/Tooltip'
import TableViewIcon from '@mui/icons-material/TableView'
import WhTaxRateDialog from '../../../components/Dialog/WhTaxRateDialog'
import { numToKorean, FormatOptions } from 'num-to-korean'

const Tax: FC = () => {
  const { user } = useContext(UserContext)
  const [gross, setGross] = useState(null)
  const [estimatedTax, setEstimatedTax] = useState(0)
  const [estimatedActualIncome, setEstimatedActualIncome] = useState(0)
  const [financialYear, setFinancialYear] = useState(FinancialYear.FY_2022_2023)
  const [taxRateTableOpen, setTaxRateTableOpen] = useState(false)

  const estimateTaxAmount = useCallback(() => {
    const taxReturnAmount = calculateWHTax(gross, false)
    setEstimatedTax(taxReturnAmount)
    setEstimatedActualIncome(gross - taxReturnAmount)
    try {
      insertCalculatorLog(
        user?.email || GUEST_UID,
        CalculatorLogType.WH_TAX,
        JSON.stringify({
          user: user || GUEST_UID,
          financialYear,
          gross,
          estimatedTax: taxReturnAmount,
          estimatedActualIncome: gross - taxReturnAmount,
          calculatedAt: dayjs().format()
        }),
        user?.uid || GUEST_UID
      )

      // update submit count
      updateFeatureDetail(Feature.WH_TAX, null, 1)
    } catch (err) {
      // no throwing error
      console.error(`ERROR in insertCalculatorLog. ${err.message}`)
    }
  }, [financialYear, gross, user])

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <TaxInputBox
          labels={{
            koreanTitle: '????????????',
            englishSubTitle: 'Financial Year'
          }}
          inputField={
            <GridDiv style={{ gridTemplateColumns: '1fr 40px', gap: '4px' }}>
              <Select
                labelId="tax-financial-year-select-label"
                id="tax-financial-year-order-select"
                value={financialYear}
                onChange={(event: SelectChangeEvent) => {
                  const fy = event.target.value as FinancialYear
                  setFinancialYear(fy)
                }}
                size="small"
                fullWidth
                style={{ height: '40px', backgroundColor: 'white' }}
              >
                {FinancialYears.map(fy => (
                  <MenuItem value={fy} key={fy}>
                    {fy}
                  </MenuItem>
                ))}
              </Select>
              <FlexCenterDiv>
                <Tooltip title="???????????????" placement="bottom" arrow>
                  <TableViewIcon
                    fontSize="medium"
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setTaxRateTableOpen(true)}
                  />
                </Tooltip>
              </FlexCenterDiv>
            </GridDiv>
          }
          infoTitle="???????????? (Financial Year)"
          infoContent={
            <div>
              <div>
                ????????? ??????????????? ????????? 7??? 1??? ?????? ?????? 6??? 30????????? ?????????.
              </div>
              <div style={{ paddingLeft: '8px' }}>
                <small>
                  ???) FY 2021-2022 = 2021??? 7??? 1??? ~ 2022??? 6??? 30???
                </small>
              </div>
            </div>
          }
        />
        <TaxInputBox
          labels={{
            koreanTitle: '??? ??????',
            englishSubTitle: 'Gross Income'
          }}
          inputField={
            <CustomCurrencyInput
              id="grossIncomeCurrencyInput"
              name="grossIncomeCurrencyInput"
              value={gross}
              onValueChange={(
                value
                // , _, values
              ) => {
                if (!value) {
                  setGross(Number(0))
                  return
                }
                setGross(Number(value))
              }}
              placeholder="$"
              prefix="$"
              // step={1}
            />
          }
          koreanWon={gross}
          infoTitle="??? ?????? (Gross Income)"
          infoContent={
            <div>????????? ????????????, ????????? ????????? 1????????? ??? ??????</div>
          }
        />
        <FlexCenterDiv style={{ margin: '25px 10px 0px 10px' }}>
          <Button variant="contained" onClick={() => estimateTaxAmount()}>
            ????????????
          </Button>
        </FlexCenterDiv>
        <GridDiv>
          <FlexCenterDiv>
            <h1
              style={{
                color: COLOURS.SECONDARY_BLUE,
                marginBottom: '5px',
                marginTop: '10px'
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(estimatedTax)}
            </h1>
          </FlexCenterDiv>
          <FlexCenterDiv>
            <KoreanWonLabel style={{ textAlign: 'center' }}>
              {estimatedTax
                ? `?????? ??? ${numToKorean(
                    roundUpKoreanWonValue(estimatedTax * TEMP_KOR_AUS_RATE),
                    FormatOptions.MIXED
                  )}???`
                : ''}
            </KoreanWonLabel>
          </FlexCenterDiv>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>?????? ??????</div>
              <div>
                <small>Estimated Tax</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
        </GridDiv>
        <GridDiv>
          <FlexCenterDiv>
            <h1
              style={{
                color: COLOURS.PRIMARY_BLUE,
                marginBottom: '5px',
                marginTop: '0px'
              }}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(estimatedActualIncome)}
            </h1>
          </FlexCenterDiv>
          <FlexCenterDiv>
            <KoreanWonLabel style={{ textAlign: 'center' }}>
              {estimatedActualIncome
                ? `?????? ??? ${numToKorean(
                    roundUpKoreanWonValue(
                      estimatedActualIncome * TEMP_KOR_AUS_RATE
                    ),
                    FormatOptions.MIXED
                  )}???`
                : ''}
            </KoreanWonLabel>
          </FlexCenterDiv>
          <FlexCenterDiv>
            <LabelWrapper>
              <div>?????? ?????????</div>
              <div>
                <small>Estimated Actual Income</small>
              </div>
            </LabelWrapper>
          </FlexCenterDiv>
        </GridDiv>
      </Stack>
      {TaxDisclaimer}
      {taxRateTableOpen && (
        <WhTaxRateDialog
          open={taxRateTableOpen}
          setOpen={setTaxRateTableOpen}
          financialYear={financialYear}
        />
      )}
    </Box>
  )
}

export default Tax
