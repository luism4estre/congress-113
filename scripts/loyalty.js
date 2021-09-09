let miembrosTotales;


miembrosTotales = data.results[0].members


let miembrosDemocratas;
let miembrosRepublicanos;
let miembrosIndependendientes;

let tablaAtGlanceLoyalty = document.querySelector("#table_at_a_glance_loyalty")
let tablaLeastLoyal = document.querySelector("#table_least_loyal")
let tablaMostLoyal = document.querySelector("#table_most_loyal")

miembrosDemocratas = miembrosTotales.filter( miembro => miembro.party === "D")
miembrosRepublicanos = miembrosTotales.filter( miembro => miembro.party === "R")
miembrosIndependendientes = miembrosTotales.filter( miembro => miembro.party === "ID")



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

crearTablaAtGlance("Democratas",  miembrosDemocratas.length,       obtenerPorcentajeVotosAfavor(miembrosDemocratas).toFixed(2),        tablaAtGlanceLoyalty)
crearTablaAtGlance("Republicans", miembrosRepublicanos.length,     obtenerPorcentajeVotosAfavor(miembrosRepublicanos).toFixed(2),      tablaAtGlanceLoyalty)
crearTablaAtGlance("Independents",miembrosIndependendientes.length,obtenerPorcentajeVotosAfavor(miembrosIndependendientes).toFixed(2), tablaAtGlanceLoyalty)
crearTablaAtGlance("Total",       miembrosTotales.length,          obtenerPorcentajeVotosAfavor(miembrosTotales).toFixed(2),           tablaAtGlanceLoyalty)


// ---------- senate/house loyalty functions--------------
miembrosTotalesOrdenadosPorLoyalty = [...miembrosTotales]

// ordeno de menor a mayor por porcentaje de votes con el partido
miembrosTotalesOrdenadosPorLoyalty = miembrosTotalesOrdenadosPorLoyalty.sort((a,b)=>{
    if(a.votes_with_party_pct < b.votes_with_party_pct ){
        return -1
    }
    if(a.votes_with_party_pct > b.votes_with_party_pct ){
        return 1
    }
    return 0
}) 

let miembrosConParticipacion  = miembrosTotalesOrdenadosPorLoyalty.filter(miembro => {
	return miembro.votes_with_party_pct > 0
})

function primerosDiezPorCientoPorLoyalty(array) {
    let valorReferenciaPrimerosOnce = array[10].votes_with_party_pct

    let menosLeales = array.filter(miembro =>{
        return miembro.votes_with_party_pct <= valorReferenciaPrimerosOnce
    })

    return menosLeales
}

function ultimosDiezPorCientoPorLoyalty(array) {
    let posicionReferenciaUltimosOnce = array.length - 11
    let valorReferenciaUltimosOnce = array[posicionReferenciaUltimosOnce].votes_with_party_pct
    
    let masLeales = array.filter(miembro =>{
        return miembro.votes_with_party_pct >= valorReferenciaUltimosOnce
    })
    
    return masLeales
}

function obtenerLeastAndMostLoyalSet(array) {
    let masYmenosLeales = array.map(miembro=>{
        let multiplicacion = miembro.total_votes * miembro.votes_with_party_pct
        let votosDelPartido = multiplicacion / 100
    
        return{
            url: miembro.url,
            full_name:`${miembro.first_name} ${miembro.last_name}`,
            votos_del_partido: votosDelPartido.toFixed(2),
            votes_with_party_pct: miembro.votes_with_party_pct
        }
    })

    return masYmenosLeales
}

function crearTablaLoyal(array, tabla){

    array.forEach(miembro =>{
        let fila = document.createElement("tr")
        fila.innerHTML = 
        `
        <td><a href="${miembro["url"]}" target="_blank" class="name_link"> ${miembro["full_name"]} </a></td>
        <td>${miembro["votos_del_partido"]}</td>
        <td>${miembro["votes_with_party_pct"]}</td>
        `
        tabla.appendChild(fila)
    })
}


crearTablaLoyal(obtenerLeastAndMostLoyalSet(primerosDiezPorCientoPorLoyalty(miembrosConParticipacion)),tablaLeastLoyal )
crearTablaLoyal(obtenerLeastAndMostLoyalSet(ultimosDiezPorCientoPorLoyalty(miembrosTotalesOrdenadosPorLoyalty)),tablaMostLoyal)