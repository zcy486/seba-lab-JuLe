import React from "react"
import {AppBar, BottomNavigation, BottomNavigationAction, Box, Typography} from "@mui/material"
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import styles from "./Footer.module.css"
import {Link} from "react-router-dom";

// TODO: make it properly stick to the bottom of the page
const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Box sx={{flexGrow: 1}} bgcolor={"primary.main"} className={styles.footerBox}>
                <Typography variant={"h6"} color={"#ffffff"} component={Link} to={"/impressum"}>
                    Impressum
                </Typography>
                <Typography variant={"h6"} color={"#ffffff"} component={Link} to={"/contact-us"}>
                    Contact Us
                </Typography>
            </Box>
        </footer>

    )
}

export default Footer
