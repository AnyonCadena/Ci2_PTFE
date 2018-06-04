$(function () {
    $("#filtroTodas").attr('checked', true);
    peticionObtenerTareas(listarTareas);
});

//var api_url = "http://localhost:5001";
var api_url = "https://drsgps.co/protectedapi"

//var autorizacion_url = "http://localhost:5000";
var autorizacion_url = "https://drsgps.co/identity";

var local_url = "http://localhost:5003";
//var local_url = "https://drsgps.co/jsclient";

var configuracion = {
    authority: autorizacion_url,
    client_id: "js",
    redirect_uri: local_url + "/callback.html",
    response_type: "id_token token",
    scope: "openid profile api1",
    post_logout_redirect_uri: local_url + "/index.html",
};

var gestionUsuario = new Oidc.UserManager(configuracion);

gestionUsuario.getUser().then(function (user) {
    if (user) {
        log("user logged in", user.profile);
        $("#contenidoPagina").show();
        peticionObtenerTareas(listarTareas());
    }
    else {
        log("user not logged in");
        $("#inicioDeSesion").show();
    }
});

function log() {
    //document.getElementById('results').innerText = '';
    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        //document.getElementById('results').innerHTML += "";//msg + '\r\n';
        console.log(msg);
    });
}

$("#btnNuevaTarea").click(function () {
    $("#descripcion").val('');
    $("#fechaVencimiento").val('');
});

$("#inicioSesion").click(function () {
    inicioSesion();
});
$("#cerrarSesion").click(function () {
    cerrarSesion();
});
$("#crearTarea").click(function () {
    crearTarea();
});
$("#borrarTarea").click(function () {
    borrarTarea();
});
$("#actualizarTarea").click(function () {
    actualizarTarea()
});
$("#filtroTodas").change(function () {
    var consulta = listarTareas();
    peticionObtenerTareas(consulta);
});
$("#filtroFinalizadas").click(function () {
    var consulta = listarTareas();
    peticionObtenerTareas(consulta);
});
$("#filtroPendientes").click(function () {
    var consulta = listarTareas();
    peticionObtenerTareas(consulta);
});
$("#buscarTareas").click(function () {
    var consulta = listarTareas();
    peticionObtenerTareas(consulta);
});

function listarTareas() {
    var descripcion = "";
    var consulta = "";
    if ($("#textoDescripcion").val() != "") {
        descripcion = "descripcion=" + $("#textoDescripcion").val();
        consulta += descripcion;
    }
    if ($('#filtroTodas').is(':checked')) {
        return consulta;
    }
    if ($('#filtroFinalizadas').is(':checked')) {
        consulta += (($("#textoDescripcion").val() != "") ? "&" : "");
        consulta += "finalizada=true";
        return consulta;
    }
    if ($('#filtroPendientes').is(':checked')) {
        consulta += (($("#textoDescripcion").val() != "") ? "&" : "");
        consulta += "finalizada=false";
        return consulta;
    }
    return consulta;
}

function inicioSesion() {
    gestionUsuario.signinRedirect();
}

function cerrarSesion() {
    gestionUsuario.signoutRedirect();
}

function peticionObtenerTareas(consulta) {
    gestionUsuario.getUser().then(function (user) {
        var url = api_url + "/tareas/consultar?" + consulta;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            var tareas = JSON.parse(xhr.responseText);
            log(xhr.status, tareas);

            var content = '';
            var No = 'No';
            var Si = 'Si';
            tareas.forEach(function (element) {
                content += '<div class="card" style="margin-bottom:10px"><div class="modal-body">';
                content += '<div><div class="form-group-sm">';
                content += '<label for="descripcion' + element.id + '" class="font-weight-bold">Descripción: </label>';
                content += '<label id="descripcion' + element.id + '">' + element.descripcion + '</label>';
                content += '</div><div class="form-group-sm">';
                content += '<label for="fechaVencimiento' + element.id + '"class="font-weight-bold">Fecha de vencimiento: </label>';
                content += '<label id="fechaVencimiento' + element.id + '">' + element.fechaVencimiento + '</label>';
                content += '</div><div class="form-group-sm">';
                content += '<label for="Estado' + element.id + '" class="font-weight-bold">Finalizada: </label>';
                content += '<label id="Estado' + element.id + '">' + (element.finalizada == true ? Si : No) + '</label>';
                content += '</div></div></div>';
                content += '<div class="modal-footer">';
                content += '<button value="' + element.id + '" onclick="abrirModalActualizar(\'' + element.id + '\')" name="actualizarTarea" type="button" class="btn btn-primary">Actualizar</button>';
                content += '<button value="' + element.id + '" onclick="abrirModalBorrar(\'' + element.id + '\')" name="borrarTarea" type="button" class="btn btn-danger"> Borrar</button>';
                content += '</div></div>';
            });
            document.getElementById("divTareas").innerHTML = content;
            if (tareas.length == 0)
                document.getElementById("divTareas").innerHTML = '<span class="bg-light">No hay tareas registradas</span>';
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(null);
    });
}

function crearTarea() {
    var tarea = {
        descripcion: $("#descripcion").val(),
        fechaVencimiento: $("#fechaVencimiento").val()
    }
    peticionCrearTarea(tarea);
}

var idBorrar;
var idActualizar;

function borrarTarea() {
    if (idBorrar != null) {
        peticionBorrarTarea(idBorrar);
    }
}

function actualizarTarea() {
    if (idActualizar != null) {
        var tarea = {
            id: idActualizar,
            descripcion: $("#descripcionActualizar").val(),
            fechaVencimiento: $("#fechaVencimientoActualizar").val(),
            finalizada: $('#filtroFinalizadasActualizar').is(':checked')
        }
        peticionActualizarTarea(tarea);
    }
}

function abrirModalBorrar(id) {
    $("#modalBorrarTarea").modal("show");
    idBorrar = id;
}

function abrirModalActualizar(id) {
    idActualizar = id;
    $("#descripcionActualizar").text($("#descripcion" + id).text());
    $("#fechaVencimientoActualizar").val($("#fechaVencimiento" + id).text().substring(0, 10));
    if ($("#Estado" + id).text() == 'No') {
        $("#filtroPendientesActualizar").attr("checked", true);
    }
    else {
        $("#filtroFinalizadasActualizar").attr("checked", true);
    }
    $("#modalActualizarTarea").modal("show");
}

function mostrarAlerta(tipoAlerta, tituloAlerta, mensajeAlerta) {
    $("#cuadroAlerta").hide();
    $("#cuadroAlerta").show();
    $("#cuadroAlerta").addClass(tipoAlerta);
    $("#tituloAlerta").append(tituloAlerta);
    $("#mensajeAlerta").append(mensajeAlerta);
}

function peticionCrearTarea(tarea) {
    gestionUsuario.getUser().then(function (user) {
        var url = api_url + "/tareas/crear"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            $("#modalCrearTarea").modal("hide");
            mostrarAlerta("alert-success", "!Exito¡", "La tarea ha sido creada exitosamente");
            peticionObtenerTareas(listarTareas());
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(JSON.stringify(tarea));
    });
}

function peticionActualizarTarea(tarea) {
    gestionUsuario.getUser().then(function (user) {
        var url = api_url + "/tareas/actualizar"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            $("#modalActualizarTarea").modal("hide");
            mostrarAlerta("alert-success", "!Exito¡", "La tarea ha sido actualizada exitosamente");
            idActualizar = null;
            peticionObtenerTareas(listarTareas());
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(JSON.stringify(tarea));
    });
}

function peticionBorrarTarea(id) {
    gestionUsuario.getUser().then(function (user) {
        var url = api_url + "/tareas/borrar"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            $("#modalBorrarTarea").modal("hide");
            mostrarAlerta("alert-success", "!Exito¡", "La tarea ha sido borrada exitosamente");
            idBorrar = null;
            peticionObtenerTareas(listarTareas());
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(JSON.stringify({ id: id }));
    });
}