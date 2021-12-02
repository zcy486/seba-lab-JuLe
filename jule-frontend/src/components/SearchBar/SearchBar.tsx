import React from "react";
import {Grid} from "@mui/material";
import Filter from "./Filter";
import SearchBox from "./SearchBox";
import TagGroup from "./TagGroup";

interface Props {
    tags_in_use: string[];
    input: string;
    onChangeInput: (e: any) => void;
    onSearch: () => void;
}

const SearchBar = ({tags_in_use, input, onChangeInput, onSearch}: Props) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Filter name={"Difficulty"} options={['Easy', 'Medium', 'Hard']}/>
                <Filter name={"Status"} options={["finished", "unfinished"]}/>
            </Grid>
            <Grid item xs={4}>
                <SearchBox input={input} onChangeInput={onChangeInput} onSearch={onSearch}/>
            </Grid>
            <Grid item xs={12}>
                <TagGroup tags_in_use={tags_in_use}/>
            </Grid>
        </Grid>
    )
}

export default SearchBar;