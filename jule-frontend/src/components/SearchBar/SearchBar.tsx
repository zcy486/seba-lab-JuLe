import React from "react";
import {Grid} from "@mui/material";
import Filter from "./Filter";
import SearchBox from "./SearchBox";
import TagGroup from "./TagGroup";

interface Props {
    tags_in_use: string[];
}

const SearchBar = ({tags_in_use}: Props) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Filter name={"Difficulty"} options={['Easy', 'Medium', 'Hard']}/>
                <Filter name={"Status"} options={["finished", "unfinished"]}/>
            </Grid>
            <Grid item xs={4}>
                <SearchBox/>
            </Grid>
            <Grid item xs={12}>
                <TagGroup tags_in_use={tags_in_use}/>
            </Grid>
        </Grid>
    )
}

export default SearchBar;