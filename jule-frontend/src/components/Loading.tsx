import React from "react";
import {Box, CircularProgress, Typography} from "@mui/material";

const Loading = () => {
    return (
        <Box sx={{m:3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress/>
            <Typography sx={{mt:1}} variant={'h5'}>Loading</Typography>
        </Box>
    )
};

export default Loading;