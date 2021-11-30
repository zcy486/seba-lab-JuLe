import React from "react";
import Tag from "./Tag";
import {Stack} from "@mui/material";

interface Props {
    tags_in_use: string[];
}

const TagGroup = ({tags_in_use}: Props) => {

    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

    const handleAdd = (value: string) => {
        setSelectedTags([...selectedTags, value]);
    }

    const handleRemove = (value: string) => {
        setSelectedTags((tags) => tags.filter((tag) => tag !== value))
    }

    return (
        <Stack direction={"row"} spacing={3}>
            {tags_in_use.map((tag, i) => {
                return (
                    <Tag key={i} name={tag} handleAdd={handleAdd} handleRemove={handleRemove}/>
                )
            })}
        </Stack>
    )
}

export default TagGroup;
