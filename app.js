const express= require("express")
const axios = require("axios")
const app = express()


const cors = require("cors")

app.use(cors())


//Ruta /characters
app.get("/characters", async (req, res)=>{
    let url = "https://rickandmortyapi.com/api/character"
    try{
        //Array para almacenar todos los personajes de todas las páginas
        let allResults = []
        
        let response = await axios.get(url) 
        let resultsArray = response.data.results
        
        //Saca los personajes de la primera página
        resultsArray.forEach(element => {
            const personaje = [] //Array para añadir la información
            const {name, status, species, gender, origin: {name: originName}, image} = element //Saca la info necesaria en variables

            //Añade la info al array del personaje y añade este array de personaje al array de personajes totales
            personaje.push({name, status, species, gender, origin: {name: originName}, image})
            allResults.push(personaje)

        })

        //Saca los personajes del resto de páginas (hasta que no haya página siguiente)
        while (response.data.info.next){
            //Sustitule ya url por la página siguiente a la que se acaba de hacer
            url = response.data.info.next
            //Actualiza la respuesta con la nueva url
            response = await axios.get(url)
            //Actualiza el array resultsArray con la nueva respuesta
            resultsArray = response.data.results

            resultsArray.forEach(element => {
                const personaje = [] //Array para añadir la información
                const {name, status, species, gender, origin: {name: originName}, image} = element //Saca la info necesaria en variables
    
                //Añade la info al array del personaje y añade este array de personaje al array de personajes totales
                personaje.push({name, status, species, gender, origin: {name: originName}, image})
                allResults.push(personaje)
            })   
        }
        
        url = "https://rickandmortyapi.com/api/character" //Reset a la url cambiada
        res.json(allResults)
    } catch (ERROR){
        res.status(404).json({error: "Error"}) 
    }
})


//Ruta /characters por nombre
app.get("/characters/:characterName", async (req, res)=>{
    const characterName =  req.params.characterName  
    let url = `https://rickandmortyapi.com/api/character/?name=${characterName}`
    
    try{
        let allResults = []
        
        let response = await axios.get(url)
        let resultsArray = response.data.results
        

        resultsArray.forEach(element => {
            const personaje = []
            const {name, status, species, gender, origin: {name: originName}, image} = element

            personaje.push({name, status, species, gender, origin: {name: originName}, image})
            allResults.push(personaje)

        });

        while (response.data.info.next){
            url = response.data.info.next
            response = await axios.get(url)
            resultsArray = response.data.results
            resultsArray.forEach(element => {
                const personaje = []
                const {name, status, species, gender, origin: {name: originName}, image} = element
    
                personaje.push({name, status, species, gender, origin: {name: originName}, image})
                allResults.push(personaje)
    
            })
        }
        
        url = `https://rickandmortyapi.com/api/character/?name=${characterName}`
        res.json(allResults)
         
    } catch (ERROR){
        res.status(404).json({error: "personaje no encontrado"})
    }
})

app.listen(3000, ()=>{
    console.log("Express está escuchando en el puerto http://localhost:3000")
})