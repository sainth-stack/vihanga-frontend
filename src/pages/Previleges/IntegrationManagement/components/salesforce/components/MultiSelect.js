import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelectCheckmarks({ status, setStatus }) {

  const handleChange = (event) => {
    setStatus(event.target.value === 'Enabled');
  };

  return (
    <div>
      <FormControl 
        sx={{
            height: "44px",
            ".MuiInputBase-root": {
                border: "1px solid #e5e5e5 !important",
                height: "44px"
            },
            ".Mui-focused": {
                border: "1px solid #e5e5e5"
            },
            ".MuiOutlinedInput-notchedOutline": {
                border: "1px solid #e5e5e5",
                borderColor: "black !important"
            }
        }}
    >
        <Select
          value={status ? 'Enabled' : 'Disabled'}
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {['Enabled', 'Disabled'].map((stat) => (
            <MenuItem key={stat} value={stat}>
              <ListItemText primary={stat} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
