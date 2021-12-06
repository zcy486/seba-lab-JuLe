import React from "react";
import {FormControl, InputLabel, MenuItem, OutlinedInput, Select} from "@mui/material";
import Tag from "../../models/Tag";

interface Props {
    selectedTags: string[];
    onChangeSelectedTags: (e: any) => void;
    availableTags: Tag[];
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

const TagFilter = ({selectedTags, onChangeSelectedTags, availableTags}: Props) => {
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
                MenuProps={MenuProps}
            >
                {availableTags.map((tag) => (
                    <MenuItem
                        key={tag.id}
                        value={tag.id}
                    >
                        {tag.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

export default TagFilter;