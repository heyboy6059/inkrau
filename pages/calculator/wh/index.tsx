import { FC, useState, SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { FlexCenterDiv } from '../../../common/uiComponents'
import { FcCalculator } from 'react-icons/fc'
import CurrencyInput from 'react-currency-input-field'
import TaxReturn from './taxReturn'
import styled from 'styled-components'

export const LabelWrapper = styled.div`
  text-align: center;
`

export const CustomCurrencyInput = styled(CurrencyInput)`
  height: 40px;
  border: 1px solid lightgray;
  border-radius: 5px;
  font-size: 1.2rem;
`

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const WorkingHolidayCalculator: FC = () => {
  const theme = useTheme()
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <FlexCenterDiv style={{ marginTop: '10px' }}>
        <FcCalculator fontSize={24} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          워킹홀리데이 세금 계산기
        </Typography>
      </FlexCenterDiv>
      <Tabs value={value} onChange={handleChange} variant="fullWidth" centered>
        <Tab
          label={
            <Typography sx={{ fontWeight: 'bold' }}>
              환급<small style={{ fontSize: '10px' }}>(Tax Return)</small>
            </Typography>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={
            <Typography sx={{ fontWeight: 'bold' }}>
              세금<small style={{ fontSize: '10px' }}>(Tax)</small>
            </Typography>
          }
          {...a11yProps(1)}
        />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <TaxReturn />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <Box></Box>
      </TabPanel>
    </Box>
  )
}

export default WorkingHolidayCalculator
