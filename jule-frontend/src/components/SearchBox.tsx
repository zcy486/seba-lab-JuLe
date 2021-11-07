import React from "react";
import {makeStyles} from "@material-ui/styles";
import {IconButton, InputBase, Paper} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const useStyles = makeStyles({
    paper: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 250,
    },
    inputBase: {
        flex: 1,
        marginLeft: 1,
    },
    iconButton: {
        padding: "10px",
    }
})

const SearchBox = () => {

    const classes = useStyles();

    const [input, setInput] = React.useState("");

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setInput(e.target.value);
    }

    return (
        <Paper className={classes.paper} component={"form"}>
            <InputBase className={classes.inputBase}
                       value={input}
                       onChange={handleChange}
                       placeholder={"Search by title..."}/>
            <IconButton className={classes.iconButton}>
                <SearchIcon/>
            </IconButton>
        </Paper>
    )
}

export default SearchBox;