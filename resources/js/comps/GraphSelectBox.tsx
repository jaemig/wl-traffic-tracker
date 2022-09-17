import { Select } from "@chakra-ui/react";
import React, { ChangeEvent, ChangeEventHandler, Dispatch, FC, SetStateAction } from "react";
import { DisruptionProbabilityData, SelectOption } from "../types";
import GraphBox, { GraphBoxProps } from "./GraphBox";

interface GraphSelectBoxProps extends GraphBoxProps  {
    filterFunction: (filter: string) => void,
    placeholder?: string,
    allowUnselected?: boolean,
    selected?: string,
    options?: SelectOption[],
    // requestFunc: (filter: string) => Promise<DisruptionProbabilityData[]>,
    // setGraphData: Dispatch<SetStateAction<DisruptionProbabilityData[]>>
}

/**
 * Graph Box that is extended with a dynamic select field to quickly change the data filter.
 * Passes filterFunction the selected option's value.
 */
const GraphSelectBox: FC<GraphSelectBoxProps> = ({ width, height, title, borderColor, hasDataLoaded, children, labels, skeletonHeight, placeholder, filterFunction, allowUnselected = false, selected= undefined, options = [] }) => {

    const getGraphData = async(e: ChangeEvent<HTMLSelectElement>) => { if (e.target.value || allowUnselected) filterFunction(e.target.value); }

    const render = () => {
        return (
            <GraphBox
                width={width}
                height={height}
                title={title}
                borderColor={borderColor}
                hasDataLoaded={hasDataLoaded}
                labels={labels}
                skeletonHeight={skeletonHeight}
            >
                <Select
                    size="sm"
                    placeholder={placeholder}
                    width='40%'
                    position='absolute'
                    right='10px'
                    top='10px'
                    rounded="md"
                    onChange={getGraphData}
                    defaultValue={selected}
                >
                    {
                        options.map((option: SelectOption, idx: number) => <option key={idx} value={option.value}>{ option.label }</option>)
                    }
                </Select>
                { children }
            </GraphBox>
        )
    }

    return render();
}

export default GraphSelectBox;
