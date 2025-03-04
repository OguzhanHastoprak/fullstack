export default  function Key(props){
    return(
        <button key={props.value}
                onClick={props.onClick}
                className={props.className}
                disabled={props.isGameOver}
                aria-disabled={props.ariaDisabled}
                aria-label={`Letter ${props.value}`}
        >
            {props.value}
        </button>
    )
}