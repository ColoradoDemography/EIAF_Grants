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
        title: "{County} County Grant Money 2012-2021",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "TOTAL",
                label: "All Grants",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CCPI",
                label: "Community Crime Prevention Initiative",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CDBGED",
                label: "Community Development Block Grants - Economic Development",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CDBGPF",
                label: "Community Development Block Grants - Public Facilities",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CHPG",
                label: "Colorado Heritage Planning Grants",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CSBG",
                label: "Community Service Block Grants",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CTF",
                label: "Conservation Trust Fund",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "CVRF",
                label: "Coronovirus Relief Fund",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "DCFA",
                label: "Defense Counsel on First Appearance",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "EIAF",
                label: "Energy and Mineral Impact Assistance Fund",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "FCB",
                label: "Firefighter Cardiac Benefit Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "GAME",
                label: "Local Government Limited Gaming Impact Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "GBMJ",
                label: "Gray and Black Market Marijuana Enforcement Grant",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "IHOP",
                label: "Innovative Housing Planning Grant Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "MJ",
                label: "Marijuana Impact Grant Programs",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "MS",
                label: "Main Street Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "MSOB",
                label: "Main Street Program: Open for Business",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "NEU",
                label: "American Rescue Plan",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "POMH",
                label: "Peace Officer Mental Health Support Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "REDI",
                label: "Rural Economic Development Initiative",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "RNSS",
                label: "RNSS",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "SAR",
                label: "Colorado Search and Rescue Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "SBR",
                label: "Small Business Relief Program",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "SEV_FML",
                label: "Direct Distribution",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              {
                fieldName: "VFP",
                label: "Volunteer Firefighter Pension",
                format: {
                  digitSeparator: true,
                  places: 0
                },
              },
              /* "<b>Community Crime Prevention Initiative:</b>  {CCPI}"+
              "<b>Community Development Block Grants - Economic Development:</b>  {CDBGED}<br>"+
              "<b>Community Development Block Grants - Public Facilities:</b>  {CDBGPF}<br>"+
              "<b>Colorado Heritage Planning Grants:</b>  {CHPG}<br>"+
              "<b>Community Service Block Grants:</b>  {CSBG}<br>"+
              "<b>Conservation Trust Fund:</b>  {CTF}<br>"+
              "<b>Coronovirus Relief Fund:</b>  {CVRF}<br>"+
              "<b>Defense Counsel on First Appearance:</b>  {DCFA}<br>"+
              "<b>Energy and Mineral Impact Assistance Fund:</b>  {EIAF}<br>"+
              "<b>Firefighter Cardiac Benefit Program:</b>  {FCB}<br>"+
              "<b>Local Government Limited Gaming Impact Program:</b>  {GAME}<br>"+
              "<b>Gray and Black Market Marijuana Enforcement Grant:</b>  {GBMJ}}<br>"+
              "<b>Innovative Housing Planning Grant Program:</b>  {IHOP}}<br>"+
              "<b>Marijuana Impact Grant Programs:</b>  {MJ}<br>"+
              "<b>Main Street Program:</b>  {MS}<br>"+
              "<b>Main Street: Open for Business:</b>  {MSOB}<br>"+
              "<b>American Rescue Plan:</b>  {NEU}<br>"+
              "<b>Peace Officer Mental Health Support Program:</b>  {POMH}<br>"+
              "<b>Rural Economic Development Initiative:</b>  {REDI}<br>"+
              "<b>RNSS:</b>  {RNSS}<br>"+
              "<b>Colorado Search and Rescue Program:</b>  {SAR}<br>"+
              "<b>Small Business Relief Program:</b>  {SBR}<br>"+
              "<b>Direct Distribution:</b>  {SEV_FML}<br>"+
              "<b>Volunteer Firefighter Pension:</b>  {VFP}<br>" */
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
        expression: "$feature.NAME + TextFormatting.NewLine + $feature.PovPct+'%'"
      }
    };
    
    var layer = new FeatureLayer({
        title: "Grants Per County 2012-2021 (Number in Label Percent below 200% of Poverty Level",
        url: "https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/Grants_Map_County/FeatureServer/0",
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
      expandTooltip: "Legend"
    });
    
    var print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
          "https://dola-online.maps.arcgis.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      });
    
    var expand2 = new Expand({
        view: view,
        content: print,
        expandIconClass: "esri-icon-printer",
        expandTooltip: "Print"
    })
    
    view.ui.add([expand2], "bottom-right");
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

          classSelect = document.getElementById("class-select");
          classSelect.addEventListener("change", generateRenderer);

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
          
         if (classSelect.value === "equal-interval") {
            normField = "Population";
            legTitle = "Dollars Per Capita"
          }else if(classSelect.value === "poverty"){
            normField = "PovPop";
            legTitle = "Dollars"
          }else if(classSelect.value === "bipoc"){
            normField = "BIPOC";
            legTitle = "Dollars"
          }          else{
            normField = "";
            legTitle = "Dollars"
          };
   
              const params = {
                layer: layer,
                //valueExpression: getValueExpression(fieldSelect.value/layer.Population),
                field: fieldSelect.value,
                view: view,
                classificationMethod: classMethod,
                normalizationField: normField,
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

    
