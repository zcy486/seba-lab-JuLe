import React from "react";
import styles from "./SearchBox.module.css";
import {IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
    input: string;
    onChangeInput: (e: any) => void;
    onSearch: () => void;
}

const SearchBox = ({input, onChangeInput, onSearch}: Props) => {

    return (
        <Paper className={styles.paper} component={"form"}>
            <InputBase className={styles.inputBase}
                       value={input}
                       onChange={onChangeInput}
                       onKeyPress={
                           (e) => {
                               if (e.key === 'Enter') {
                                   e.preventDefault();
                                   onSearch();
                               }
                           }
                       }
                       placeholder={"Search by title..."}/>
            <IconButton className={styles.iconButton} onClick={onSearch}>
                <SearchIcon/>
            </IconButton>
        </Paper>
    )
}

export default SearchBox;