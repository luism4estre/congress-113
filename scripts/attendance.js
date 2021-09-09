let miembrosTotales;


miembrosTotales = data.results[0].members


let miembrosDemocratas;
let miembrosRepublicanos;
let miembrosIndependendientes;

let tablaAtGlance = document.querySelector("#table_at_a_glance")
let tablaLeastEngaged = document.querySelector("#table_least_engaged")
let tablaMostEngaged = document.querySelector("#table_most_engaged")




miembrosDemocratas = miembrosTotales.filter( miembro => miembro.party === "D")
miembrosRepublicanos = miembrosTotales.filter( miembro => miembro.party === "R")
miembrosIndependendientes = miembrosTotales.filter( miembro => miembro.party === "ID")

// -----------Senate/house attendance functions----------
function obtenerPorcentajeVotosPerdidos(arrayPorPartido) {
    let arrayDePorcentajes = arrayPorPartido.map(miembro => miembro.missed_votes_pct)
    let sumaDePorcentaje = 0
    
    for (let i = 0; i < arrayDePorcentajes.length; i++) {
        sumaDePorcentaje += arrayDePorcentajes[i]
    }

    let porcentajeTotal = sumaDePorcentaje / arrayDePorcentajes.length

    return porcentajeTotal
}

function obtenerPorcentajeVotosAfavor(arrayPorPartido) {
    let arrayDePorcentajes = arrayPorPartido.map(miembro => miembro.votes_with_party_pct)
    let sumaDePorcentaje = 0
    
    for (let i = 0; i < arrayDePorcentajes.length; i++) {
        sumaDePorcentaje += arrayDePorcentajes[i]
    }

    let porcentajeTotal = sumaDePorcentaje / arrayDePorcentajes.length

    return porcentajeTotal
}

function crearTablaAtGlance(partido, cantidadMiembros, porcentajeVotos, tabla ){ 
    if (cantidadMiembros > 0) {
        let fila = document.createElement("tr")
        fila.innerHTML = `<td>${partido}</td> <td>${cantidadMiembros}</td> <td>${porcentajeVotos}&#37;</td>`
        tabla.appendChild(fila)
    } 
    
}

crearTablaAtGlance("Democratas",  miembrosDemocratas.length,       obtenerPorcentajeVotosPerdidos(miembrosDemocratas).toFixed(2)       ,tablaAtGlance)
crearTablaAtGlance("Republicans", miembrosRepublicanos.length,     obtenerPorcentajeVotosPerdidos(miembrosRepublicanos).toFixed(2)     ,tablaAtGlance)
crearTablaAtGlance("Independents",miembrosIndependendientes.length,obtenerPorcentajeVotosPerdidos(miembrosIndependendientes).toFixed(2),tablaAtGlance)
crearTablaAtGlance("Total",       miembrosTotales.length,          obtenerPorcentajeVotosPerdidos(miembrosTotales).toFixed(2)          ,tablaAtGlance)

// ----------------miembrosTotales ordenados--------------
miembrosTotalesOrdenadosPorMissedVotes = [...miembrosTotales]

// ordeno de menor a mayor por porcentaje de missed votes
miembrosTotalesOrdenadosPorMissedVotes = miembrosTotalesOrdenadosPorMissedVotes.sort((a,b)=>{
    if(a.missed_votes_pct < b.missed_votes_pct ){
        return -1
    }
    if(a.missed_votes_pct > b.missed_votes_pct ){
        return 1
    }
    return 0
}) 

let miembrosConParticipacion  = miembrosTotalesOrdenadosPorMissedVotes.filter(miembro => {
	return miembro.missed_votes > 0
})

function primerosDiezPorCientoPorMissed(array) {
    
    let valorReferenciaPrimerosOnce = array[10].missed_votes_pct

    let masComprometidos = array.filter(miembro =>{
        return miembro.missed_votes_pct <= valorReferenciaPrimerosOnce
    })

    return masComprometidos
}

function ultimosDiezPorCientoPorMissed(array) {
    let posicionReferenciaUltimosOnce = array.length - 11
    let valorReferenciaUltimosOnce = array[posicionReferenciaUltimosOnce].missed_votes_pct
    
    let menosComprometidos = array.filter(miembro =>{
        return miembro.missed_votes_pct >= valorReferenciaUltimosOnce
    })
    
    return menosComprometidos
}

function crearTablaEngaged(array, tabla){  
    tabla.innerText = ""
    array.forEach(miembro => {
        let fila = document.createElement("tr")
        fila.innerHTML = `
            <td><a href="${miembro.url}" target="_blank" class="name_link">${miembro.first_name} ${miembro.last_name} </a></td>
            <td>${miembro.missed_votes}</td>
            <td>${miembro.missed_votes_pct}%</td>
        `
        tabla.appendChild(fila)
    })
}
crearTablaEngaged(ultimosDiezPorCientoPorMissed(miembrosTotalesOrdenadosPorMissedVotes),tablaLeastEngaged)
crearTablaEngaged(primerosDiezPorCientoPorMissed(miembrosConParticipacion),tablaMostEngaged)