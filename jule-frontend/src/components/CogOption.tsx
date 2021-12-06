import React from "react";
import {
    Box, Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    SpeedDial,
    SpeedDialAction
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


interface Props {
    exerciseTitle: string;
    onClickEdit: () => void;
    onClickDelete: () => void;
}

const CogOption = ({exerciseTitle, onClickEdit, onClickDelete}: Props) => {

    // open state of the cog button
    const [openCog, setOpenCog] = React.useState(false);
    // open state of the dialog when clicking on delete
    const [openDialog, setOpenDialog] = React.useState(false);

    const onCloseDialog = () => setOpenDialog(false);

    return (
        <Box sx={{height: 100, width: 200, transform: 'translateZ(0px)', flexGrow: 1}}>
            <SpeedDial
                ariaLabel={'Cog option'}
                sx={{position: 'absolute', bottom: 10, left: 10}}
                icon={<SettingsIcon/>}
                direction={'right'}
                open={openCog}
                onClick={() => setOpenCog(!openCog)}
            >
                <SpeedDialAction icon={<EditIcon onClick={onClickEdit}/>} tooltipTitle={'Edit'}/>
                <SpeedDialAction icon={<DeleteIcon onClick={() => setOpenDialog(true)} color={'error'}/>}
                                 tooltipTitle={'Delete'}/>
            </SpeedDial>
            <Dialog open={openDialog}
                    onClose={onCloseDialog}
                    aria-labelledby={'alert-title'}
                    aria-describedby={'alert-body'}
            >
                <DialogTitle id={'alert-title'}>
                    {`Delete ${exerciseTitle}. Are you ABSOLUTELY SURE?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id={'alert-body'}>
                        This cannot be revoked.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCloseDialog}>Cancel</Button>
                    <Button
                        autoFocus
                        color={'error'}
                        onClick={() => {
                            onCloseDialog()
                            onClickDelete()
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};

export default CogOption;