// JSON
let miembros = data.results[0].members
let dropdownEstados = document.querySelector('#dropdown-estados');
let tablaMiembros = document.querySelector('#tabla_miembros');

let estados = [] 
miembros.forEach(miembro => {
    if (!estados.includes(miembro.state)) {
        estados.push(miembro.state)
    }
} )
estados.sort()

estados.forEach(estado => {
    let option = document.createElement("option")
    option.innerText = estado 
    option.value = estado   
    dropdownEstados.appendChild(option)
})


function crearTabla(array, tabla) {
    tabla.innerHTML = ""

    if (array.length === 0) {
        alert("Please, minimun choose a party")
    }else{
        array.forEach(miembro => {
            let fila = document.createElement("tr")
            fila.innerHTML =
            `
            <td>${miembro["last_name"]}</td>
            <td><a href="${miembro["url"]}" target="_blank" rel="noopener noreferrer" class="name_link">${miembro["first_name"]} ${miembro["middle_name"] || ""}</a></td>
            <td>${miembro["party"]}</td>
            <td>${miembro["state"]}</td>
            <td>${miembro["seniority"]}</td>
            <td>${miembro["votes_with_party_pct"]}&percnt;</td>
            `
            tabla.appendChild(fila)
        })
    }

    
}
crearTabla(miembros, tablaMiembros)


let contenedorFiltros = document.querySelector("#form_container") 

contenedorFiltros.addEventListener("change", (e) =>{

    let checkboxes = contenedorFiltros.querySelectorAll("[type='checkbox']")
    let chequeados = Array.from(checkboxes).filter(checkbox => checkbox.checked)
    let partidosSeleccionados = chequeados.map(checkbox => checkbox.value)
    console.log(partidosSeleccionados)

    let estadoSeleccionado = dropdownEstados.value
    console.log(estadoSeleccionado)

    let filtradoFinalMiembros = filtrarPorEstadoYPartido(miembros,estadoSeleccionado, partidosSeleccionados)

    crearTabla(filtradoFinalMiembros, tablaMiembros)
})


function filtrarPorEstadoYPartido(arrayMiembros, estado, partidos) {
    let miembrosFiltrados = []
    for (let i = 0;  i < arrayMiembros.length; i++){
        if(arrayMiembros[i].state === estado || estado ==="all"){
            if (partidos.includes(arrayMiembros[i].party)) {
                miembrosFiltrados.push(miembros[i])
            }
        }     
    }
    return  miembrosFiltrados
}