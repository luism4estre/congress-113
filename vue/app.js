 const app = Vue.createApp({
    data(){
        return {
            miembros: [],
            estado: "all",
            partidos: ["D", "R", "ID"],

            miembrosDemocratas:[],
            miembrosRepublicanos:[],
            miembrosIndependendientes:[],

            porcentajeDeVotosPerdidosDemocratas: "",
            porcentajeDeVotosPerdidosRepublicanos: "",
            porcentajeDeVotosPerdidosIndependientes: "",
            porcentajeDeVotosPerdidosMiembrosTotales:"",

            porcentajeDeVotosAFavorDemocratas:"",
            porcentajeDeVotosAFavorRepublicanos:"",
            porcentajeDeVotosAFavorIndependientes:"",
            porcentajeDeVotosAFavorMiembrosTotales:"",

            miembrosOrdenadosPorMissedVotesAscendente:[],//mas comprometidos
            miembrosOrdenadosPorMissedVotesDescendente:[], //menos comprometidos
            miembrosOrdenadosPorVotesWithPartyAscendente:[],//menos leales
            miembrosOrdenadosPorVotesWithPartyDescendente:[],//mas leales

            miembrosConParticipacionOrdenadosPorMissedVotesAscendente: [],//mas comprometidos
            miembrosConParticipacionOrdenadosPorMissedVotesDescendente: [],//menos comprometidos
            miembrosConParticipacionOrdenadosPorVotesWithPartyAscendente: [],//menos leales
            miembrosConParticipacionOrdenadosPorVotesWithPartyDescendente: [],//mas leales

            miembrosMasComprometidos:[],
            miembrosMenosComprometidos:[],  
            miembrosMasLeales :[],
            miembrosMenosLeales :[], 

        }
    },  
    created(){
        let chamber
        if(window.location.pathname === '/house-data.html' || window.location.pathname === '/house-attendance.html' || window.location.pathname === '/house-loyalty.html'){
            chamber = "house"
        }else if(window.location.pathname === '/senate-data.html' || window.location.pathname === '/senate-attendance.html' || window.location.pathname === '/senate-loyalty.html'){
            chamber = "senate"
        }
        let init = {
            headers:{
                "X-API-key":"4aowEIHNXAVXQB7Yq3XhPODlHKDEyKPFpjIFUsiG"
            }
        }

        fetch(`https://api.propublica.org/congress/v1/113/${chamber}/members.json`, init)
        .then( res => res.json())
        .then(data => {
            this.miembros = data.results[0].members

            this.calcularCantidadDeMiembros(this.miembros)

            this.porcentajeDeVotosPerdidosDemocratas = this.obtenerPorcentajeVotosPerdidos(this.miembrosDemocratas).toFixed(2)
            this.porcentajeDeVotosPerdidosRepublicanos = this.obtenerPorcentajeVotosPerdidos(this.miembrosRepublicanos).toFixed(2)
            this.porcentajeDeVotosPerdidosIndependientes = this.obtenerPorcentajeVotosPerdidos(this.miembrosIndependientes).toFixed(2)
            this.porcentajeDeVotosPerdidosMiembrosTotales = this.obtenerPorcentajeVotosPerdidos(this.miembros).toFixed(2)

            this.porcentajeDeVotosAFavorDemocratas = this.obtenerPorcentajeVotosAfavor(this.miembrosDemocratas).toFixed(2)
            this.porcentajeDeVotosAFavorRepublicanos = this.obtenerPorcentajeVotosAfavor(this.miembrosRepublicanos).toFixed(2)
            this.porcentajeDeVotosAFavorIndependientes = this.obtenerPorcentajeVotosAfavor(this.miembrosIndependientes).toFixed(2)
            this.porcentajeDeVotosAFavorMiembrosTotales = this.obtenerPorcentajeVotosAfavor(this.miembros).toFixed(2)

            this.miembrosOrdenadosPorMissedVotesAscendente = this.ordenarMiembrosPorMissedVotesAscendente(this.miembros) //mas comprometidos
            this.miembrosOrdenadosPorMissedVotesDescendente = this.ordenarMiembrosPorMissedVotesDescendente(this.miembros) //menos comprometidos
            this.miembrosOrdenadosPorVotesWithPartyAscendente = this.ordenarMiembrosPorVotesWithPartyAscendente(this.miembros)//menos leales
            this.miembrosOrdenadosPorVotesWithPartyDescendente = this.ordenarMiembrosPorVotesWithPartyDescendente(this.miembros)//mas leales

            this.miembrosConParticipacionOrdenadosPorMissedVotesAscendente = this.calcularMiembrosConParticipacion(this.miembrosOrdenadosPorMissedVotesAscendente )
            this.miembrosConParticipacionOrdenadosPorMissedVotesDescendente = this.calcularMiembrosConParticipacion(this.miembrosOrdenadosPorMissedVotesDescendente )
            this.miembrosConParticipacionOrdenadosPorVotesWithPartyAscendente = this.calcularMiembrosConParticipacionLeal(this.miembrosOrdenadosPorVotesWithPartyAscendente)
            this.miembrosConParticipacionOrdenadosPorVotesWithPartyDescendente = this.calcularMiembrosConParticipacionLeal(this.miembrosOrdenadosPorVotesWithPartyDescendente)


            this.miembrosMasComprometidos = this.obtenerDiezPorcientoMasComprometido(this.calcularMiembrosConParticipacion(this.miembrosOrdenadosPorMissedVotesAscendente))
            this.miembrosMenosComprometidos = this.obtenerDiezPorcientoMenosComprometido(this.calcularMiembrosConParticipacion(this.miembrosOrdenadosPorMissedVotesDescendente))

            this.miembrosMasLeales = this.obtenerDiezPorcientoMasLeal(this.calcularMiembrosConParticipacionLeal(this.miembrosOrdenadosPorVotesWithPartyAscendente))
            this.miembrosMenosLeales = this.obtenerDiezPorcientoMenosLeal(this.calcularMiembrosConParticipacionLeal(this.miembrosOrdenadosPorVotesWithPartyDescendente))

            // this.votosConElPartido = this.crearArrayDeVotosConElPartido(this.miembrosMasLeales)
        })
        .catch(err => console.error(err.message))
    },
    methods:{
        calcularCantidadDeMiembros(arrayMiembros){
            this.miembrosDemocratas = arrayMiembros.filter(miembro => miembro.party === "D")
            this.miembrosRepublicanos = arrayMiembros.filter(miembro => miembro.party === "R")
            this.miembrosIndependientes = arrayMiembros.filter(miembro => miembro.party === "ID")
        },
        obtenerPorcentajeVotosPerdidos(arrayPorPartido) {
            let arrayDePorcentajes = arrayPorPartido.map(miembro => miembro.missed_votes_pct)
            let sumaDePorcentaje = 0
            
            for (let i = 0; i < arrayDePorcentajes.length; i++) {
                sumaDePorcentaje += arrayDePorcentajes[i]
            }
        
            let porcentajeTotal = sumaDePorcentaje / arrayDePorcentajes.length
        
            return porcentajeTotal
        },
        obtenerPorcentajeVotosAfavor(arrayPorPartido) {
            let arrayDePorcentajes = arrayPorPartido.map(miembro => miembro.votes_with_party_pct)
            let sumaDePorcentaje = 0
            
            for (let i = 0; i < arrayDePorcentajes.length; i++) {
                sumaDePorcentaje += arrayDePorcentajes[i]
            }
        
            let porcentajeTotal = sumaDePorcentaje / arrayDePorcentajes.length
        
            return porcentajeTotal
        },
        ordenarMiembrosPorMissedVotesAscendente(arrayDesordenado){
            let arrayOrdenadoDeMenorAMayor = [...arrayDesordenado]

            // ordeno de menor a mayor por porcentaje de missed votes
            arrayOrdenadoDeMenorAMayor = arrayOrdenadoDeMenorAMayor.sort((a,b)=>{
                if(a.missed_votes_pct < b.missed_votes_pct ){
                    return -1
                }
                if(a.missed_votes_pct > b.missed_votes_pct ){
                    return 1
                }
                return 0
            }) 
            return arrayOrdenadoDeMenorAMayor
        },
        ordenarMiembrosPorMissedVotesDescendente(arrayDesordenado){
            let arrayOrdenadoDeMayorAMenor = [...arrayDesordenado]

            // ordeno de mayor a menor por porcentaje de missed votes
            arrayOrdenadoDeMayorAMenor = arrayOrdenadoDeMayorAMenor.sort((a,b)=>{
                if(a.missed_votes_pct < b.missed_votes_pct ){
                    return 1
                }
                if(a.missed_votes_pct > b.missed_votes_pct ){
                    return -1
                }
                return 0
            }) 
            return arrayOrdenadoDeMayorAMenor
        },
        ordenarMiembrosPorVotesWithPartyAscendente(arrayDesordenado){
            let arrayOrdenadoDeMenorAMayor = [...arrayDesordenado]

            // ordeno de menor a mayor por porcentaje de votes with party
            arrayOrdenadoDeMenorAMayor = arrayOrdenadoDeMenorAMayor.sort((a,b)=>{
                if(a.votes_with_party_pct < b.votes_with_party_pct ){
                    return 1
                }
                if(a.votes_with_party_pct > b.votes_with_party_pct ){
                    return -1
                }
                return 0
            }) 
            return arrayOrdenadoDeMenorAMayor
        },
        ordenarMiembrosPorVotesWithPartyDescendente(arrayDesordenado){
            let arrayOrdenadoDeMenorAMayor = [...arrayDesordenado]

            // ordeno de menor a mayor por porcentaje de votes with party
            arrayOrdenadoDeMenorAMayor = arrayOrdenadoDeMenorAMayor.sort((a,b)=>{
                if(a.votes_with_party_pct < b.votes_with_party_pct ){
                    return -1
                }
                if(a.votes_with_party_pct > b.votes_with_party_pct ){
                    return 1
                }
                return 0
            }) 
            return arrayOrdenadoDeMenorAMayor
        },
        calcularMiembrosConParticipacion(arrayMiembrosOrdenados){
            let miembrosConParticipacion = arrayMiembrosOrdenados.filter(miembro => miembro.missed_votes_pct > 0)
            return miembrosConParticipacion
        },
        calcularMiembrosConParticipacionLeal(arrayMiembrosOrdenados){
            let miembrosConParticipacion = arrayMiembrosOrdenados.filter(miembro => miembro.votes_with_party_pct > 0)
            return miembrosConParticipacion
        },
        calcularDiezPorciento(arrayMiembrosConParticipacion){
            let multiplicacion = arrayMiembrosConParticipacion.length * 10
            let diezPorciento = Math.round(multiplicacion) / 100
            return Math.round(diezPorciento)
        },
        obtenerDiezPorcientoMasComprometido(arrayMiembrosConParticipacion){
            let valorDeReferencia = arrayMiembrosConParticipacion[this.calcularDiezPorciento(this.miembrosConParticipacionOrdenadosPorMissedVotesAscendente)].missed_votes_pct

            let masComprometidos = arrayMiembrosConParticipacion.filter(miembro => miembro.missed_votes_pct <= valorDeReferencia)

            return masComprometidos
        },
        obtenerDiezPorcientoMenosComprometido(arrayMiembrosConParticipacion){
            let valorDeReferencia = arrayMiembrosConParticipacion[this.calcularDiezPorciento(this.miembrosConParticipacionOrdenadosPorMissedVotesDescendente)].missed_votes_pct

            let menosComprometidos = arrayMiembrosConParticipacion.filter(miembro => miembro.missed_votes_pct >= valorDeReferencia)

            return menosComprometidos
        },
        obtenerDiezPorcientoMasLeal(arrayMiembrosConParticipacion){
            let valorDeReferencia = arrayMiembrosConParticipacion[this.calcularDiezPorciento(this.miembrosConParticipacionOrdenadosPorVotesWithPartyDescendente)].votes_with_party_pct

            let masLeales = arrayMiembrosConParticipacion.filter(miembro => miembro.votes_with_party_pct >= valorDeReferencia)

            let masLealesFinal = masLeales.map(miembro =>{
                let multiplicacion = miembro.total_votes * miembro.votes_with_party_pct
                let votosDelPartido = multiplicacion / 100

                return{
                    first_name: miembro.first_name,
                    last_name: miembro.last_name,
                    middle_name: miembro.middle_name,
                    votes_with_party_pct: miembro.votes_with_party_pct,
                    votos_con_el_partido: Math.ceil(votosDelPartido)
                }
            }) 
            
            return masLealesFinal
        },
        obtenerDiezPorcientoMenosLeal(arrayMiembrosConParticipacion){
            let valorDeReferencia = arrayMiembrosConParticipacion[this.calcularDiezPorciento(this.miembrosConParticipacionOrdenadosPorVotesWithPartyAscendente)].votes_with_party_pct

            let menosLeales = arrayMiembrosConParticipacion.filter(miembro => miembro.votes_with_party_pct <= valorDeReferencia)

            let menosLealesFinal = menosLeales.map(miembro =>{
                let multiplicacion = miembro.total_votes * miembro.votes_with_party_pct
                let votosDelPartido = multiplicacion / 100

                return{
                    first_name: miembro.first_name,
                    last_name: miembro.last_name,
                    middle_name: miembro.middle_name,
                    votes_with_party_pct: miembro.votes_with_party_pct,
                    votos_con_el_partido: Math.ceil(votosDelPartido)
                }
            }) 
            
            return menosLealesFinal
        }
    },
    computed:{
        miembrosFiltrados(){
            let miembrosFiltrados = []
            if (this.estado === "all") {
                miembrosFiltrados = this.miembros.filter(miembro => this.partidos.includes(miembro.party))
                return miembrosFiltrados
            } else {
                miembrosFiltrados = this.miembros.filter(miembro => this.partidos.includes(miembro.party) && miembro.state === this.estado)
                return miembrosFiltrados
            }
        }
    }
})


let consola = app.mount("#app")