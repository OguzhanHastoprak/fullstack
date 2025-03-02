export default function Die(props){
    return(
        <button
            className={props.className}
            onClick={() => props.hold(props.id)}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value} 
                        is being ${props.isHeld ? "held" : "not held"} `}
        >
            {props.value}
        </button>
    )
}