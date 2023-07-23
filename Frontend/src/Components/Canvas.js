import { useEffect, useRef, useState } from "react"
import CanvasProperties from "./CanvasProperties";
import socket from "./Socket";
import './Canvas.css'
const Canvas=()=>{

    const canvasRef=useRef(null)
    const isDrawingRef = useRef(false); 

    const [strokeSize,setStrokeSize]=useState(2)         
    const [strokeColor,setStrokeColor]=useState('black')  
    const [reset,setReset]=useState(false)    
    const [timer,setTimer]=useState(null)
    const [myturn,setMyTurn]=useState(null)
    const [choosen,setChoosen]=useState(null)
    const [showanswer,setShowAnswer]=useState(null)
    let lastXRef = 0              
    let lastYRef = 0

    useEffect(()=>{
      socket.on('getUpdatedCanvas',handleUpdatedCanvas);
      socket.on('WaitPlayerIsChoosing',handleWaitPlayerIsChoosing)
      socket.on('YourTurn',handleYourTurn)
      socket.on('setAnswers',setAnswer)
      socket.on('setChoosen',handlesetChoosen)
      socket.on('resetCanvas',handleResetCanvas)
      socket.on('showAnswer',handleShowAnswer)
      return ()=>{
        socket.off('getUpdatedCanvas',handleUpdatedCanvas)
        socket.off('WaitPlayerIsChoosing',handleWaitPlayerIsChoosing)
        socket.off('YourTurn',handleYourTurn)
        socket.off('setAnswers',setAnswer)
        socket.off('setChoosen',handlesetChoosen)
        socket.off('resetCanvas',handleResetCanvas)
        socket.off('showAnswer',handleShowAnswer)

      }
    },[])
    useEffect(() => {
      const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (reset)
        {
          context.clearRect(0, 0, canvas.width, canvas.height);
          sendCurrentState(null,null,null,null,null,null,true)
          setReset(!reset)

        }
      // Set initial line width
      context.lineWidth = strokeSize; // Initial line width value
      context.strokeStyle =strokeColor
      console.log('strokecolor',strokeColor)
      const handleMouseDown = (event) => {
        isDrawingRef.current = true;
        lastXRef = event.onffsetX;
        lastYRef =  event.offsetY;
        console.log('mouse down',lastXRef,lastYRef)
      };
  

      const handleMouseMove = (event) => {
        if (!isDrawingRef.current) return;
  
        context.beginPath();
        context.moveTo(lastXRef, lastYRef);
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
        sendCurrentState(lastXRef,lastYRef,event.offsetX,event.offsetY,context.lineWidth,context.strokeStyle,false)
        lastXRef= event.offsetX;
        lastYRef = event.offsetY;
        
        //sending the state to the server
      };
  
      const handleMouseUp = () => {
        isDrawingRef.current = false;


      };
  
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
  
      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };
    }, [strokeSize,strokeColor,reset]);

    const sendCurrentState=(moveX,moveY,ToX,ToY,Size,Color,isReset=false)=>{
      console.log('here euuh');
      const Data={
        moveX:moveX,
        moveY:moveY,
        ToX:ToX,
        ToY:ToY,
        Size:Size,
        Color:Color,
        isReset:isReset,
      }
      socket.emit('sendCanvasState',Data)
    }
    const handleUpdatedCanvas=(data)=>{
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (data.isReset!=false){
          context.clearRect(0, 0, canvas.width, canvas.height);
          return 69;
      }
      context.lineWidth = data.Size; 
      context.strokeStyle =data.Color;
      context.beginPath();
      context.moveTo(data.moveX, data.moveY);
      context.lineTo(data.ToX,data.ToY);
      context.stroke();


    }

    const handleWaitPlayerIsChoosing=(time)=>{
      if(time!=0){
        setTimer(time)
        }
      else{
        setTimer('Times Up!')

        if (choosen!=null)
            setChoosen(null)
      }
      console.log('timer running')
    }

    const handleYourTurn=(words)=>{
      setMyTurn(words)
      console.log('handle Your turn',words)
    }
    const handleChoice=(x)=>{
        socket.emit('startMatch',x)
        setMyTurn(null)
        setChoosen(x)
    }

    const handlesetChoosen=(val)=>{
        setChoosen(val)
    }
    const setAnswer=(ans)=>{
        localStorage.setItem('answer',ans)
        console.log('answer set successfully',localStorage.getItem('answer'));
    }
    const handleResetCanvas=()=>{
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      context.clearRect(0, 0, canvas.width, canvas.height);
      setStrokeColor('black')
      setStrokeSize(2)
    }
    const handleShowAnswer=(x)=>{
      if (choosen==null){
      if (x ==1)
          setShowAnswer(localStorage.getItem('answer'))
      else{
          setShowAnswer(null);
      }
        }
    }
    // changes && 
      return(
        <div className="row h-100 mono ">
        <div className="col-12 h-20 text-center">
          <h2 className="heading">Turn The Words Into Real <i class='bx bxs-edit-alt bx-lg' ></i></h2>
          <div className="imp-messages text-center">
        {timer!=null?<h4> {timer}sec remaining.</h4>:null}
        {choosen!=null?<h4>You have Choosen: {choosen}</h4>:null}
        {showanswer!=null?<h1>The Answer Was {showanswer}</h1>:null} 
        {myturn!=null?<div className="choices">{myturn.map((value)=><button onClick={()=>{handleChoice(value)}}>{value}</button>)}</div>:null}
        </div>
        </div>
        <div className="col-12 h-100">
          <div id="canvasElement" className="h-100 p-4" >
              <canvas ref={canvasRef}  id='canvas' height={500} width={800}></canvas>
              <CanvasProperties setStrokeSize={setStrokeSize} setStrokeColor={setStrokeColor} setReset={setReset}></CanvasProperties>
          </div>
        </div>
        </div>
    )
}

export default Canvas