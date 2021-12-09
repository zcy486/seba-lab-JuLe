import React from "react";
import {Grid} from "@mui/material";
import Filter from "./Filter";
import SearchBox from "./SearchBox";
import TagFilter from "./TagFilter";
import Tag from "../../models/Tag";

interface Props {
    difficulty: string;
    onChangeDifficulty: (e: any) => void;
    selectedTags: string[];
    onChangeSelectedTags: (e: any) => void;
    availableTags: Tag[];
    input: string;
    onChangeInput: (e: any) => void;
    onSearch: () => void;
}

const SearchBar = (props: Props) => {

    // TODO: replace with status outside when submission data is ready
    const [status, setStatus] = React.useState('');

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Filter
                    name={"Difficulty"}
                    options={[
                        {name: 'Easy', value: 1},
                        {name: 'Medium', value: 2},
                        {name: 'Hard', value: 3},
                    ]}
                    value={props.difficulty}
                    onChangeValue={props.onChangeDifficulty}
                />
                <Filter
                    name={"Status"}
                    options={[
                        {name: 'Finished', value: 1},
                        {name: 'Not Finished', value: 2},
                    ]}
                    value={status}
                    onChangeValue={(e) => setStatus(e.target.value)}
                />
            </Grid>
            <Grid item xs={4}>
                <SearchBox input={props.input} onChangeInput={props.onChangeInput} onSearch={props.onSearch}/>
            </Grid>
            <Grid item xs={12}>
                <TagFilter
                    selectedTags={props.selectedTags}
                    onChangeSelectedTags={props.onChangeSelectedTags}
                    availableTags={props.availableTags}
                />
            </Grid>
        </Grid>
    )
}

export default SearchBar;