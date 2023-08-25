import React from 'react'

const CustomInput = (props) => {
    let label;
    if (props.label){
        label = props.label.slice(0,1).toUpperCase() + props.label.slice(1, props.label.length);
    }
  return (
    <div>
        <label 
            className={props.labelClass} 
            htmlFor={props.label}
        >
            {label}
        </label>
        <br />
        <input 
            className={props.inputClass}
            type={props.type || 'text'}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            id={props.id}
            required={props.required}
        />
    </div>
  )
}

export default CustomInput