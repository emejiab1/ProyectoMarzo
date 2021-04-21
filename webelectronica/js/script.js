var productos = [];
var reciente = [];

//Valida que al momento de ingresar un producto nuevo se hayan llenado todos los campos requeridos
function validar(){

	if(document.getElementById("idCodigo").value == ""){
		alert("Hace falta ingresar el código del producto!");
		return false;
	}

	if(document.getElementById("idNombre").value == ""){
		alert("Hace falta ingresar el nombre del producto!");
		return false;
	}

	if(document.getElementById("idPrecio").value == ""){
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

	if (document.getElementById("idImagen").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

}

/*Esta función sirve para guardar la imagen como un string. Se guarda en sessionStorage mientras se agrega al arreglo que está en la
función llenarArreglo, si no la guardo en sessionStorage se pierde la imagen.*/
function getFile(){

	var resultado="";
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.addEventListener("load", function(){
		resultado = reader.result;
		sessionStorage.setItem("url", resultado);
	},false);

	if (file){
		reader.readAsDataURL(file);
	}

}

function llenarArreglo(){
	var codigo = document.getElementById("idCodigo").value;
	var nombre = document.getElementById("idNombre").value;
	var precio = document.getElementById("idPrecio").value;
	var imagen = sessionStorage.getItem("url");	//Obtiene la imagen después de que se convirtión en string en la función getFile

	var codigoExiste = false;

	//Esto valida que si ya hay productos en el local storage entonces que verifiqué que el código ingresado no se esté repitiendo
	if(localStorage.getItem("registro") != null){
		productos = JSON.parse(localStorage.getItem("registro"));

		for(var i=0; i<productos.length; i++){

			if (productos[i].codigo == codigo) {
				codigoExiste = true;
				alert("EL CODIGO INGRESADO YA EXISTE!");
			}

		}
	}

	//Si el código no se repite entonces procede a guardar el arreglo en el localStorage
	if(codigoExiste == false){

		var prod = new objproducto(codigo, nombre, precio, imagen);
		reciente.push(prod);
		productos.push(prod);
		localStorage.clear();

		//No se puede guardar un arreglo en el localStorage por lo que se usa JSON para convertir el arreglo en string
		localStorage.setItem("registro", JSON.stringify(productos));
	}
	
}

function objproducto(codigo, nombre, precio, imagen){
	this.codigo = codigo,
	this.nombre = nombre,
	this.precio = precio,
	this.imagen = imagen
}

function actualizarTabla(){

	var scriptTabla="";

	for(var index=0; index<reciente.length; index++){

		scriptTabla+="<tr>";
		scriptTabla+="<td>"+reciente[index].codigo+"</td>";
		scriptTabla+="<td>"+reciente[index].nombre+"</td>";
		scriptTabla+="<td>Q "+reciente[index].precio+"</td>";
		scriptTabla+="<td><img src=\""+reciente[index].imagen+"\" width=\"75px\"></td>";
		scriptTabla+="</tr>";

	}

	document.getElementById("idTableBody").innerHTML = scriptTabla;

}

function limpiar(){
	document.getElementById("idCodigo").value = "";
	document.getElementById("idNombre").value = "";
	document.getElementById("idPrecio").value = "";
	document.getElementById("idImagen").value = "";
}

function mostrarProductos(){

	var guardados = [];
	guardados = JSON.parse(localStorage.getItem("registro"));

	var scriptTabla;

	for(var index=0; index<guardados.length; index++){

		//Se crea la tabla que muestra el mensaje. A los id de los formularios se les agrega el código del producto
		scriptTabla+="<tr>";
		scriptTabla+="<td>"+guardados[index].codigo+"</td>";
		scriptTabla+="<td>"+guardados[index].nombre+"<br><br><label for=\""+guardados[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+guardados[index].codigo+"\"></td>";
		scriptTabla+="<td>Q "+guardados[index].precio+"<br><br><input type=\"button\" value=\"Agregar al carrito\" id=\""+guardados[index].codigo+"\" onclick=\"agregarCarrito(this.id)\"></td>";
		scriptTabla+="<td><img src=\""+guardados[index].imagen+"\" width=\"75px\"></td>";
		scriptTabla+="</tr>";
	}

	document.getElementById("idTableBody2").innerHTML = scriptTabla;

}

function objpedido(codigo, nombre, precio, imagen, cantidad){
	this.codigo=codigo,
	this.nombre=nombre,
	this.precio=precio,
	this.imagen=imagen,
	this.cantidad=cantidad
}

//Debe recibir el id para buscarlo en los productos registrados
function agregarCarrito(id){

	var buscarProductos = [];
	var auxiliar = [];
	var getProducto = [];

	var codigo;
	var nombre;
	var precio;
	var imagen;
	var cantidad;

	buscarProductos = JSON.parse(localStorage.getItem("registro"));

	for(var i=0; i<buscarProductos.length; i++){

		if(buscarProductos[i].codigo == id){
			codigo = buscarProductos[i].codigo;
			nombre = buscarProductos[i].nombre;
			precio = buscarProductos[i].precio;
			imagen = buscarProductos[i].imagen;
			cantidad = document.getElementById("c"+id).value;
		}

	}

	if(cantidad != "" && cantidad > 0){

		//Este if permite actualizar la cantidad de un producto que ya había sido agregado al carrito
		if(JSON.parse(sessionStorage.getItem("regPedido"))!=null){

			var actualizar = false;

			//Los pedidos se están guardando en sessionStorage
			auxiliar = JSON.parse(sessionStorage.getItem("regPedido"));

			for(var y=0; y<auxiliar.length; y++){
				if(auxiliar[y].codigo == codigo){
					actualizar = true;
					break;
				}
			}

			if(actualizar == true){
				for(var z=0; z<auxiliar.length; z++){
					if(auxiliar[z].codigo != codigo){
						getProducto.push(auxiliar[z]);
					}
				}

				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

				getProducto.push(ped);

				sessionStorage.clear();
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
			}else{

				getProducto = auxiliar;

				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

				getProducto.push(ped);

				sessionStorage.clear();
				//Se debe guardar en sessionStorage porque el pedido sólo es por usuario en una sóla sesión
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));

			}

		}else{
			var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

			getProducto.push(ped);

			sessionStorage.clear();
			sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
		}

	}else{

		alert("NO SE HA INGRESADO UNA CANTIDAD!");

	}

}

function revisarPedido(){
	var carrito = [];
	var total = 0;
	carrito = JSON.parse(sessionStorage.getItem("regPedido"));

	var scriptTabla;

	for(var index=0; index<carrito.length; index++){

		scriptTabla+="<tr>";
		scriptTabla+="<td>"+carrito[index].codigo+"</td>";
		scriptTabla+="<td>"+carrito[index].nombre+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src=\""+carrito[index].imagen+"\" width=\"75px\"></td>"
		scriptTabla+="<td>"+carrito[index].cantidad+"<br><br><label for=\""+carrito[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+carrito[index].codigo+"\" onchange=\"actualizarCantidad(this.id)\">&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"Descartar\" id=\""+carrito[index].codigo+"\" onclick=\"quitarCarrito(this.id)\"></td>";
		scriptTabla+="<td>Q "+carrito[index].precio+"</td>";
		scriptTabla+="<td>Q "+carrito[index].cantidad*carrito[index].precio+"</td>";
		scriptTabla+="</tr>";
		total+=carrito[index].cantidad*carrito[index].precio;
	}

	document.getElementById("idTableBody3").innerHTML = scriptTabla;
	document.getElementById("total").innerHTML = "Total de su compra:&nbsp;&nbsp;&nbsp;&nbsp;Q "+total;
}

//Recibe el id del producto desde el input donde se modifica la cantidad. Se le quita la letra para que quede sólo el id.
//Después se envía a la función (agregarCarrito)
function actualizarCantidad(id){
	var nuevoid = id.substring(1);
	
	agregarCarrito(nuevoid);

	revisarPedido();
}

function quitarCarrito(id){

	var pedidoActual = [];
	var nuevoPedido = [];

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	for(var y=0; y<pedidoActual.length; y++){
		if(pedidoActual[y].codigo != id){
			nuevoPedido.push(pedidoActual[y]);
		}
	}

	sessionStorage.clear();
	sessionStorage.setItem("regPedido", JSON.stringify(nuevoPedido));

	revisarPedido();

}

function validarCompra(){

	if(sessionStorage.getItem("regPedido") == null){
		alert("NO HAY PRODUCTOS EN EL CARRITO!");
		return false;
	}

	if(document.getElementById("idNombre").value == ""){
		alert("DEBE INGRESAR SU NOMBRE COMPLETO!");
		return false;
	}

	if(document.getElementById("idDireccion").value == ""){
		alert("DEBE INGRESAR UNA DIRECCION DE ENTREGA!");
		return false;
	}

}

function comprar(){

	if(validarCompra()==false){
		return false;
	}

	document.getElementById("idNit").value="";
	document.getElementById("idNombre").value="";
	document.getElementById("idDireccion").value="";
	sessionStorage.clear();
	alert("Su pedido se registro correctamente!\n Muchas gracias por su compra!");

}

function agregarProducto(){

	if(validar()==false){
		return false;
	}

	llenarArreglo();

	actualizarTabla();

	limpiar();

}

