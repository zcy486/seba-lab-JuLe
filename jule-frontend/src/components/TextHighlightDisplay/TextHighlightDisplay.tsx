import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TypelessTagColorMapping from './TagColorMapping.json'
import { NerTag } from "../../models/Exercise";

type TextHighlightDisplayProps = {
    text: string,
    highlights?: NerTag[]
}

// TODO: find neater way of defining color mapping
const TagColorMapping: { [key: string]: string } = TypelessTagColorMapping

const TextHighlightDisplay = (props: TextHighlightDisplayProps) => {

    const [isHighlightOn, setIsHighlightOn] = useState(false);

    const highlightedText = (text: string, highlights: NerTag[]) => {
        console.log("here are my highlights: " + highlights)

        let combinedText: JSX.Element[] = []

        // set the first index before a highlight
        let currentCharIndex = 0

        // insert highlights into combined text
        for (const highlight of highlights) {

            // add non highlighted text before highlight
            const nonHighlightedText = text.slice(currentCharIndex, highlight.start)
            combinedText.push(<span>{nonHighlightedText}</span>)

            // add highlighted text
            const highlightedText = text.slice(highlight.start, highlight.end)
            combinedText.push(<span style={{ backgroundColor: TagColorMapping[highlight.label], padding: "2px" }}>{highlightedText}</span>)

            currentCharIndex = highlight.end
        }

        // section after last highlight
        const nonHighlightedText = text.slice(currentCharIndex)
        combinedText.push(<span>{nonHighlightedText}</span>)

        return combinedText
    }

    const displayedText = () => {
        if (isHighlightOn && props.highlights && props.highlights?.length > 0) {
            return <p>{highlightedText(props.text, props.highlights)}</p>
        } else {
            return <p>{props.text}</p>
        }
    }

    const toggleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsHighlightOn(
            event.target.checked
        )
    }

    return (
        <>
            {displayedText()}
            {props.highlights ?
                <FormGroup>
                    <FormControlLabel control={<Switch checked={isHighlightOn} onChange={toggleHighlight} />} label="Text Highlighting" />
                </FormGroup>
                :
                <></>
            }

        </>
    )

}

export default TextHighlightDisplay
