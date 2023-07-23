import { io} from "socket.io-client";

const socket=io('http://localhost:3001')
socket.on('disconnect',(x)=>{
    socket.off()
    localStorage.clear('chats')
})

export default socket