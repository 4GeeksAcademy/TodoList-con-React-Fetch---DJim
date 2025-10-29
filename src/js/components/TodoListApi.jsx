import React, { useState, useEffect } from "react"; 
import { renderToStaticMarkup } from "react-dom/server";

const TodoListApi = () => {

    let [lista, setLista] = useState([])
    let [tarea, setTarea] = useState("")

    const API_URL = 'https://playground.4geeks.com/todo/'

    const crearUsuario = () => {


        fetch(API_URL + "users/david", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
		.then(response => response.json())  
		.then((data) => console.log(data)) 
		.catch(error => { console.log('Hubo un problema al crear el usuario: \n', error) }) 

    }

    const traerLista = () => {


        fetch(API_URL + "users/david")

            .then((response) => {

                if (response.status === 404) {
                    crearUsuario()
                }


                // console.log(response)
                return response.json()
            })

            .then((data) => setLista(data.todos))
            .catch(error => { console.log(' Oh No! Hay un problema: \n', error) })

    }


    const crearTarea = async (text) => {
        try {
            const response = await fetch(API_URL + "todos/alexis", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({
                    label: text,
                    is_done: false
                })
            })
              
            if (!response.ok){
                throw new Error (`Error ${response.status}: No se pudo crear la tarea.`);
            }

            const data= await response.json()
            console.log("tarea creada con exito:", data);
            await traerLista()


        } catch (error) {
                console.error('hubo un problema al crear la tarea:', error)
        }

    }



    const inputText = (event) =>{
       if(event.key === "Enter"){
            crearTarea(tarea) 
            setTarea("")
       } 
    
    }





    useEffect(() => {
       traerLista()
    }, [])







	return (
		

	<div className="container"> 
				
				<h1 className="text-center"> TodoList </h1>    
			    <input type="text" placeholder="Que tarea desea agregar?" value={tarea} onChange={(e) => setTarea(e.target.value)} onKeyDown={inputText}/>
			
        <div>
					
                <ul>
                    {lista.map((item) =>(
                        <li key={item.id}>
                            {item.label}
                        </li>    
                    ))}

				</ul>

		</div>
			
			

			 

	</div>
	

			
		
	);
};

export default TodoListApi;