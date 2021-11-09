import React from "react";
import {makeStyles} from "@material-ui/styles";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select, {SelectChangeEvent} from "@mui/material/Select";

const useStyles = makeStyles({
    select: {
        "& .MuiInputBase-input": {
            padding: "16px 20px 10px 12px",
        },
    }
});

interface Props {
    name: string;
    options: any[];
}

const Filter = ({name, options}: Props) => {

    const classes = useStyles();

    const [value, setValue] = React.useState("");

    const handleChange = (e: SelectChangeEvent) => {
        setValue(e.target.value)
    }

    return (
        <FormControl sx={{mr: 1, minWidth: 120}}>
            <InputLabel id="label-id">{name}</InputLabel>
            <Select
                className={classes.select}
                variant={"filled"}
                labelId="label-id"
                label={name}
                value={value}
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {options.map((option, i) => (
                        <MenuItem key={i} value={option}>
                            {option}
                        </MenuItem>
                    )
                )}
            </Select>
        </FormControl>
    )
}

export default Filter;