/** @license
 | Version 10.1.1
 | Copyright 2012 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
dojo.provide("js.Config");
dojo.declare("js.Config", null, {

    // This file contains various configuration settings for "HTML5" template
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application title                  - [ Tag(s) to look for: ApplicationName ]
    // 2.  Set path for application icon              - [ Tag(s) to look for: ApplicationIcon ]
    // 3.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 4.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    //
    // 5.  Specify URLs for base maps                  - [ Tag(s) to look for: BaseMapLayers ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]
    //
    // 7.  Or for using map services:
    // 7a. Customize info-Window settings             - [ Tag(s) to look for: InfoWindowHeader, InfoPopupFieldsCollection ]
    // 7b. Customize info-Popup size                  - [ Tag(s) to look for: InfoPopupHeight, InfoPopupWidth ]
    // 7c. Customize data formatting                  - [ Tag(s) to look for: ShowNullValueAs]
    //
    // 8. Customize address search settings          - [ Tag(s) to look for: LocatorURL, LocatorNameFields, LocatorFields, LocatorDefaultAddress, LocatorMarkupSymbolPath, LocatorRippleSize ]
    //
    // 9. Set URL for geometry service               - [ Tag(s) to look for: GeometryService ]
    //
    // 10. Customize routing settings for directions  - [ Tag(s) to look for: RouteServiceURL, RouteColor, RouteWidth ]
    //
    // 11. Configure data to be displayed on the bottom panel
    //                                                - [ Tag(s) to look for: InfoBoxWidth, Services]
    //
    // 12. Customize the Zoom level, CallOutAddress, Render color, ripple size
    //                                                - [ Tag(s) to look for: ZoomLevel, CallOutAddress, RendererColor, RippleSize]
    //
    // 13. Specify URLs for map sharing               - [ Tag(s) to look for: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]
    // 13a.In case of changing the TinyURL service
    //     Specify URL for the new service            - [ Tag(s) to look for: FacebookShareURL, TwitterShareURL, ShareByMailLink ]
    //
    //

    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set application title.
    ApplicationName: "Planning Viewer",

    // Set application icon path.
    ApplicationIcon: "images/landuse.png",

    // Set splash window content - Message that appears when the application starts.
    SplashScreenMessage: "<b>Welcome to My Government Services</b><br/><hr/><br/>The <b>My Government Services</b> application helps residents locate a government facility and obtain information about curbside and dropoff services provided by a government agency.<br/> <br/>To locate a service, simply enter an address or activity in the search box, or use your current location.  Your location will then be highlighted on the map and relevant information about available curbside and dropoff services will be presented to the user.<br/><br/>",

    // Set URL of help page/portal.
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers.
    // Please note: All base maps need to use the same spatial reference. By default, on application start the first base map will be loaded
    'BaseMapLayers':[
        {"Key":"publicAccess", "ThumbnailSource":"images/imgPublicAccess.png", "Name":"Public Access", MapURL:"http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"},
        {"Key":"imageryHybrid", "ThumbnailSource":"images/imgImageryHybrid.png", "Name":"Imagery", MapURL:"http://gis.nola.gov:6080/arcgis/rest/services/Basemaps/Aerials2012/MapServer"}
    ],

    // Initial map extent. Use comma (,) to separate values and dont delete the last comma.
    'DefaultExtent':"-10042700, 3492300, -10015200, 3502900",

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-popup is a popup dialog that gets displayed on selecting a feature

    //Field for Displaying the features as info window header.
    InfoWindowHeader: "FacilitySitePoint.NAME",

    // Set the content to be displayed on the info-Popup. Define labels, field values, field types and field formats.
    InfoPopupFieldsCollection:
       [
            {
                DisplayText: "Name:",
                FieldName: "FacilitySitePoint.NAME"
            },
            {
                DisplayText: "Address:",
                FieldName: "FacilitySitePoint.FULLADDR"
            },
            {
                DisplayText: "Contact:",
                FieldName: "GovServiceInfo.CONTACT"
            },
            {
                DisplayText: "Phone:",
                FieldName: "GovServiceInfo.PHONE"
            },
            {
                DisplayText: "Email:",
                FieldName: "GovServiceInfo.EMAIL"
            },
            {
                DisplayText: "Days Open:",
                FieldName: "GovServiceInfo.OPERDAYS"
            },
            {
                DisplayText: "Hours of Operation:",
                FieldName: "GovServiceInfo.OPERHOURS"
            }

        ],

    // Set size of the info-Popup - select maximum height and width in pixels.
    InfoPopupHeight: 200,
    InfoPopupWidth: 300,

    // Set string value to be shown for null or blank values.
    ShowNullValueAs: "N/A",


    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set Locator service URL.
    LocatorURL: "http://gis.nola.gov/arcgis/rest/services/Composite/GeocodeServer",

    //Set locator name fields to search.
    LocatorNameFields: [{
        FieldName: 'Loc_name',
        FieldValues: ["RoadCenterline", "SiteAddressPoint","TaxParcel"]
    }],

    // Set Locator fields (fields to be used for searching).
    LocatorFields: "SingleLine",

    // Set default address to search.
    LocatorDefaultAddress: "",

    // Set pushpin image path.
    LocatorMarkupSymbolPath: "images/RedPushpin.png",

    // Set ripple size.
    LocatorRippleSize: 25,

    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set geometry service URL.
    GeometryService: "http://gis.nola.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer",

    // ------------------------------------------------------------------------------------------------------------------------
    // DRIVING DIRECTIONS SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for routing service (network analyst).
    RouteServiceURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/NetworkAnalysis/ESRI_Route_NA/NAServer/Route",

    // Set color for the route symbol.
    RouteColor: "#CC6633",

    // Set width of the route.
    RouteWidth: 4,

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR INFO-PODS ON THE BOTTOM PANEL
    // ------------------------------------------------------------------------------------------------------------------------
    // Set width of the boxes in the bottom panel.
    InfoBoxWidth: 417,

    //Operational layer collection.
    Services:
      {

          ConditionalUse:{
              Name: "Conditional Use",
              Image:"images/landuse.png",
              HasRendererImage:false,
              ServiceUrl:"http://50.17.213.29:6080/ArcGIS/rest/services/LGIM/GovernmentServices/MapServer/14",
              FieldNames:[
                  {Field: "<b>Zone Class:</b> ${ZONECLASS}"},
                  {Field: "<b>Zone Description:</b> ${ZONEDESC}"},
                  {Field: "<b>Last Updated:</b> ${LASTUPDATE}"},
                  { Links:
                      [
                          { DisplayText: "Website", FieldName: "HYPERLINK", type: "web" }
                      ]
                  }
             ],
              Color: "#FCD208",
              isRendererColor: true,
              LayerVisibility: true
          },

          Zoning:{
              Name: "Zoning",
              Image:"images/landuse.png",
              HasRendererImage:false,
              ServiceUrl:"http://50.17.213.29:6080/ArcGIS/rest/services/LGIM/GovernmentServices/MapServer/15",
              FieldNames:[
                  {Field: "<b>Zone Class:</b> ${ZONECLASS}"},
                  {Field: "<b>Zone Description:</b> ${ZONEDESC}"},
                  {Field: "<b>Last Updated:</b> ${LASTUPDATE}"},
                  { Links:
                      [
                          { DisplayText: "Website", FieldName: "HYPERLINK", type: "web"},
                      ]
                  }
              ],
           Color: "#FCD208",
           isRendererColor: true,
           LayerVisibility: true
          },
          ParcelInfo:{
              Name: "Parcel Info",
              Image:"images/taxparcel.png",
              HasRendererImage:false,
              ServiceUrl:"http://gis.nola.gov/arcgis/rest/services/LGIM/TaxParcelQuery/MapServer/0",
              FieldNames:[
                  {Field: "<b>Parcel ID:</b> ${PARCELID}"},
                  {Field: "<b>Site Address:</b> ${SITEADDRESS}"},
                  {Field: "<b>Square:</b> ${SQUARE}"},
                  {Field: "<b>Lot:</b> ${LOT}"},
                  {Field: "<b>Description:</b> ${PRPRTYDSCRP}"}

              ],
           Color: "#FCD208",
           isRendererColor: true,
           LayerVisibility: true
          },
          ParcelAssessorInfo:{
          Name: "Assessor Info",
          Image:"images/taxparcel.png",
          HasRendererImage:false,
          ServiceUrl:"http://gis.nola.gov/arcgis/rest/services/LGIM/TaxParcelQuery/MapServer/0",
          FieldNames:[
              {Field: "<b>Tax Bill ID:</b> <a target='_blank' href='http://qpublic4.qpublic.net/la_orleans_alsearch.php?BEGIN=0&searchType=tax_bill&tax_bill+Value=Submit+Query&INPUT=${TAXBILLID}'> ${TAXBILLID}</a>"},
              {Field: "<b>Assessed Value:</b> ${CNTASSDVAL}"},
              {Field: "<b>Land Value:</b> ${LNDVALUE}"}
          ],
          Color: "#FCD208",
          isRendererColor: true,
          LayerVisibility: true
      },
          ParcelOwnerInfo:{
              Name: "Owner Info",
              Image:"images/taxparcel.png",
              HasRendererImage:false,
              ServiceUrl:"http://gis.nola.gov/arcgis/rest/services/LGIM/TaxParcelQuery/MapServer/0",
              FieldNames:[
                  {Field: "<b>Owner:</b> ${OWNERNME1}"},
                  {Field: "<b>Postal Address:</b> ${PSTLADDRESS}"},
                  {Field: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                      "&nbsp;&nbsp;&nbsp;&nbsp; ${PSTLCITY}, ${PSTLSTATE} ${PSTLZIP5}"}
              ],
              Color: "#FCD208",
              isRendererColor: true,
              LayerVisibility: true
          }
      },

    //Set required zoom level.
    ZoomLevel: 15,

    //Address to be displayed on mobile callout.
    CallOutAddress: "Street: ${Address}",

    //Renderer color for selected feature.
    RendererColor: "#CC6633",

    //Set size of the ripple.
    RippleSize: 25,

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR MAP SHARING
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for TinyURL service, and URLs for social media.
    MapSharingOptions:
          {
              TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
              TinyURLResponseAttribute: "data.url",

              FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=My%20Government%20Services",
              TwitterShareURL: "http://twitter.com/home/?status=My%20Government%20Services ${0}",
              ShareByMailLink: "mailto:%20?subject=Checkout%20this%20map!&body=${0}"
          },

    Layers:
        [
            {
                Key: "taxparcels",
                Title: "Tax Parcels",
                ServiceURL: "http://gis.nola.gov/arcgis/rest/services/LGIM/TaxParcelQuery/MapServer/0",
                isVisible: false,
                isDynamicMapService: true,
                Fields:
                    [
                        {
                            DisplayText: "Parcel ID:",
                            FieldName: "${PARCELID}",
                            DataType: "string"
                        }

                    ]
            },{
            Key: "zoning",
            Title: "Zoning",
            ServiceURL: "http://50.17.213.29:6080/ArcGIS/rest/services/LGIM/GovernmentServices/MapServer/15",
            isVisible: false,
            isDynamicMapService: true,
            opacity:.5,
            Fields:
                [
                    {
                        DisplayText: "Zoning Description:",
                        FieldName: "${ZONEDESC}",
                        DataType: "string"
                    }

                ]
        },{
            Key: "conditionalUse",
            Title: "Conditional use",
            ServiceURL: "http://50.17.213.29:6080/ArcGIS/rest/services/LGIM/GovernmentServices/MapServer/14",
            isVisible: false,
            isDynamicMapService: true,
            opacity:.5,
            Fields:
                [
                    {
                        DisplayText: "Zoning Description:",
                        FieldName: "${ZONEDESC}",
                        DataType: "string"
                    }

                ]
        }

    ]
});
