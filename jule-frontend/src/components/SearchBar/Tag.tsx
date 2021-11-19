import React from "react";
import styles from "./Tag.module.css";
import {Chip} from "@mui/material";

interface Props {
    name: string;
    handleAdd: (arg0: string) => void;
    handleRemove: (arg0: string) => void;
}

const Tag = ({name, handleAdd, handleRemove}: Props) => {

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
        <Chip className={styles.chip}
              label={name}
              onClick={handleClick}
              color={selected ? "primary" : "default"}/>
    )
}

export default Tag;