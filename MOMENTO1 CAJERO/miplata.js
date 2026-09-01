let usuarios = [];

// Revisamos si ya hay usuarios guardados en localStorage
if (localStorage.getItem("usuariosMiPlata") !== null) {
    usuarios = JSON.parse(localStorage.getItem("usuariosMiPlata"));
}

// Función para guardar los usuarios en localStorage
function guardarUsuarios(){
localStorage.setItem("usuariosMiPlata", JSON.stringify(usuarios))
}

// Función para registrar un usuario nuevo
function registrarUsuarios(){
    let nombre = prompt("Ingrese su nombre de usuario:");

    if (nombre === null || nombre ===""){
        console.log("El nombre de usuario no puede estar vacio.");
        return;
    }


let usuarioExiste = false;

for (let i = 0; i < usuarios.length; i++){
    if (usuarios[i].nombre === nombre){
        usuarioExiste = true;
    }
}

if (usuarioExiste === true){
    console.log("Ese nombre de usuario ya existe. Intente con otro.");
    return;
}

let clave = prompt ("Ingrese la clave:");

if (clave === null || clave==="") {
    console.log("La clave no puede estar vacía.");
    return;
}

let saldoInicial = Number(prompt("Ingrese el saldo inicial: "));
if (isNaN(saldoInicial) || saldoInicial < 0){
    console.log("El saldo inicial debe ser un número válido mayor o igual a cero.");
    return;
}

let nuevoUsuario = {
    nombre: nombre,
    clave: clave,
    saldo: saldoInicial,
    intentos: 0,
    bloqueado: false,
    movimientos:[]
};

usuarios.push(nuevoUsuario);

guardarUsuarios();
console.log("Usuario registrado correctamente");
}

function iniciarSesion() {
    let nombre = prompt("Ingrese su nombre de usuario: ");
    let clave = prompt ("Ingese su clave");

    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++){
        if (usuarios [i].nombre === nombre){
            usuarioEncontrado = usuarios[i];
        }
    }

    if (usuarioEncontrado === null){
        console.log("El usuario no existe.");
        return;
    }
    
    if (usuarioEncontrado.bloqueado === true){
        console.log("Cuenta bloqueada por 24 horas, comunicate con tu banco.");
        return;
    }

    if (usuarioEncontrado.clave === clave){
        usuarioEncontrado.intentos = 0;

        guardarUsuarios();

        console.log("Inicio de sesión exitoso. Bienvenido(a) " + usuarioEncontrado.nombre)

        menuTransacciones (usuarioEncontrado);
        } else { 
            usuarioEncontrado.intentos = usuarioEncontrado.intentos + 1;

            let intentosRestantes=3 - usuarioEncontrado.intentos;

            if(usuarioEncontrado.intentos >= 3){
                usuarioEncontrado.bloqueado = true;

                guardarUsuarios();

                console.log("Cuenta bloqueada por 24 horas, comunicate con tu banco.");
            } else {
                guardarUsuarios();

                console.log("Clave incorrecta. intentos estantes: " + intentosRestantes);
         
        }
    }
}

// Función para retirar dinero
function retirarDinero (usuario){
    let monto = Number (prompt("Ingrese el monto que desear retirar: "));

    if (isNaN (monto) || monto <= 0) {
        console.log("Ingrese un monto válido mayor que cero.");
        return;
    }

    if (monto > usuario.saldo){
        console.log("No tiene saldo suficiente para realizar este retiro. ");
        return;
    }

    usuario.saldo = usuario.saldo - monto;

    let movimiento = {
        tipo: "Retiro",
        monto: monto,
        fecha: new Date(). toLocaleString()
    };

    usuario.movimientos.push(movimiento);

    guardarUsuarios();

    console.log(
        "Retiro realizado correctamente. \nNuevo saldo: $" + usuario.saldo
    );   
}

// Función para consultar el saldo
function consultarSaldo (usuario) {
    console.log("Su saldo actual es: $" + usuario.saldo);
}

//Funcion para consignar dinero
function consignarDinero(usuario) {
  let monto = Number(prompt("Ingrese el monto que desea consignar:"));

  if (isNaN(monto) || monto <= 0) {
    console.log("El monto debe ser un número positivo mayor que cero.");
    return;
  }

  usuario.saldo = usuario.saldo + monto;

  let movimiento = {
    tipo: "Consignación",
    monto: monto,
    fecha: new Date().toLocaleString()
  };

  usuario.movimientos.push(movimiento);

  guardarUsuarios();

  console.log(
    "Consignación realizada correctamente.\nNuevo saldo: $" + usuario.saldo
  );
}

// Función para consultar movimientos
function consultarMovimiento (usuario){
    if (usuario.movimientos.length===0){
        console.log("No tiene movimientos registrados.");
        return;
    }

    let mensaje = "HISTORIAL DE MOVIMIENTO\n\n";

    for (let i = 0; i < usuario.movimientos.length; i++){
       mensaje = mensaje + 
       "Fecha: " + usuario.movimientos[i].fecha + "\n" +
       "Tipo: " + usuario.movimientos[i].tipo + "\n" + 
       "Monto: $" + usuario.movimientos[i].monto + "\n" + 
       "-----------------------------------------\n";
    }
    console.log(mensaje);
}

// Función del menú después de iniciar sesión.
function menuTransacciones (usuario) {
    let opcion= "";

    while (opcion !== "5"){
        opcion = prompt(
            "BANCO MI PLATA\n\n" +
            "1. Retirar dinero\n" +
            "2. Consultar saldo\n" + 
            "3. Consignar dinero\n" +
            "4. Consultar movimiento\n" +
            "5. Cerrar sesión\n" +
            "Elija una opción:"
        )

        switch (opcion){
            case "1":
                retirarDinero(usuario);
                break;
            
            case "2":
                consultarSaldo(usuario);
                break;
            
            case "3":
                consignarDinero(usuario);
                break;
            case "4":
                consultarMovimiento(usuario);
                break;
            case "5":
                console.log("Seción cerrada.");
                break;
            
            default:
                console.log("Opción no valida. Digite la opción correcta.")
        }
    }
}

// Función del menú principal
function menuPrincipal(){
    let opcion = "";

    while (opcion !=="3"){
        opcion= prompt(
            "BIENVENIDO AL BANCO MI PLATA\n\n" + 
            "1. Iniciar seción\n" + 
            "2. Registrar usuario\n" +
            "3. Salir\n\n" +
            "Elija una opción:"
        );
        
       if (opcion === "1") {
        iniciarSesion();
       } else if (opcion=== "2"){
        registrarUsuarios();
       } else if (opcion === "3"){
        console.log("Gracias por usar banco Mi Plata.");
       } else{
        console.log("Opción no valida. Digite la opción correcta.");
       }
       }   
    }
// Se llama el menú principal para iniciar el programa
menuPrincipal();