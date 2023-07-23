import { useEffect, useRef, useState } from "react"
import socket from "./Socket"
const Users=()=>{
  const[users,setUsers]=useState(null)
  const [chat,setChat]=useState('')
  const [messages,setMessages]=useState(null)
  const [guessRight,setguessRight]=useState(false)
  const [rightAnswers,setrightAnswers]=useState({})
  const key=useRef(0)

    useEffect(()=>{
      socket.on('AvailableUsers',handleAvailableUsers)
      socket.on('fetchChats',handleFetchChats)
      socket.emit('getAvailableUsers','')
      socket.on('rightAnswer',handleRightAnswers)
      socket.on('resetChats',handleResetChats)
      return ()=> {
        socket.off('getAvailableUsers',handleAvailableUsers)
        socket.off('fetchChats',handleFetchChats)
        socket.off('rightAnswer',handleRightAnswers)

        socket.off('resetChats',handleResetChats)

      }
    },[])

    const handleFetchChats=(chat)=>
    {
      console.log('chat recieved',chat)
      GetSetMessages({from:chat.from,message:chat.message})
      let msgs= JSON.parse(localStorage.getItem('chats'))
      setMessages(msgs) 
    }
    const handleAvailableUsers=(Users)=>{
        if(Object.keys(Users).length!=1)
          setUsers(Users);
        else{
          setUsers(null)
        }
    }

    const handleSendChat=()=>{
      if (!guessRight){
        let answer = localStorage.getItem('answer')
        console.log('answer',answer)
        if(chat === answer){
            setguessRight(true)
            socket.emit('correctGuess','yeah')
            return
          }
        socket.emit('handleChats',chat)
        GetSetMessages({from:'Me',message:chat})
        setChat('')
        let msgs= JSON.parse(localStorage.getItem('chats'))
        console.log('messages',msgs)
        setMessages(msgs)
        }

    }

    const GetSetMessages=(x)=>{
      let prevmsgs=JSON.parse(localStorage.getItem('chats'))
      if (prevmsgs){
        console.log('previous message is there')
          prevmsgs.push({from:x.from,message:x.message})
          localStorage.setItem('chats',JSON.stringify(prevmsgs))
      }
      else{
        localStorage.setItem('chats',JSON.stringify([{from:x.from,message:x.message}]))
      }
    }

    const handleRightAnswers=(rightAnsUsers)=>{
      setrightAnswers(rightAnsUsers)
    }

    const handleResetChats=()=>{
      setrightAnswers({})
      setguessRight(false)
    }

    return (
        <div className="row justify-content-around mono h-100 user-chat-section pt-1">
            <div className="col-5 text-center h-100 user-container">
            <i class='bx bxs-user-circle bx-lg' ></i>
              <p className="">Users</p>
              <div id="users">
            {guessRight!=false?<h3>You've Guess It Right</h3>:null}                                    
               {users!==null?users.map(value=>{
                if(value.id!=socket.id)
                    return (<div key={value.id} className={rightAnswers[value.id]?'right-ans user':'user'}>
                      <span className="user-name">{value.name}</span>
                      <p className="user-points">Points: {value.points}</p>
                      </div>)
               }):<p className="no-user mt-3">No Active Users</p> 
                }
                </div>
        </div>
        <div className="col-6 h-70 chats text-center">
        <i class='bx bx-conversation bx-lg'></i>
          <p>Chats</p>
        <div>
          <div id="messages" className="h-100">
                {messages!==null?messages.map(value=>{
                  console.log(value)  
                  return <p key={key.current++}><span className="from">{value.from}</span>:{value.message}</p>
                }):<p>No messages! </p>}
          </div>
        <input type="search" name="" id="search-box" className="w-100"  placeholder="Type your guess" value={chat} onChange={(e)=>{setChat(e.target.value)}}/> <button onClick={handleSendChat}>Guess</button>
        </div>                                              
        </div>     
        </div>                           
                                                   
    )

}

export default Users