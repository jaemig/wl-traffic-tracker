import { Select } from "@chakra-ui/react";
import React, { ChangeEvent, ChangeEventHandler, Dispatch, FC, SetStateAction } from "react";
import { DisruptionProbabilityData, SelectOption } from "../types";
import GraphBox, { GraphBoxProps } from "./GraphBox";

interface GraphSelectBoxProps extends GraphBoxProps  {
    placeholder?: string,
    options?: SelectOption[],
    requestFunc: (filter: string) => Promise<DisruptionProbabilityData[]>,
    setGraphData: Dispatch<SetStateAction<DisruptionProbabilityData[]>>
}

/**
 * Graph Box that is extended with a dynamic select field to quickly change the data filter
 */
const GraphSelectBox: FC<GraphSelectBoxProps> = ({ width, height, title, borderColor, hasDataLoaded, children, labels, skeletonHeight, placeholder, requestFunc, setGraphData, options = [] }) => {

    const getGraphData = async(e: ChangeEvent<HTMLSelectElement>) => {
        const line = e.target.value;
        if (line) {
            const data = await requestFunc(line);
            console.log(data);
            setGraphData(data);
        }
    }

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
