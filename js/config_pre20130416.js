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
    ApplicationName: "Planning and Zoning Lookup Tool",

    // Set application window title.
    ApplicationTitle: "Planning Viewer | City of New Orleans",

    // Set application icon path.
    ApplicationIcon: "images/fleur_90x90.png",
	
	// Show splash screen, true or false
	ShowSplashScreenMessage: false,
	
    // Set splash window content - Message that appears when the application starts.
    SplashScreenMessage: "<b>Disclaimer</b><br/><hr/><br/>This information is derived from the City of New Orleans Enterprise GIS Database. The data are not a survey-quality product and the end user assumes the risk of using this information. The City of New Orleans does not assume any liability for damages arising from errors, omissions, or use of this information. The City of New Orleans is not responsible for and does not warrant the published accuracy, date and currency, compilation methods, and cartographic format as described in the accompanying metadata, and end users are advised to utilize these data accordingly.<br/><br/>",

    // Set URL of help page/portal.
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers.
    // Please note: All base maps need to use the same spatial reference. By default, on application start the first base map will be loaded
    'BaseMapLayers':[
        {
			"Key":"streetMap", 
			"ThumbnailSource":"images/imgPublicAccess.png", 
			"Name":"Street Map", 
			MapURL:[
			"http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
			]
		},
        {
			"Key":"imageryHybrid", 
			"ThumbnailSource":"images/imgImageryHybrid.png", 
			"Name":"Imagery", 
			MapURL:[
				"http://gis.nola.gov/arcgis/rest/services/Basemaps/Aerials2012/MapServer",
				"http://gis.nola.gov/arcgis/rest/services/Basemaps/ImageryReferenceOverlay/MapServer"
				]
		}
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
    LocatorURL: "http://gis.nola.gov/arcgis/rest/services/CompositePIN/GeocodeServer",

    //Set locator name fields to search.
    LocatorNameFields: [{
        FieldName: 'Loc_name',
        FieldValues: [ "SiteAddressPoi","TaxParcel","RoadCenterline"]
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
	// Layers for PODs
    Services:
      {

          ConditionalUse:{
              Name: "Conditional Use/Exceptional Use/Planned Development",
              Image:"images/fleur_45x45.png",
              HasRendererImage:false,
              ServiceUrl:"http://gis.nola.gov/arcgis/rest/services/GovernmentServices/PlanningServices/MapServer/3",
              FieldNames:[
  				  {Field: "<span style='font-style:italic; color:#FF0'>A land-use that is allowed to operate subject to design and/or operational requirements thru a review and approval process.</span>"},
                  {Field: "<b class='strong'>Zoning Action Type:</b> ${ZONECLASS}"},
                  {Field: "<b class='strong'>Zone Description:</b> ${ZONEDESC}"},
				  {Field: "<b class='strong'>Zoning Docket Number:</b> ${ZONENUM}"},
				  {Field: "<b class='strong'>Zoning Docket Year:</b> ${ZONEYEAR}"},
				  {Field: "<b class='strong'>Ordinance Number:</b> ${ORDNUM}", Type: "Numeric"},
				  {Field: "<b class='strong'>Instrument Number:</b> ${RECNUM}"},
				  //{Field: "<b class='strong'>Zone Class 1:</b> ${ZONECLASS1}"},
                  //{Field: "<b class='strong'>Zone Num 1:</b> ${ZONENUM1}"},
				  //{Field: "<b class='strong'>Zone Year 1:</b> ${ZONEYEAR1}"},
				  //{Field: "<b class='strong'>Ordinance Number 1:</b> ${ORDNUM1}", Type: "Numeric"},
				  //{Field: "<b class='strong'>Zone Class 2:</b> ${ZONECLASS2}"},
                  //{Field: "<b class='strong'>Zone Num 2:</b> ${ZONENUM2}"},
				  //{Field: "<b class='strong'>Ordinance Number 2:</b> ${ORDNUM2}", Type: "Numeric"},
				  //{Field: "<b class='strong'>Zone Class 3:</b> ${ZONECLASS3}"},
                  //{Field: "<b class='strong'>Zone Num 3:</b> ${ZONENUM3}"},
				  //{Field: "<b class='strong'>Ordinance Number 3:</b> ${ORDNUM3}", Type: "Numeric"},
				  //{Field: "<b class='strong'>Zone Class 4:</b> ${ZONECLASS4}"},
                  //{Field: "<b class='strong'>Zone Num 4:</b> ${ZONENUM4}"},
				  //{Field: "<b class='strong'>Ordinance Number 4:</b> ${ORDNUM4}", Type: "Numeric"},
                  //{Field: "<b class='strong'>Last Updated:</b> ${LASTUPDATE}", Type: "Date"},
{Field: "<span style='font-style:italic; color:#FF0'>Some ordinances may be found by accessing <a href='${HYPERLINK}' target='_blank'>Municode.</a>  All ordinances are available from the Clerk of Council’s office in City Hall.</span>"}//,
//{Field: "<a href='${HYPERLINK}' target='_blank'>Visit this website for additional information</a>"}

             ],
              Color: "#FCD208",
              isRendererColor: true,
              LayerVisibility: true
          },

          Zoning:{
              Name: "Zoning",
              Image:"images/fleur_45x45.png",
              HasRendererImage:false,
              ServiceUrl:"http://gis.nola.gov/arcgis/rest/services/GovernmentServices/PlanningServices/MapServer/4",
              FieldNames:[
			  
                  {Field: "<b class='strong'>Zoning District:</b> ${ZONECLASS}"},
                  {Field: "<b class='strong'>Zoning Description:</b> ${ZONEDESC}"},
                  {Field: "<b class='strong'>Last Updated:</b> ${LASTUPDATE}", Type: "Date"},
				  {Field: "<a href='${HYPERLINK}' target='_blank'>Visit the City Planning Commission's website for Zoning ordinance articles</a>"}
              ],
           Color: "#FCD208",
           isRendererColor: true,
           LayerVisibility: true
          }
      },

    //Set required zoom level.
    ZoomLevel: 20,

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

              FacebookShareURL: "http://www.facebook.com/sharer.php?u=${0}&t=Planning%20Viewer",
              TwitterShareURL: "http://twitter.com/home/?status=Planning%20Viewer ${0}",
              ShareByMailLink: "mailto:%20?subject=Checkout%20this%20map!&body=${0}"
          },
	// Operational layers in layer drop down 
	/* EXAMPLE:
	{
                Key: "xxxxxxxx",  - Must me a unique key value!  Otherwise the app will not render correctly
                Title: "Parcels", - Name to display in layer drop down
                ServiceURL: "http://gis.nola.gov/arcgis/rest/services/GovernmentServices/LandBaseServices/MapServer/0",
                isVisible: false,  - true or false
                isDynamicMapService: true, - true or false
				opacity:.75, - between 0 (totally transparent) and 1 (totally opaque)
                Fields:[ ] - leave blank
            },
	*/
    Layers:
        [
            /*
			{
                Key: "parcels",
                Title: "Parcels",
                ServiceURL: "http://gis.nola.gov/arcgis/rest/services/GovernmentServices/LandBaseServices/MapServer/0",
                isVisible: false,
                isDynamicMapService: true,
				opacity:.75,
                Fields:[ ]
            },
			*/
			{
				Key: "lot",
				Title: "Lot",
				ServiceURL: "http://gis.nola.gov/arcgis/rest/services/GovernmentServices/LandBaseServices/MapServer/1",
				isVisible: false,
				isDynamicMapService: true,
				opacity:.75,
				Fields: []
			},{
				Key: "square",
				Title: "Square",
				ServiceURL: "http://gis.nola.gov/arcgis/rest/services/GovernmentServices/LandBaseServices/MapServer/2",
				isVisible: false,
				isDynamicMapService: true,
				opacity:.75,
				Fields: []
			},{
				Key: "zoning",
				Title: "Zoning",
				ServiceURL: "http://gis.nola.gov/arcgis/rest/services/GovernmentServices/PlanningServices/MapServer/4",
				isVisible: false,
				isDynamicMapService: true,
				opacity:.35,
				Fields:[]
			},{
				Key: "conditionalUse",
				Title: "CU/EU/Planned Dev",
				ServiceURL: "http://gis.nola.gov/arcgis/rest/services/GovernmentServices/PlanningServices/MapServer/3",
				isVisible: false,
				isDynamicMapService: true,
				opacity:1,
				Fields:[]
			}

    ]
});
