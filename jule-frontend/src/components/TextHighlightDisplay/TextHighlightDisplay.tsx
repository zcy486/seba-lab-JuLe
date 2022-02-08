import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TypelessTagColorMapping from './TagColorMapping.json'
import { NerTag } from "../../models/Exercise";
import styles from "./TextHighlightingDisplay.module.css";

type TextHighlightDisplayProps = {
    text: string,
    highlights?: NerTag[]
}

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
            combinedText.push(<span style={{ backgroundColor: TagColorMapping[highlight.label], padding: "0px 5px 0px" , borderRadius: "3px"}}>{highlightedText}</span>)

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
            {props.highlights && props.highlights.length > 0 ?
                <>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={isHighlightOn} onChange={toggleHighlight} />} label="Text Highlighting" />
                        {isHighlightOn ?
                            <div className={styles.highlightLegend}>
                                <span style={{ backgroundColor: TagColorMapping['PER']}} className={styles.highlightKey}>People</span>
                                <span style={{ backgroundColor: TagColorMapping['ORG']}} className={styles.highlightKey}>Organization</span>
                                <span style={{ backgroundColor: TagColorMapping['LOC']}} className={styles.highlightKey}>Location</span>
                                <span style={{ backgroundColor: TagColorMapping['MISC']}} className={styles.highlightKey}>Other</span>
                            </div>
                            : <></>
                        }

                    </FormGroup>

                </>
                :
                <></>
            }

        </>
    )

}

export default TextHighlightDisplay
