import React from 'react';
import "./styles.scss"
import Chart from './Chart';
import { getItemFromLocalStorage } from 'utilities/getLocalStorageItem';
import { getThemeColors } from 'utilities/getThemeColors';

export default function OrgChart() {  
  const { primaryColor, secondaryColors } = getThemeColors();

  return (
    <div className='rounded p-4' >
      <div className='org-bg' style={{backgroundColor: secondaryColors.white}}>
        <Chart />
      </div>
    </div>
  );
}
