// import { useState } from "react";
import Select from "react-select"

import makeAnimated from "react-select/animated"

export const MultiSelect = ({...props}) => {
    const animatedComponents = makeAnimated();
    return (
        <Select 
            components={animatedComponents}
            name={props.nameSelect}
            options={props.options}
            placeholder={props.placeholder}
            isMulti
            onChange={(e) => props.onChange(e)}
        />
    )
}
