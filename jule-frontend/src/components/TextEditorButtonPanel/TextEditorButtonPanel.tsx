import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Button from "@mui/material/Button";
import "./TextEditorButtonPanel.css"


type TextEditorButtonPanelProps = {
    saveText: () => void;
    onCancel: () => void;
};


let TextEditorButtonPanel = (props: TextEditorButtonPanelProps) => {

    return (
        <div className="text-editor-button-panel">
            <Button className="text-editor-button" variant="outlined" onClick={props.onCancel} >Cancel</Button>
            <Button className="text-editor-button" variant="contained" onClick={props.saveText} >Save</Button>
        </div>
    )
}

export default TextEditorButtonPanel;