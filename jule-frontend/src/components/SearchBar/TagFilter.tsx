import React from "react";
import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";

interface Props {
    selectedTags: string[];
    onChangeSelectedTags: (e: any) => void;
    tagsInUse: string[];
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const TagFilter = ({selectedTags, onChangeSelectedTags, tagsInUse}: Props) => {
    return (
        <FormControl fullWidth sx={{mb: 1}}>
            <InputLabel id={'tag-filter-label'}>Tags</InputLabel>
            <Select
                labelId={'tag-filter-label'}
                id={'tag-filter'}
                multiple
                value={selectedTags}
                onChange={onChangeSelectedTags}
                input={<OutlinedInput id="select-multiple-chip" label="Tags"/>}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {tagsInUse.map((tag_name) => (
                    <MenuItem
                        key={tag_name}
                        value={tag_name}
                    >
                        {tag_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default TagFilter;