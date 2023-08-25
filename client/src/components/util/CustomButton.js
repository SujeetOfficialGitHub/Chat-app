import React from 'react'

const CustomButton = (props) => {
  return (
    <button
        className={props.btnClass}
        type={props.type || 'button'}
        onClick={props.onClick}
    >
        {props.children}
    </button>
  )
}

export default CustomButton