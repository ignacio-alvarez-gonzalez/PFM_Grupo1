require([
    "esri/map",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Search",
    "esri/dijit/Scalebar",
    "esri/layers/FeatureLayer",
    "esri/tasks/FeatureSet",

    "esri/tasks/query",
    "esri/tasks/ServiceAreaTask",
    "esri/tasks/ServiceAreaParameters",

    "esri/geometry/Point",
    "esri/toolbars/draw",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/graphic", 
    "esri/Color",

    "dojo/ready",
    "dojo/parser",
    "dojo/on",
    "dojo/_base/array",
], function(
    Map,
    BasemapToggle,
    Search,
    Scalebar,
    FeatureLayer,
    FeatureSet,

    Query,
    ServiceAreaTask,
    ServiceAreaParameters,

    Point,
    Draw,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Graphic,
    Color,

    ready,
    parser,
    on,
    arrayUtils,
){

    ready(function(){

        parser.parse();

        var miMapa = new Map("mapaPrincipal", {
            basemap: "hybrid",
            center: [2.16, 41.38],
            zoom: 9
        });

        miMapa.on("click", function(evento){

            miMapa.graphics.clear();

            var miSimbolo = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_SQUARE, 
                10,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1),
                new Color([0,0,0])
            );

            var miPunto = new Point(evento.mapPoint.x, evento.mapPoint.y, miMapa.spatialReference);

            var ubicacion = new Graphic(miPunto, miSimbolo);
            miMapa.graphics.add(ubicacion);       

            var entidades = [];
            entidades.push(ubicacion);

            var ubicaciones = new FeatureSet();
            ubicaciones.features = entidades

            console.log(ubicaciones);

            tareaAreaDeServicio = new ServiceAreaTask("https://localhost:6443/arcgis/rest/services/PFM/20210315_pruebaPublicarServiciosRutas/NAServer/Service%20Area");

            parametrosAreaDeServicio = new ServiceAreaParameters();

            parametrosAreaDeServicio.facilities = ubicaciones;
            parametrosAreaDeServicio.defaultBreaks = [100, 200, 300];
            parametrosAreaDeServicio.outSpatialReference = miMapa.spatialReference;
            parametrosAreaDeServicio.returnFacilities = false;
            parametrosAreaDeServicio.impedanceAttribute = "Length"

            // parametrosAreaDeServicio.travelMode = {
            //     "name": "Tiempo en coche",
            //     "id": "1",
            //     "type": "AUTOMOBILE",
            //     "description": "Este modo de viaje tiene en cuenta el tiempo en coche como impedancia para calcular la ruta",
            //     "timeAttributeName": "Tiempo_coche",
            //     "distanceAttributeName": "Length",
            //     "impedanceAttributeName": "Tiempo_coche",
            //     "restrictionAttributeNames": [
                 
            //     ],
            //     "attributeParameterValues": [
            //      {
            //       "attributeName": "ProhibidoCiclomotor",
            //       "parameterName": "Restriction Usage",
            //       "value": "Prohibited"
            //      },
            //      {
            //       "attributeName": "ProhibidoCoches",
            //       "parameterName": "Restriction Usage",
            //       "value": "Prohibited"
            //      }
            //     ],
            //     "useHierarchy": false,
            //     "uturnAtJunctions": "esriNFSBAtDeadEndsAndIntersections",
            //     "simplificationTolerance": null,
            //     "simplificationToleranceUnits": "esriMeters"
            // };

            console.log("parametrosAreaDeServicio", parametrosAreaDeServicio);

            tareaAreaDeServicio.solve(parametrosAreaDeServicio, function(resultado){

                console.log("resultados:", resultado);
                
                var simboloPoligono = new SimpleFillSymbol(
                    "solid",  
                    new SimpleLineSymbol("solid", new Color([255,255,255]), 1),
                    new Color([255,0,0,0.25])
                );
                
                dojo.forEach(resultado.serviceAreaPolygons,function(areaServicio){

                    console.log("Añadiendo area de servicio")

                    areaServicio.setSymbol(simboloPoligono);
                    miMapa.graphics.add(areaServicio);

                });
                
                }, function(err){
                console.log(err.message);
                });

        });

    });

});