const Express=require('express')
const app=Express()
const server=require('http').createServer(app)
const {Server}=require('socket.io')// binding the socket with the express server.
const cors=require('cors')
const { randomInt } = require('crypto')
//middlewares
app.use(cors())


//Variables-
let Users={}
let correctAnsUsers={}
let noofusers=0
let isInprogress=1
let rounds=0;
let ChoosenPlayer=null
let interaction=0
let Interval_id=null
let TimeOut=null

let choices=[["banana", "sunset", "giraffe"],
["volleyball", "leopard", "grape"],
["chemistry", "dolphin", "kiwi"],
["apple", "mountain", "elephant"],
["physics", "watermelon", "gazelle"],
["crocodile", "orange", "beach"],
["tennis", "zebra", "pomegranate"],
["astronomy", "pineapple", "cheetah"],
["soccer", "cucumber", "tiger"],
["biology", "lemon", "sunrise"],
["mango", "desert", "giraffe"],
["snorkeling", "pear", "rhino"],
["panda", "forest", "grapefruit"],
["astronaut", "kiwi", "lion"],
["basketball", "savannah", "strawberry"],
["chemistry", "parrot", "apple"],
["zebra", "waterfall", "blueberry"],
["physics", "koala", "avocado"],
["badminton", "beach", "orange"],
["oceanography", "pomegranate", "elephant"],
["swimming", "melon", "gazelle"],
["astronomy", "tiger", "lemon"],
["volleyball", "sunrise", "crocodile"],
["biology", "mountain", "guava"],
["safari", "grape", "sunflower"],
["pineapple", "desert", "giraffe"],
["surfing", "gazelle", "cherry"],
["astronaut", "orange", "waterfall"],
["basketball", "blueberry", "rhino"],
["chemistry", "leopard", "apple"],
["hiking", "pear", "strawberry"],
["zebra", "river", "pineapple"],
["physics", "lion", "watermelon"],
["badminton", "orange", "beach"],
["oceanography", "mango", "cucumber"],
["volleyball", "tiger", "pear"],
["biology", "forest", "grapefruit"],
["safari", "guava", "koala"],
["astronomy", "giraffe", "lemon"],
["hiking", "melon", "kiwi"],
["astronaut", "sunrise", "orange"],
["basketball", "blueberry", "panda"],
["swimming", "beach", "watermelon"],
["volleyball", "crocodile", "gazelle"],
["astronomy", "kiwi", "pear"],
["badminton", "lemon", "tiger"],
["surfing", "orange", "elephant"],
["biology", "cherry", "grape"],
["safari", "strawberry", "avocado"],
["astronomy", "river", "zebra"],
["chemistry", "guava", "pineapple"],
["hiking", "sunflower", "giraffe"],
["volleyball", "mountain", "orange"],
["oceanography", "kiwi", "pear"],
["swimming", "crocodile", "grapefruit"],
["basketball", "guava", "waterfall"],
["chemistry", "blueberry", "rhino"],
["surfing", "leopard", "banana"],
["biology", "strawberry", "cherry"],
["safari", "sunrise", "apple"],
["astronomy", "river", "pear"],
["badminton", "melon", "elephant"],
["hiking", "beach", "grape"],
["volleyball", "guava", "watermelon"],
["oceanography", "pineapple", "gazelle"],
["swimming", "pear", "zebra"],
["chemistry", "lion", "orange"],
["surfing", "banana", "tiger"],
["astronomy", "cherry", "blueberry"],
["basketball", "kiwi", "strawberry"],
["biology", "pomegranate", "waterfall"],
["safari", "grapefruit", "guava"],
["volleyball", "apple", "pear"],
["oceanography", "watermelon", "rhino"],
["swimming", "sunrise", "pineapple"],
["astronomy", "lemon", "crocodile"],
["chemistry", "giraffe", "orange"],
["surfing", "banana", "avocado"],
["biology", "pear", "cherry"],
["hiking", "guava", "blueberry"],
["volleyball", "strawberry", "watermelon"],
["safari", "melon", "pear"]]

console.log('this code only runs once.......')
const io=new Server(server,{
    cors:{
        origin:'http://localhost:3000', 
        methods:['GET','POST']
    }
})



const  StartASession= async()=>{
    if (noofusers>=2 && isInprogress)
    {

            console.log('starting a session baby');
            let i=0;     
            isInprogress=0 
            let time=1
            //Whos chance ?
            
            for(let user in Users){
                if(i==rounds){
                ChoosenPlayer=user 
                rounds=(rounds+1)%noofusers; //1
                console.log('round',rounds)
                break;
                }
                i+=1;
            }
            io.to(ChoosenPlayer).emit('YourTurn',choices[randomInt(0,choices.length)])
            
        //Giving 10 Seconds to choose a word to the choosen user.
            
        
        const handleTimeOut=()=>{
            clearInterval(Interval_id)
            clearTimeout(TimeOut)
            if(interaction==0)
            {
                //restart the proceses for next client.
                console.log('round time out',rounds)
                io.to(ChoosenPlayer).emit('YourTurn',null)
                isInprogress=1
                StartASession()
            }
        }
   

    Interval_id=setInterval(() => {
        //socket.emit('some events to the user')
        io.emit('WaitPlayerIsChoosing',9-time++)

    },1000);
    
    TimeOut=setTimeout(handleTimeOut,10000)
}
return 

}



io.on('connect',(socket)=>{
    console.log('client connected Successfully !' )      
    socket.on('sendCanvasState',(state)=>{  
        console.log('sending.. the state to the other clients ');
        socket.broadcast.emit('getUpdatedCanvas',state)
    })
    socket.on('registerMe',(name='Anyonmous User')=>{
            Users[socket.id]={name:name,id:socket.id,points:0}
            noofusers=Object.keys(Users).length;
            StartASession()
    })
    socket.on('getAvailableUsers',(msg)=>{
        let users=[]
        for(const user in Users)
        {
            users.push(Users[user])
        }
        io.emit('AvailableUsers',users)
    })

    socket.on('handleChats',(chat)=>{
        socket.broadcast.emit('fetchChats',{from:Users[socket.id].name,message:chat})
    })

    socket.on('startMatch',(choosenWord)=>{
        clearInterval(Interval_id)
        clearTimeout(TimeOut)
        io.to(socket.id).emit('YourTurn',null)
        socket.broadcast.emit('setAnswers',choosenWord)

        // set the 1 minute timer
        let timer=1
        Interval_id=setInterval(() => {
            io.emit('WaitPlayerIsChoosing',59-timer++)
        },1000);

        TimeOut=setTimeout(()=>{
            clearTimeout(Interval_id)
            clearTimeout(TimeOut)
            correctAnsUsers={}
            io.emit('showAnswer',1)
            setTimeout(()=>{
            io.emit('showAnswer',null)

            io.to(ChoosenPlayer).emit('setChoosen',null)
            io.emit('resetChats','')
            io.emit('resetCanvas','')
            isInprogress=1;
            StartASession()
            },3000)
        },60000)


    })

    socket.on('correctGuess',(time)=>{
        correctAnsUsers[socket.id]=true
        socket.broadcast.emit('rightAnswer',correctAnsUsers)

        if(Object.keys(correctAnsUsers).length==noofusers-1)
        {
            clearTimeout(Interval_id)
            clearTimeout(TimeOut)
            correctAnsUsers={}
            io.emit('showAnswer','')
            setTimeout(()=>{
            io.emit('showAnswer','')
            io.to(ChoosenPlayer).emit('setChoosen',null)
            io.emit('resetChats','')
            io.emit('resetCanvas','')
            isInprogress=1;
            StartASession()
            },3000)

        }

    })

    socket.on('disconnect',()=>{
        console.log('disconnection logik bruh')
        delete Users[socket.id]
        let users=[]
        for(const user in Users)
        {
            users.push(Users[user])
        }
        io.emit('AvailableUsers',users)
        noofusers=Object.keys(Users).length
    })
})

server.listen(3001,()=>{
    console.log('server has been started');
})