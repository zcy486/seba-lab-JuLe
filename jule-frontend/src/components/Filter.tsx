import React from "react";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";

interface Props {
    name: string;
    options: any[];
}

const Filter = ({name, options}: Props) => {

    const [value, setValue] = React.useState("");

    const handleChange = (e: SelectChangeEvent) => {
        setValue(e.target.value)
    }

    return (
        <FormControl variant="filled" sx={{mr:1, maxHeight:50, minWidth: 120}}>
            <InputLabel id="label-id">{name}</InputLabel>
            <Select
                labelId="label-id"
                value={value}
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {options.map((option) => (
                        <MenuItem value={option}>
                            {option}
                        </MenuItem>
                    )
                )}
            </Select>
        </FormControl>
    )
}

export default Filter;