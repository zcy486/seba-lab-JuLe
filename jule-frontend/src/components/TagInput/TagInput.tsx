import React from "react";
import styles from "./TagInput.module.css";
import {Autocomplete, TextField} from "@mui/material";

interface Props {
    tags: string[];
    onChange: (e: any, new_tags: string[]) => void;
    options: string[];
}

// press Enter to create a new tag in the input field
// the new tag is added to the database only after clicking on the submit button
const TagInput = ({tags, onChange, options}: Props) => {

    return (
        <Autocomplete
            className={styles.autocomplete}
            freeSolo
            multiple
            value={tags}
            onChange={onChange}
            options={options.map((option) => option)}
            filterSelectedOptions
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={"Press enter to create a new tag"}
                />
            )}
        />
    )
}

export default TagInput;