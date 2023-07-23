const CanvasProperties=(props)=>{

    const handleReset=()=>{
        props.setReset(true)
    }
    const handleErase=()=>{
        props.setStrokeColor('white')
        props.setStrokeSize(20)
    }
    const handleStrokeSize=(e)=>{
        console.log(e.target.value)
        props.setStrokeSize( parseInt(e.target.value))
    }
    const handleColor=(e)=>{
        console.log('bruh',e.target.value)
       props.setStrokeColor(e.target.value)
    }

    return(
        <div id="canvas-tools">
            <label htmlFor="stroke-size" className="pe-2">Stroke-size</label><select name="stroke-size" id="stroke-size" onChange={handleStrokeSize}>
                <option value="2">2px</option>
                <option value="6">6px</option>
                <option value="10">10px</option>
                <option value="20">20px</option>
            </select>

            <label htmlFor="stroke-color" className="ms-3">Color</label> <input type="color" name="" id="stroke-color" onChange={handleColor} onSelect={(e)=>{
                console.log(e.target.value)
            }}/>
            <button id="eraser" onClick={handleErase}
            ><i class='bx bxs-eraser bx-md er' ></i>
            </button>
            <button id="reset" onClick={handleReset}><i class='bx bx-reset bx-md re' ></i></button>
        </div>
    )

}
export default CanvasProperties