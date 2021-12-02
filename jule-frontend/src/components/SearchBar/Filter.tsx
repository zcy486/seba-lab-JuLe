import React from "react";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select from "@mui/material/Select";

interface Props {
    name: string;
    options: any[];
    value: string;
    onChangeValue: (e: any) => void;
}

const Filter = ({name, options, value, onChangeValue}: Props) => {

    return (
        <FormControl sx={{mr: 2, minWidth: 140}}>
            <InputLabel id="label-id">{name}</InputLabel>
            <Select
                labelId="label-id"
                label={name}
                value={value}
                onChange={onChangeValue}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {options.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                            {option.name}
                        </MenuItem>
                    )
                )}
            </Select>
        </FormControl>
    )
}

export default Filter;