import React from "react";
import styles from "./TagInput.module.css";
import {Autocomplete, TextField} from "@mui/material";

//TODO: example of options, should be loaded from backend later
const options = [
    {name: "Indirekte Rede"},
    {name: "Interpunktion"},
    {name: "Substantivierung"},
    {name: "Passiv"},
    {name: "Grammatik"},
    {name: "TODO..."},
];

// press Enter to create a new tag in the input field
// the new tag is added to the database only after clicking on the submit button
const TagInput = () => {

    const [values, setValues] = React.useState<string[]>([]);

    return (
        <Autocomplete
            className={styles.autocomplete}
            freeSolo
            multiple
            value={values}
            onChange={(event, newValues) => {
                setValues(newValues);
            }}
            options={options.map((option) => option.name)}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={"Exercise Tags"}
                    placeholder={"Add more tags..."}
                />
            )}
        />
    )
}

export default TagInput;