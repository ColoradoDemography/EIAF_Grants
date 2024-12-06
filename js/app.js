require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/smartMapping/renderers/color",
        "esri/smartMapping/statistics/histogram",
        "esri/widgets/smartMapping/ClassedColorSlider",
        "esri/widgets/Legend",
        "esri/core/watchUtils",
        "esri/renderers/support/ClassBreakInfo",
        "esri/Basemap",
        "esri/layers/VectorTileLayer",
        "esri/widgets/Print",
        "esri/widgets/Expand"
      ], function (
        Map,
        MapView,
        FeatureLayer,
        colorRendererCreator,
        histogram,
        ClassedColorSlider,
        Legend,
        watchUtils,
        ClassBreakInfo,
        Basemap,
        VectorTileLayer,
        Print,
        Expand
      ) {
    
    let fieldSelect, classSelect, numClassesInput, slider;
    
     var popupQCEW = {
        title: "{NAME10} County Grant Money 2018-2024",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "EIAFTotal",
                label: "Energy and Mineral Impact Assistance Fund Dollars",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "Population",
                label: "Population",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "EIAFPerCap",
                label: "EIAF Dollars Per Person",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "EIAF_Count",
                label: "Number of EIAF Awards",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              /* "<b>Energy and Mineral Impact Assistance Fund Dollars:</b>  {EIAFTotal}<br>"+
              "<b>Population:</b>  {Population}<br>"+
              "<b>EIAF Dollars Per Person:</b>  {EIAFPerCap}<br>"+
              "<b>EIAF Awards:</b>  {EIAF_Total}}<br>" */
            ]
          }
        ]
      };
        
    const labelClass = {
      // autocasts as new LabelClass()
      symbol: {
        type: "text",  // autocasts as new TextSymbol()
        color: "black",
        font: {  // autocast as new Font()
          family: "Playfair Display",
          size: 8,
          weight: "bold"
        }
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.NAME10"
      }
    };
    
    var layer = new FeatureLayer({
        title: "EIAF Awards Per County 2018-2024",
        url: "https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/EIAF_County/FeatureServer/0",
        popupTemplate: popupQCEW,
        labelingInfo: [labelClass]
    });
    
    var basemap = new Basemap({
        baseLayers: [
            new VectorTileLayer({
                portalItem: {
                    id: "3137a21172d841d0b9cb1383a407662c"
                }
            })
        ]
    })
    
    var map = new Map({
      basemap: basemap
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-105.8, 39.202], // longitude, latitude
      zoom: 6
    });
    
    //view.ui.move("zoom", "bottom-right");
    
    var legend = new Legend({
        view: view
    })
    
    var expand1 = new Expand({
      view: view,
      content: legend,
      expandIconClass: "esri-icon-documentation",
      expandTooltip: "Legend",
      expanded: true
    });
    
    
    
    var expand2 = new Expand({
        view: view,
        content: print,
        expandIconClass: "esri-icon-printer",
        expandTooltip: "Print"
    })
    
    //view.ui.add([expand2], "bottom-right");
   // view.ui.add([expand2], "bottom-right");
    
    /*view.ui.add(
          new Legend({
            view: view
          }),
          "bottom-left"
    );*/
    
              
    /*view.when(function () {
          var print = new Print({
            view: view,
            // specify your own print service
            printServiceUrl:
              "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
          });

          // Add widget to the top right corner of the view
          view.ui.add(print, "top-right");
        });
*/
    view.ui.add("infoDiv", "top-right");view.ui.add([expand1], "top-right");

        // Generate a new renderer each time the user changes an input parameter
        view.when().then(function () {
          fieldSelect = document.getElementById("field-select");
          fieldSelect.addEventListener("change", generateRenderer);

          /* classSelect = document.getElementById("class-select");
          classSelect.addEventListener("change", generateRenderer);
 */
          /* numClassesInput = document.getElementById("num-classes");
          numClassesInput.addEventListener("change", generateRenderer); */

          watchUtils.whenFalseOnce(view, "updating", generateRenderer);
        });

        // Generate rounded arcade expression when user
        // selects a field name
        function getValueExpression(field) {
          return (
            "Round( ( $feature." + field + " / 1 ), 1)"
          );
        }

        function generateRenderer() { 
          const fieldLabel =
            fieldSelect.options[fieldSelect.selectedIndex].text;
          // default to natural-breaks when manual is selected for classification method
          const classMethod ="natural-breaks";
          
         if (fieldSelect.value === "EIAFPerCap") {
            //normField = "EIAFPerCap";
            legTitle = "Dollars Per Capita"
          }else if(fieldSelect.value === "EIAF_Count"){
            //normField = "EIAF_Count";
            legTitle = "Awards"
          }else if(fieldSelect.value === "EIAFTotal"){
            //normField = "BIPOC";
            legTitle = "Total Dollars"
          }          else{
            //normField = "EIAFTotal";
            legTitle = "Dollars"
          };
   
              const params = {
                layer: layer,
                //valueExpression: getValueExpression(fieldSelect.value/layer.Population),
                field: fieldSelect.value,
                view: view,
                classificationMethod: classMethod,
                //normalizationField: normField,
                numClasses: 6,
                defaultLabel: "0",
                legendOptions: {
                  title: legTitle,
                },
                colorScheme: {
                  id: "above-and-below/gray/div-blue-red",
                  colors: [[255,0,0],[255,127,127],[255,255,255],[127,127,255],[0,0,255]],
                  noDataColor: [200,200,200],
                  colorsForClassBreaks: [
                    {
                      colors: [[255,0,0]],
                      numClasses: 1
                    }, {
                      colors: [[255,0,0],[255,255,255]],
                      numClasses: 2
                    }, {
                      colors: [[123,204,196],[67,162,202],[8,104,172]],
                      numClasses: 3
                    }, {
                      colors: [[168,221,181],[123,204,196],[67,162,202],[8,104,172]],
                      numClasses: 4
                    }, {
                      colors: [[204,235,197],[168,221,181],[123,204,196],[67,162,202],[8,104,172]],
                      numClasses: 5
                    }, {
                      colors: [[240,249,232],[204,235,197],[168,221,181],[123,204,196],[67,162,202],[8,104,172]],
                      numClasses: 6
                    }, {
                      colors: [[255,0,0],[255,85,85],[255,170,170],[255,255,255],[170,170,255],[85,85,255],[0,0,255]],
                      numClasses: 7
                    }, {
                      colors: [[255,0,0],[255,63,63],[255,127,127],[255,191,191],[255,255,255],[170,170,255],[85,85,255],[0,0,255]],
                      numClasses: 8
                    }, {
                      colors: [[255,0,0],[255,63,63],[255,127,127],[255,191,191],[255,255,255],[191,191,255],[127,127,255],[63,63,255],[0,0,255]],
                      numClasses: 9
                    }, {
                      colors: [[255,0,0],[255,63,63],[255,127,127],[255,191,191],[255,255,255],[204,204,255],[153,153,255],[102,102,255],[51,51,255],[0,0,255]],
                      numClasses: 10
                    }, {
                      colors: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],
                      numClasses: 11
                    }
                  ],
                  outline: {
                    color: {r: 0, g: 0, b: 0, a: 0.25},
                    width: "1px"
                  },
                  opacity: 0.8
                }

              };
        

          // generate the renderer and set it on the layer
          colorRendererCreator
            .createClassBreaksRenderer(params)
            .then(function (rendererResponse) {
              layer.renderer = rendererResponse.renderer;
              layer.renderer.defaultLabel = "0";
              if (!map.layers.includes(layer)) {
                map.add(layer);
              }

            });

          }
});

    
