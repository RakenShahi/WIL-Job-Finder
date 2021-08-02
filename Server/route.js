import express from 'express'
import { v4 as uuidv4 } from 'uuid';

const router  = express.Router()
const users =[]

router.get('/',(req,res) => {

res.send(users)
})

router.post('/',(req,res) =>{

const user =req.body
const userFormat ={...user,id:uuidv4()}
users.push(userFormat)

res.send('posted')

//searching user using user id
router.get('/:id',(req,res)=>{
const {id} = req.params
const foundUser=users.find((user) => user.id ===id)
res.send(foundUser)

} )

//check with filter and delete it if returns false
router.delete('/:id',(req,res)=> {
const {id} =req.params
const users = users.filter((user) => user.id !==id)
res.send('id: ${id} is deleted from the list')
})
//update name 
router.patch('/:d',(req,res=> {
const {id} =req.params
const {username,password} = req.body
const getUser = users.find((user) => user.id===id)
if(username){
    getUser.username = username
}
if(password){
    getUser.password =password
}
res.send ('member with id: ${id} got updated')
}))

})

export default router