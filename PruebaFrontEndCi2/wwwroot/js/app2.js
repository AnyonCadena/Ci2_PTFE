$(function () {
    $("#filtroTodas").attr('checked', true);
    call_get_tareas(listarTareas);
});

//var api_url = "http://localhost:5001";
var api_url = "https://drsgps.co/protectedapi"

//var authority_url = "http://localhost:5000";
var authority_url = "https://drsgps.co/identity";

var this_url = "http://localhost:5003";
//var this_url = "https://drsgps.co/jsclient";

var config = {
    authority: authority_url,
    client_id: "js",
    redirect_uri: this_url + "/callback.html",
    response_type: "id_token token",
    scope: "openid profile api1",
    post_logout_redirect_uri: this_url + "/index.html",
};

var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
        $("#contenidoPagina").show();
        call_get_tareas(function () { listarTareas(); });
    }
    else {
        log("User not logged in");
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
    call_get_tareas(consulta);
});
$("#filtroFinalizadas").click(function () {
    var consulta = listarTareas();
    call_get_tareas(consulta);
});
$("#filtroPendientes").click(function () {
    var consulta = listarTareas();
    call_get_tareas(consulta);
});
$("#buscarTareas").click(function () {
    var consulta = listarTareas();
    call_get_tareas(consulta);
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
    mgr.signinRedirect();
}

function cerrarSesion() {
    mgr.signoutRedirect();
}

function call_get_tareas(consulta) {
    mgr.getUser().then(function (user) {
        var q = consulta || {};
        //var url = api_url + "/tareas/consultar?" + convert_to_url_paramas(q);
        var url = api_url + "/tareas/consultar?" + consulta;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            var tareas = JSON.parse(xhr.responseText);
            log(xhr.status, tareas);

            //https://stackoverflow.com/questions/8749236/create-table-with-jquery-append?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
            /* Note that the whole content variable is just a string */
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
    call_post_tarea(tarea);
}

var idBorrar;
var idActualizar;

function borrarTarea() {
    if (idBorrar != null) {
        call_delete_tarea(idBorrar);
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
        call_put_tarea(tarea);
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
    console.log($("#Estado" + id).text());
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

function call_post_tarea(tarea) {
    mgr.getUser().then(function (user) {
        var url = api_url + "/tareas/crear"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
            $("#modalCrearTarea").modal("hide");
            mostrarAlerta("alert-success", "!Exito¡", "La tarea ha sido creada exitosamente");
            call_get_tareas(listarTareas());
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(JSON.stringify(tarea));
    });
}

function call_put_tarea(tarea) {
    mgr.getUser().then(function (user) {
        var url = api_url + "/tareas/actualizar"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
            $("#modalActualizarTarea").modal("hide");
            mostrarAlerta("alert-success", "!Exito¡", "La tarea ha sido actualizada exitosamente");
            call_get_tareas(listarTareas());
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(JSON.stringify(tarea));
    });
}

function call_delete_tarea(id) {
    mgr.getUser().then(function (user) {
        var url = api_url + "/tareas/borrar"
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            $("#modalBorrarTarea").modal("hide");
            mostrarAlerta("alert-success", "!Exito¡", "La tarea ha sido borrada exitosamente");
            call_get_tareas(listarTareas());
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send(JSON.stringify({ id: id }));
    });
}

function convert_to_url_paramas(data) {
    var str = "";
    for (var key in data) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(data[key]);
    }
    return str;
}