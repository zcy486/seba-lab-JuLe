import React from "react";
import {Grid} from "@mui/material";
import Filter from "./Filter";
import SearchBox from "./SearchBox";
import TagGroup from "./TagGroup";

const SearchBar = () => {

    //mock data
    const filters = [
        {name: "Difficulty", options: [1, 2, 3]},
        {name: "Status", options: ["finished", "unfinished"]}
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                {filters.map((filter, i) => {
                    return (
                        <Filter key={i} name={filter.name} options={filter.options}/>
                    )
                })}
            </Grid>
            <Grid item xs={4}>
                <SearchBox/>
            </Grid>
            <Grid item xs={8}>
                <TagGroup all_tags={["tag1", "tag2", "tag3"]}/>
            </Grid>
        </Grid>
    )
}

export default SearchBar;