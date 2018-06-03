$(function() {
    $("#filtroTodas").attr('checked', true);
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
        call_get_tareas(null);
    }
    else {
        log("User not logged in");
        $("#inicioDeSesion").show();
    }
});

function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += "";//msg + '\r\n';
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


function inicioSesion() {
    mgr.signinRedirect();
}

function cerrarSesion() {
    mgr.signoutRedirect();
}

function call_get_tareas(consulta) {
    mgr.getUser().then(function (user) {
        var q = consulta || {};
        var url = api_url + "/tareas/consultar?" + convert_to_url_paramas(q);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            var tareas = JSON.parse(xhr.responseText);
            log(xhr.status, tareas);

            //https://stackoverflow.com/questions/8749236/create-table-with-jquery-append?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
            /* Note that the whole content variable is just a string */
            var content = '';
            tareas.forEach(function (element) {
                content += '<div class="card" style="margin-bottom:5px"><div class="modal-body">';
                content += '<div><div class="form-group-sm">';
                content += '<label for="descripcion' + element.id + '" class="font-weight-bold">Descripción: </label>';
                content += '<label id="descripcion' + element.id + '"> ' + element.descripcion + '</label>';
                content += '</div><div class="form-group-sm">';
                content += '<label for="fechaVencimiento' + element.id + '"class="font-weight-bold">Fecha de vencimiento: </label>';
                content += '<label id="fechaVencimiento' + element.id + '"> ' + element.fechaVencimiento + '</label>';
                content += '</div><div class="form-group-sm">';
                content += '<label for="Estado' + element.id + '"class="font-weight-bold">Finalizada: </label>';
                content += '<label id="Estado' + element.id + '">' + element.finalizada ? 'No' : 'Si' + '</label>';
                content += '</div></div></div>';
                content += '<div class="modal-footer">';
                content += '<button value="' + element.id + '" onclick="actualizarTarea(\'' + element.id + '\')" name="actualizarTarea" type="button" class="btn btn-primary">Actualizar</button>';
                content += '<button value="' + element.id + '" onclick="abrirModalBorrar(\'' + element.id + '\')" name="borrarTarea" type="button" class="btn btn-danger"> Borrar</button>';
                content += '</div></div>';
            });
            document.getElementById("divTareas").innerHTML = content;
            if (tareas.length == 0)
                document.getElementById("divTareas").innerHTML = "No hay tareas registradas";
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



function borrarTarea() {
    if (idBorrar != null) {
        call_delete_tarea(idBorrar);
    }
}


function abrirModalBorrar(id) {
    $("#modalBorrarTarea").modal("show");
    idBorrar = id;
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
            call_get_tareas(null);
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
            call_get_tareas(null);
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