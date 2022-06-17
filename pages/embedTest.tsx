import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { FC, useState, SyntheticEvent } from 'react'
import styled from 'styled-components'
import { relabelDomainEmbeddedHtml } from '../common/functions'
import HouseIcon from '@mui/icons-material/House'
import ApartmentIcon from '@mui/icons-material/Apartment'

const DomainTableWrapper = styled.div`
  overflow: auto;
  width: 100vw; // this is not the best solution
  max-width: 600px;
  font-size: 16px;
  table {
    padding: 5px 10px;
  }
  tr {
    box-shadow: inset 0 -1px #e9e6ef;
  }
  td {
    padding: 12px 8px;
  }
  .css-4knjz3 {
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }
  .table_source {
    padding-left: 4px;
    margin-bottom: 10px;
  }
`

const embeddedHtml = `<div class='embed_table'><table class="css-lf8x"><thead><tr class="css-4l54jr"><th class="css-kzs65o">Capital City</th><th class="css-kzs65o">Mar-22</th><th class="css-kzs65o">Dec-21</th><th class="css-kzs65o">Mar-21</th><th class="css-kzs65o">QoQ</th><th class="css-kzs65o">YoY</th></tr></thead><tbody><tr class="css-waa0b"><td class="css-kzs65o">Sydney</td><td class="css-kzs65o">$1,590,932 </td><td class="css-kzs65o">$1,588,423 </td><td class="css-kzs65o">$1,314,383 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">0.2%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">21.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Melbourne</td><td class="css-kzs65o">$1,092,144 </td><td class="css-kzs65o">$1,099,419 </td><td class="css-kzs65o">$981,401 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">0.7%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">11.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Brisbane</td><td class="css-kzs65o">$831,346 </td><td class="css-kzs65o">$806,117 </td><td class="css-kzs65o">$629,499 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">3.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">32.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adelaide</td><td class="css-kzs65o">$750,084 </td><td class="css-kzs65o">$728,342 </td><td class="css-kzs65o">$585,384 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">3.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">28.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Canberra</td><td class="css-kzs65o">$1,124,952 </td><td class="css-kzs65o">$1,134,678 </td><td class="css-kzs65o">$929,201 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">0.9%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">21.1%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Perth</td><td class="css-kzs65o">$622,030 </td><td class="css-kzs65o">$612,926 </td><td class="css-kzs65o">$592,537 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Hobart</td><td class="css-kzs65o">$758,141 </td><td class="css-kzs65o">$727,099 </td><td class="css-kzs65o">$604,103 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">4.3%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">25.5%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Darwin</td><td class="css-kzs65o">$635,389 </td><td class="css-kzs65o">$647,156 </td><td class="css-kzs65o">$543,246 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">1.8%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">17.0%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">National</td><td class="css-kzs65o">$1,069,289 </td><td class="css-kzs65o">$1,062,537 </td><td class="css-kzs65o">$902,829 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">0.6%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">18.4%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"></tr></tbody></table><div class='table_source'>Source: <a href='https://www.domain.com.au/research/house-price-report/march-2022/#darwin?utm_source=web&amp;utm_medium=referral&amp;utm_campaign=tableembed' target="_blank">Domain</a></div></div>`
// const embeddedHtml = `<div class='embed_table'><table class="css-lf8x"><thead><tr class="css-4l54jr"><th class="css-kzs65o">Capital City</th><th class="css-kzs65o">Dec-19</th><th class="css-kzs65o">Sep-19</th><th class="css-kzs65o">Dec-18</th><th class="css-kzs65o">QoQ</th><th class="css-kzs65o">YoY</th></tr></thead><tbody><tr class="css-waa0b"><td class="css-kzs65o">Sydney</td><td class="css-kzs65o">$1,142,212</td><td class="css-kzs65o">$1,081,013</td><td class="css-kzs65o">$1,069,139</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.7<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">6.8<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Melbourne</td><td class="css-kzs65o">$901,951</td><td class="css-kzs65o">$858,745</td><td class="css-kzs65o">$830,074</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.0<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">8.7<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Brisbane</td><td class="css-kzs65o">$577,664</td><td class="css-kzs65o">$570,524</td><td class="css-kzs65o">$569,230</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.3<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.5<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adelaide</td><td class="css-kzs65o">$542,947</td><td class="css-kzs65o">$536,186</td><td class="css-kzs65o">$536,961</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.3<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">1.1<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Perth</td><td class="css-kzs65o">$537,013</td><td class="css-kzs65o">$533,153</td><td class="css-kzs65o">$547,268</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">0.7<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">1.9<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Hobart</td><td class="css-kzs65o">$530,570</td><td class="css-kzs65o">$489,093</td><td class="css-kzs65o">$459,122</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">8.5<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">15.6<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Canberra</td><td class="css-kzs65o">$788,621</td><td class="css-kzs65o">$734,852</td><td class="css-kzs65o">$748,115</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">7.3<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.4<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Darwin</td><td class="css-kzs65o">$509,452</td><td class="css-kzs65o">$524,984</td><td class="css-kzs65o">$514,876</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">3.0<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">-</span><span class="css-6nfh2o">1.1<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12L0 0L16 0L8 12Z" fill="#FF411B"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Combined Capitals</td><td class="css-kzs65o">$809,349</td><td class="css-kzs65o">$776,891</td><td class="css-kzs65o">$767,517</td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">4.2<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">5.5<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr></tbody></table><div class='table_source'>Source: <a href='https://www.domain.com.au/research/house-price-report/december-2019/?utm_source=web&amp;utm_medium=referral&amp;utm_campaign=tableembed' target="_blank">Domain</a></div></div>`
const cleanEmbeddedHtml = relabelDomainEmbeddedHtml(embeddedHtml)
// const embeddedHtml2 = `<div class='embed_table'><table class="css-lf8x"><thead><tr class="css-4l54jr"><th class="css-kzs65o">Houses</th><th class="css-kzs65o">Median</th><th class="css-kzs65o">YoY</th><th class="css-kzs65o">5-YR</th></tr></thead><tbody><tr class="css-waa0b"><td class="css-kzs65o">Abbotsford</td><td class="css-kzs65o">$2,845,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">NaN<!-- -->%</span><span></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">NaN<!-- -->%</span><span></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Aberdare</td><td class="css-kzs65o">$502,500 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">NaN<!-- -->%</span><span></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">NaN<!-- -->%</span><span></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Aberdeen</td><td class="css-kzs65o">$400,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">10.5<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj"></span><span class="css-6nfh2o">NaN<!-- -->%</span><span></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Aberglasslyn</td><td class="css-kzs65o">$677,500 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">26.6<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">52.2<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Acacia Gardens</td><td class="css-kzs65o">$1,162,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">31.7<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">42.0<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adamstown</td><td class="css-kzs65o">$917,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">23.1<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">59.5<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Adamstown Heights</td><td class="css-kzs65o">$927,500 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">15.2<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">41.6<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Albion Park</td><td class="css-kzs65o">$750,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">21.0<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">37.6<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Albion Park Rail</td><td class="css-kzs65o">$710,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">21.4<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">45.7<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr><tr class="css-waa0b"><td class="css-kzs65o">Albury</td><td class="css-kzs65o">$780,000 </td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">25.6<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td><td class="css-kzs65o"><div class="css-4knjz3"><span class="css-x1p5yj">+</span><span class="css-6nfh2o">57.6<!-- -->%</span><span><svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0L16 12H0L8 0Z" fill="#30AF29"></path></svg></span></div></td></tr></tbody></table><div class='table_source'>Source: <a href='https://www.domain.com.au/research/house-price-report/march-2022/#darwin?utm_source=web&utm_medium=referral&utm_campaign=tableembed?utm_source=web&amp;utm_medium=referral&amp;utm_campaign=tableembed' target="_blank">Domain</a></div></div>`

const EmbedTest: FC = () => {
  const [value, setValue] = useState(0)
  const [houseUnitTabValue, setHouseUnitTabValue] = useState(0)
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const handleHouseUnitTab = (event: SyntheticEvent, newValue: number) => {
    setHouseUnitTabValue(newValue)
  }

  return (
    <div style={{ width: '100vw', maxWidth: '600px' }}>
      <Box
        style={{
          width: '100%'
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="2022년 3월" />
          <Tab label="2021년 12월" />
          <Tab label="2021년 9월" />
          <Tab label="2021년 6월" />
          <Tab label="2021년 3월" />
          <Tab label="2020년 12월" />
          <Tab label="2020년 9월" />
          <Tab label="2020년 6월" />
          <Tab label="2020년 3월" />
          <Tab label="2019년 12월" />
        </Tabs>
      </Box>
      <Box style={{ width: '100%' }}>
        <Tabs
          value={houseUnitTabValue}
          onChange={handleHouseUnitTab}
          aria-label="icon position tabs example"
          variant="fullWidth"
          centered
        >
          <Tab icon={<HouseIcon />} iconPosition="start" label="하우스" />
          <Tab icon={<ApartmentIcon />} iconPosition="start" label="유닛" />
          {/* <Tab icon={<FavoriteIcon />} iconPosition="end" label="end" />
  <Tab icon={<PersonPinIcon />} iconPosition="bottom" label="bottom" /> */}
        </Tabs>
      </Box>
      <DomainTableWrapper>
        <div dangerouslySetInnerHTML={{ __html: cleanEmbeddedHtml }} />
      </DomainTableWrapper>
    </div>
  )
}

export default EmbedTest