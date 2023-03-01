const SHA256 = require("crypto-js/sha256");

let sistema = {
    blockChain: [],
    dificultad: "00",
    crearGenesis: function(){
        let genesis = this.crearBloque("Bloque de Genesis","");
        genesis.hash = this.crearHash(genesis);
        this.blockChain.push(genesis);
    },
    crearHash(bloque){
        return SHA256(bloque.index + bloque.fecha +JSON.stringify(bloque.datos) + bloque.previousHash + bloque.nonce).toString();
    },
    crearBloque: function(data, previousHash){
        let bloque={
            index: this.blockChain.length+1,
            fecha: new Date(),
            previousHash: previousHash,
            hash: "",
            datos: data,
            nonce:0
        };
        return bloque;
    },
    agregarBloque: function(datos){
        console.log("agregando bloque");
        let previo = this.blockChain[this.blockChain.length-1];
        let block = this.crearBloque(datos, previo.hash);
        
        block = this.minarBloque(block);
        this.blockChain.push(block);
    },
    minarBloque: function(bloque){
        while(!bloque.hash.startsWith(this.dificultad)){
            bloque.nonce++;
            bloque.hash = this.crearHash(bloque);
        };
        return bloque;
    },
    validarCadena: function(){
        for(let i=1; i<this.blockChain.length; i++){
            let prevBlock = this.blockChain[i-1];
            let currBlock = this.blockChain[i];
            if(currBlock.previousHash != prevBlock.hash){
                console.log("error de hash previo"+ currBlock.index);
                return false;
            };
            if(this.crearHash(currBlock) != currBlock.hash){
                console.log("El hash no es correcto");
                return false;
            };
        }
        return true;
    }
};

sistema.crearGenesis();
sistema.agregarBloque({"voto":"A"});
sistema.agregarBloque({"voto":"B"});
sistema.agregarBloque({"voto":"C"});
sistema.agregarBloque({"voto":"D"});
console.log(sistema.validarCadena());

//Ejemplo de ataque
sistema.blockChain[1].datos.voto="X";
console.log("Luego de la modificacion", sistema.validarCadena());

console.log(JSON.stringify(sistema.blockChain, null, 2));
