import React from 'react'

const Form = (props) => {
    return (
        <form onSubmit={() => {props.connect(); console.log('form submitted')}}>
            <input
                placeholder = "username ..."
                type = "text"
                value = {props.username}
                onChange = {props.onChange}
            />
            <button type="submit">Connect</button>
        </form>
    )
}

export default Form
