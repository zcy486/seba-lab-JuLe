import React from "react";
import {Grid} from "@mui/material";
import Filter from "./Filter";
import SearchBox from "./SearchBox";
import TagGroup from "./TagGroup";

const SearchBar = () => {

    //mock data
    const filters = [
        {name: "filter1", options: [1, 2, 3]},
        {name: "filter2", options: [4, 5, 6]}
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                {filters.map((filter) => {
                    return (
                        <Filter name={filter.name} options={filter.options}/>
                    )
                })}
            </Grid>
            <Grid item xs={4}>
                <SearchBox/>
            </Grid>
            <Grid item xs={6}>
                <TagGroup all_tags={["tag1", "tag2", "tag3"]}/>
            </Grid>
        </Grid>
    )
}

export default SearchBar;