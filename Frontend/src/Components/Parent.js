import { useRef, useState } from "react"
import Canvas from "./Canvas"
import socket from "./Socket"
import Users from "./Users"
import profile from '../profile.png'
const Parent=()=>{
    const[username,setUsername]=useState(null)
    let value=useRef()
    const handleRegister=()=>{
        socket.emit('registerMe',value.current.value)
        setUsername(value.current.value)
    }
    return(
        <div className="container-fluid h-100 " id="main">
            
                {username!=null? 
                <div className="row h-100">
                    <div className="col-md-4">
                    <Users></Users>
                    </div>
                    <div className="col-md-8">
                    <Canvas></Canvas>
                    </div> </div>:
                <div className="row h-100 justify-content-center align-items-center mono">
                        <div className="col-auto text-center">
                            <div id="profile" className="mb-4">
                                <img src={profile} alt="" className="img-fluid"/>
                            </div>
                            <p>Your Name:</p>
                            <input type="text" ref={value}/>
                            <button onClick={handleRegister} className="bg-danger text-white">Let's Go</button>
                        </div>
                </div>

}
            </div>
    )
}

export default Parent