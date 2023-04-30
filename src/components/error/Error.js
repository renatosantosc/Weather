import '../../App.css'
export default function Error(props){
    return(
        <>
            <div className='container-Error'>
                <span>{props.error}</span>
            </div>
        </>
    )
}