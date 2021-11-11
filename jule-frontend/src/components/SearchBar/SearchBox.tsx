import React from "react";
import styles from "./SearchBox.module.css";
import {IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBox = () => {

    const [input, setInput] = React.useState("");

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput(e.target.value);
    }

    return (
        <Paper className={styles.paper} component={"form"}>
            <InputBase className={styles.inputBase}
                       value={input}
                       onChange={handleChange}
                       placeholder={"Search by title..."}/>
            <IconButton className={styles.iconButton}>
                <SearchIcon/>
            </IconButton>
        </Paper>
    )
}

export default SearchBox;