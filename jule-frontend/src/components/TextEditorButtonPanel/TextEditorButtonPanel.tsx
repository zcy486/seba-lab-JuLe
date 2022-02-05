import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Button from "@mui/material/Button";
import styles from "./TextEditorButtonPanel.module.css"


type TextEditorButtonPanelProps = {
    saveText: () => void;
    onCancel: () => void;
};


let TextEditorButtonPanel = (props: TextEditorButtonPanelProps) => {

    return (
        <div className={styles.textEditorButtonPanel}>
            <Button className={styles.textEditorButton} variant="outlined" onClick={props.onCancel} >Cancel</Button>
            <div className={styles.horizontalSpacer}/>
            <Button className={styles.textEditorButton} variant="contained" onClick={props.saveText} >Save</Button>
        </div>
    )
}

export default TextEditorButtonPanel;