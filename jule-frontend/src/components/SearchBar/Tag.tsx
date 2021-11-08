import React from "react";
import {makeStyles} from "@material-ui/styles";
import {Chip} from "@mui/material";

const useStyles = makeStyles({
    chip: {
        width: 80,
        height: 40,
        fontSize: 16
    }
});

interface Props {
    name: string;
    handleAdd: (arg0: string) => void;
    handleRemove: (arg0: string) => void;
}

const Tag = ({name, handleAdd, handleRemove}: Props) => {

    const classes = useStyles();

    const [selected, setSelected] = React.useState(false);

    const handleClick = () => {
        if (selected) {
            handleRemove(name);
        } else {
            handleAdd(name);
        }
        setSelected(!selected);
    }

    return (
        <Chip className={classes.chip}
              label={name}
              onClick={handleClick}
              color={selected ? "primary" : "default"}/>
    )
}

export default Tag;