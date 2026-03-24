port module Main exposing (..)

import Browser
import File exposing (File)
import File.Download
import File.Select as Select
import Html exposing (Html, a, button, canvas, div, h1, h2, h3, img, input, label, option, p, select, span, text)
import Html.Attributes exposing (attribute, class, disabled, for, href, id, max, min, placeholder, rel, selected, src, step, style, target, type_, value)
import Html.Events exposing (on, onClick, onInput)
import I18n exposing (Language(..), TranslationKey, translate)
import Json.Decode
import Process
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Task



-- SVG ICON HELPERS


svgIcon : List (Html.Attribute msg) -> List (Svg msg) -> Html msg
svgIcon extraAttrs children =
    Svg.svg
        ([ SvgAttr.viewBox "0 0 20 20"
         , SvgAttr.width "20"
         , SvgAttr.height "20"
         , SvgAttr.fill "none"
         , SvgAttr.stroke "currentColor"
         , SvgAttr.strokeWidth "1.5"
         , attribute "aria-hidden" "true"
         , SvgAttr.style "display:inline-block;vertical-align:middle"
         ]
            ++ extraAttrs
        )
        children


iconFrogSized : String -> Html Msg
iconFrogSized size =
    svgIcon [ SvgAttr.width size, SvgAttr.height size ]
        [ Svg.circle [ SvgAttr.cx "6", SvgAttr.cy "6", SvgAttr.r "3" ] []
        , Svg.circle [ SvgAttr.cx "14", SvgAttr.cy "6", SvgAttr.r "3" ] []
        , Svg.circle [ SvgAttr.cx "6", SvgAttr.cy "6", SvgAttr.r "1", SvgAttr.fill "currentColor" ] []
        , Svg.circle [ SvgAttr.cx "14", SvgAttr.cy "6", SvgAttr.r "1", SvgAttr.fill "currentColor" ] []
        , Svg.path [ SvgAttr.d "M4 12 Q10 18 16 12", SvgAttr.strokeLinecap "round" ] []
        , Svg.line [ SvgAttr.x1 "0", SvgAttr.y1 "10", SvgAttr.x2 "20", SvgAttr.y2 "10", SvgAttr.opacity "0.6" ] []
        , Svg.line [ SvgAttr.x1 "10", SvgAttr.y1 "0", SvgAttr.x2 "10", SvgAttr.y2 "20", SvgAttr.opacity "0.6" ] []
        ]


iconFrog : Html Msg
iconFrog =
    iconFrogSized "20"


iconFrogLarge : Html Msg
iconFrogLarge =
    iconFrogSized "48"


iconUpload : Html Msg
iconUpload =
    svgIcon []
        [ Svg.path [ SvgAttr.d "M10 3 L10 13", SvgAttr.strokeLinecap "round" ] []
        , Svg.path [ SvgAttr.d "M6 7 L10 3 L14 7", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        , Svg.path [ SvgAttr.d "M3 12 L3 16 Q3 17 4 17 L16 17 Q17 17 17 16 L17 12", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        ]


iconDownload : Html Msg
iconDownload =
    svgIcon []
        [ Svg.line [ SvgAttr.x1 "10", SvgAttr.y1 "3", SvgAttr.x2 "10", SvgAttr.y2 "13" ] []
        , Svg.polyline [ SvgAttr.points "6,10 10,14 14,10" ] []
        , Svg.line [ SvgAttr.x1 "4", SvgAttr.y1 "17", SvgAttr.x2 "16", SvgAttr.y2 "17" ] []
        ]


iconHeart : Html Msg
iconHeart =
    svgIcon []
        [ Svg.path [ SvgAttr.d "M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z" ] [] ]


iconGlobe : Html Msg
iconGlobe =
    svgIcon []
        [ Svg.circle [ SvgAttr.cx "10", SvgAttr.cy "10", SvgAttr.r "8" ] []
        , Svg.ellipse [ SvgAttr.cx "10", SvgAttr.cy "10", SvgAttr.rx "4", SvgAttr.ry "8" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "10", SvgAttr.x2 "18", SvgAttr.y2 "10" ] []
        ]


iconLock : Html Msg
iconLock =
    svgIcon []
        [ Svg.rect [ SvgAttr.x "4", SvgAttr.y "9", SvgAttr.width "12", SvgAttr.height "9", SvgAttr.rx "2" ] []
        , Svg.path [ SvgAttr.d "M7 9 V6 Q7 2 10 2 Q13 2 13 6 V9" ] []
        , Svg.circle [ SvgAttr.cx "10", SvgAttr.cy "14", SvgAttr.r "1.5", SvgAttr.fill "currentColor" ] []
        ]


iconGrid : Html Msg
iconGrid =
    svgIcon []
        [ Svg.rect [ SvgAttr.x "2", SvgAttr.y "2", SvgAttr.width "16", SvgAttr.height "16" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "7", SvgAttr.x2 "18", SvgAttr.y2 "7" ] []
        , Svg.line [ SvgAttr.x1 "2", SvgAttr.y1 "13", SvgAttr.x2 "18", SvgAttr.y2 "13" ] []
        , Svg.line [ SvgAttr.x1 "7", SvgAttr.y1 "2", SvgAttr.x2 "7", SvgAttr.y2 "18" ] []
        , Svg.line [ SvgAttr.x1 "13", SvgAttr.y1 "2", SvgAttr.x2 "13", SvgAttr.y2 "18" ] []
        ]


iconCheck : Html Msg
iconCheck =
    svgIcon []
        [ Svg.polyline [ SvgAttr.points "4,10 8,15 16,5", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] [] ]


iconClose : Html Msg
iconClose =
    svgIcon []
        [ Svg.line [ SvgAttr.x1 "4", SvgAttr.y1 "4", SvgAttr.x2 "16", SvgAttr.y2 "16" ] []
        , Svg.line [ SvgAttr.x1 "16", SvgAttr.y1 "4", SvgAttr.x2 "4", SvgAttr.y2 "16" ] []
        ]


iconShare : Html Msg
iconShare =
    svgIcon []
        [ Svg.path [ SvgAttr.d "M4 12 V16 Q4 17 5 17 L15 17 Q16 17 16 16 L16 12", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        , Svg.path [ SvgAttr.d "M10 3 L10 12", SvgAttr.strokeLinecap "round" ] []
        , Svg.path [ SvgAttr.d "M7 6 L10 3 L13 6", SvgAttr.strokeLinecap "round", SvgAttr.strokeLinejoin "round" ] []
        ]


iconGreenHeart : Html Msg
iconGreenHeart =
    svgIcon [ SvgAttr.fill "currentColor", SvgAttr.stroke "none" ]
        [ Svg.path [ SvgAttr.d "M10 17 C4 12 1 8 4 5 Q7 2 10 6 Q13 2 16 5 C19 8 16 12 10 17 Z" ] [] ]



-- MODEL


type alias Model =
    { uploadedImage : Maybe String
    , gridSize : Int
    , niceCounter : Int
    , imageWidth : Maybe Int
    , imageHeight : Maybe Int
    , gridColor : String
    , gridThickness : Int
    , gridOpacity : Float
    , language : Language
    , downloadSuccess : Bool
    , showDiagonals : Bool
    , showGrid : Bool
    , isProcessing : Bool
    , imageName : String
    , canShare : Bool
    , shareAfterProcess : Bool
    }



-- MESSAGES


type Msg
    = PickImage
    | ImageSelected File
    | ImageLoaded String
    | GridSizeChanged Int
    | NiceButtonClicked
    | ImageSizeLoaded Int Int
    | DownloadClicked
    | GriddedReady String
    | GridColorChanged String
    | GridThicknessChanged Int
    | GridOpacityChanged Float
    | LanguageChanged Language
    | ResetDownloadSuccess
    | ToggleDiagonals Bool
    | ToggleGridView
    | ProcessingStarted
    | ImageNameSet String
    | SettingsLoaded { gridSize : Int, gridColor : String, gridThickness : Int, gridOpacity : Float, showDiagonals : Bool }
    | ResetProcessing
    | BrowserLanguageReceived String
    | ResetToUpload
    | ShareClicked
    | ShareSupportReceived Bool



-- GRID HELPER TYPES AND FUNCTIONS


-- Grid configuration type for helper functions
type alias GridConfig =
    { gridSize : Int
    , gridColor : String
    , gridThickness : Int
    , gridOpacity : Float
    , showDiagonals : Bool
    }

type alias Dimensions =
    { width : Int
    , height : Int
    }

-- Helper function to create grid config from Model
gridConfigFromModel : Model -> GridConfig
gridConfigFromModel model =
    { gridSize = model.gridSize
    , gridColor = model.gridColor
    , gridThickness = model.gridThickness
    , gridOpacity = model.gridOpacity
    , showDiagonals = model.showDiagonals
    }

-- Create SVG line with grid attributes
svgLine : GridConfig -> Float -> Float -> Float -> Float -> Svg msg
svgLine config x1 y1 x2 y2 =
    Svg.line
        [ SvgAttr.x1 (String.fromFloat x1)
        , SvgAttr.y1 (String.fromFloat y1)
        , SvgAttr.x2 (String.fromFloat x2)
        , SvgAttr.y2 (String.fromFloat y2)
        , SvgAttr.stroke config.gridColor
        , SvgAttr.strokeWidth (String.fromInt config.gridThickness)
        , SvgAttr.opacity (String.fromFloat config.gridOpacity)
        ]
        []

-- Generate all grid lines (vertical, horizontal, and optionally diagonal)
allGridLines : GridConfig -> Dimensions -> List (Svg msg)
allGridLines config dims =
    let
        cellWidth = toFloat dims.width / toFloat config.gridSize
        cellHeight = toFloat dims.height / toFloat config.gridSize

        verticalLines =
            List.range 0 config.gridSize
                |> List.map (\i -> svgLine config (toFloat i * cellWidth) 0 (toFloat i * cellWidth) (toFloat dims.height))

        horizontalLines =
            List.range 0 config.gridSize
                |> List.map (\i -> svgLine config 0 (toFloat i * cellHeight) (toFloat dims.width) (toFloat i * cellHeight))

        diagonal1 =
            if config.showDiagonals then
                List.range 0 (config.gridSize * 2)
                    |> List.map (\i -> svgLine config (toFloat i * cellWidth) 0 0 (toFloat i * cellHeight))
            else
                []

        diagonal2 =
            if config.showDiagonals then
                List.range 0 (config.gridSize * 2)
                    |> List.map (\i -> svgLine config (toFloat (config.gridSize - i) * cellWidth) 0 (toFloat dims.width) (toFloat i * cellHeight))
            else
                []
    in
    verticalLines ++ horizontalLines ++ diagonal1 ++ diagonal2



port requestPng : { url : String, width : Int, height : Int, grid : Int, color : String, thickness : Int, opacity : Float, showDiagonals : Bool } -> Cmd msg


port receivePng : (String -> msg) -> Sub msg


port downloadImage : { dataUrl : String, fileName : String } -> Cmd msg


port setHtmlLang : String -> Cmd msg


port setHtmlDir : String -> Cmd msg


port saveSettings : { gridSize : Int, gridColor : String, gridThickness : Int, gridOpacity : Float, showDiagonals : Bool } -> Cmd msg


port loadSettings : ({ gridSize : Int, gridColor : String, gridThickness : Int, gridOpacity : Float, showDiagonals : Bool } -> msg) -> Sub msg


port resetProcessing : (() -> msg) -> Sub msg


port getBrowserLanguage : (String -> msg) -> Sub msg


port shareImageData : { dataUrl : String, fileName : String } -> Cmd msg


port receiveShareSupport : (Bool -> msg) -> Sub msg



-- INITIAL STATE


init : () -> ( Model, Cmd Msg )
init _ =
    ( { uploadedImage = Nothing
      , gridSize = 10
      , niceCounter = 0
      , imageWidth = Nothing
      , imageHeight = Nothing
      , gridColor = "#80ED99"
      , gridThickness = 1
      , gridOpacity = 1
      , language = Spanish
      , downloadSuccess = False
      , showDiagonals = False
      , showGrid = True
      , isProcessing = False
      , imageName = "image"
      , canShare = False
      , shareAfterProcess = False
      }
    , Cmd.none
    )



-- HELPERS


settingsFromModel : Model -> { gridSize : Int, gridColor : String, gridThickness : Int, gridOpacity : Float, showDiagonals : Bool }
settingsFromModel m =
    { gridSize = m.gridSize, gridColor = m.gridColor, gridThickness = m.gridThickness, gridOpacity = m.gridOpacity, showDiagonals = m.showDiagonals }


triggerProcessing : Bool -> Model -> ( Model, Cmd Msg )
triggerProcessing shareAfterProcess model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just w, Just h ) ->
            ( { model | isProcessing = True, shareAfterProcess = shareAfterProcess }
            , requestPng { url = url, width = w, height = h, grid = model.gridSize, color = model.gridColor, thickness = model.gridThickness, opacity = model.gridOpacity, showDiagonals = model.showDiagonals }
            )

        _ ->
            ( model, Cmd.none )


type alias LanguageInfo =
    { code : String
    , id : String
    , displayName : String
    , dir : String
    }


languageMeta : Language -> LanguageInfo
languageMeta language =
    case language of
        English ->
            { code = "en", id = "english", displayName = "English", dir = "ltr" }

        Spanish ->
            { code = "es", id = "spanish", displayName = "Español", dir = "ltr" }

        Latin ->
            { code = "la", id = "latin", displayName = "Latin", dir = "ltr" }

        Italian ->
            { code = "it", id = "italian", displayName = "Italiano", dir = "ltr" }

        Portuguese ->
            { code = "pt", id = "portuguese", displayName = "Português", dir = "ltr" }

        French ->
            { code = "fr", id = "french", displayName = "Français", dir = "ltr" }

        Asturiano ->
            { code = "ast", id = "asturiano", displayName = "Asturianu", dir = "ltr" }

        Gaelic ->
            { code = "gd", id = "gaelic", displayName = "Gàidhlig", dir = "ltr" }

        Euskara ->
            { code = "eu", id = "euskara", displayName = "Euskara", dir = "ltr" }

        Japanese ->
            { code = "ja", id = "japanese", displayName = "日本語", dir = "ltr" }

        Russian ->
            { code = "ru", id = "russian", displayName = "Русский", dir = "ltr" }

        Tuvan ->
            { code = "tyv", id = "tuvan", displayName = "Тыва дыл", dir = "ltr" }

        Amharic ->
            { code = "am", id = "amharic", displayName = "አማርኛ", dir = "ltr" }

        Hebrew ->
            { code = "he", id = "hebrew", displayName = "עברית", dir = "rtl" }


isValidHexColor : String -> Bool
isValidHexColor s =
    String.length s == 7
        && String.startsWith "#" s
        && String.all Char.isHexDigit (String.dropLeft 1 s)



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickImage ->
            ( model, Select.file [ "image/*" ] ImageSelected )

        ImageSelected file ->
            ( { model | imageName = File.name file }
            , Task.perform ImageLoaded (File.toUrl file)
            )

        ImageLoaded url ->
            ( { model | uploadedImage = Just url, imageWidth = Nothing, imageHeight = Nothing }, Cmd.none )

        GridSizeChanged size ->
            let
                newModel = { model | gridSize = size }
            in
            ( newModel, saveSettings (settingsFromModel newModel) )

        GridColorChanged color ->
            if isValidHexColor color then
                let
                    newModel = { model | gridColor = color }
                in
                ( newModel, saveSettings (settingsFromModel newModel) )
            else
                ( model, Cmd.none )

        GridThicknessChanged thickness ->
            let
                newModel = { model | gridThickness = thickness }
            in
            ( newModel, saveSettings (settingsFromModel newModel) )

        GridOpacityChanged opacity ->
            let
                newModel = { model | gridOpacity = opacity }
            in
            ( newModel, saveSettings (settingsFromModel newModel) )

        NiceButtonClicked ->
            ( { model | niceCounter = model.niceCounter + 1 }, Cmd.none )

        ImageSizeLoaded width height ->
            ( { model | imageWidth = Just width, imageHeight = Just height }, Cmd.none )

        LanguageChanged newLanguage ->
            let
                meta = languageMeta newLanguage
            in
            ( { model | language = newLanguage }
            , Cmd.batch [ setHtmlLang meta.code, setHtmlDir meta.dir ]
            )

        ResetDownloadSuccess ->
            ( { model | downloadSuccess = False }, Cmd.none )

        ToggleDiagonals value ->
            let
                newModel = { model | showDiagonals = value }
            in
            ( newModel, saveSettings (settingsFromModel newModel) )

        ToggleGridView ->
            ( { model | showGrid = not model.showGrid }, Cmd.none )

        ProcessingStarted ->
            ( { model | isProcessing = True }, Cmd.none )

        ImageNameSet name ->
            ( { model | imageName = name }, Cmd.none )

        SettingsLoaded settings ->
            ( { model | gridSize = settings.gridSize, gridColor = settings.gridColor, gridThickness = settings.gridThickness, gridOpacity = settings.gridOpacity, showDiagonals = settings.showDiagonals }, Cmd.none )

        ResetProcessing ->
            ( { model | isProcessing = False }, Cmd.none )

        BrowserLanguageReceived langCode ->
            let
                detectedLanguage =
                    allLanguages
                        |> List.filter (\lang -> String.startsWith (languageMeta lang).code langCode)
                        |> List.head
                        |> Maybe.withDefault Spanish

                meta = languageMeta detectedLanguage
            in
            ( { model | language = detectedLanguage }
            , Cmd.batch [ setHtmlLang meta.code, setHtmlDir meta.dir ]
            )

        DownloadClicked ->
            triggerProcessing False model

        ShareClicked ->
            triggerProcessing True model

        GriddedReady dataUrl ->
            let
                fileName = model.imageName ++ "-gridded.png"
                action =
                    if model.shareAfterProcess then
                        shareImageData { dataUrl = dataUrl, fileName = fileName }
                    else
                        downloadImage { dataUrl = dataUrl, fileName = fileName }
            in
            ( { model | downloadSuccess = True, isProcessing = False, shareAfterProcess = False }
            , Cmd.batch
                [ action
                , Task.perform (\_ -> ResetDownloadSuccess) (Process.sleep 2000)
                ]
            )

        ResetToUpload ->
            ( { model
                | uploadedImage = Nothing
                , imageWidth = Nothing
                , imageHeight = Nothing
                , isProcessing = False
                , downloadSuccess = False
                , shareAfterProcess = False
              }
            , Cmd.none
            )

        ShareSupportReceived supported ->
            ( { model | canShare = supported }, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ receivePng GriddedReady
        , loadSettings SettingsLoaded
        , resetProcessing (\_ -> ResetProcessing)
        , getBrowserLanguage BrowserLanguageReceived
        , receiveShareSupport ShareSupportReceived
        ]



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "page-wrapper" ]
        [ div [ class "app-container" ]
            [ viewHeader model
            , Html.node "main" [ class "main-content", id "main-content" ]
                [ viewPreviewRegion model
                , viewCardRegion model
                ]
            , viewWhatsThisAbout model
            ]
        , viewFooter model
        ]



-- VIEW COMPONENTS


viewHeader : Model -> Html Msg
viewHeader model =
    Html.node "header" [ class "app-header" ]
        [ div [ class "header-content" ]
            [ h1 [ class "app-title" ] [ text "Gridit Baby! ", iconFrog ]
            , p [ class "app-subtitle" ] [ text (translate model.language I18n.AppSubtitle) ]
            ]
        , viewLanguageSelector model.language
        ]


viewWhatsThisAbout : Model -> Html Msg
viewWhatsThisAbout model =
    div [ class "about-section" ]
        [ h2 [ class "about-title" ] [ text (translate model.language I18n.WhatsGridit) ]
        , p [ class "about-text" ] [ text (translate model.language I18n.WhatsThisDescription) ]
        , p [ class "about-text about-curious" ]
            [ text (translate model.language I18n.CuriousAboutGrids) ]
        , p [ class "about-text about-links" ]
            [ a
                [ href "https://en.wikipedia.org/wiki/Grid_(graphic_design)"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Grid in graphic design" ]
            , text " \u{00B7} "
            , a
                [ href "https://en.wikipedia.org/wiki/Grid_method"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "The grid method" ]
            , text " \u{00B7} "
            , a
                [ href "https://en.wikipedia.org/wiki/Scaling_(geometry)"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Scaling in geometry" ]
            , text " \u{00B7} "
            , a
                [ href "https://gurneyjourney.blogspot.com/2009/11/scaling-up-with-grid.html"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Gurney Journey: Scaling up" ]
            , text " \u{00B7} "
            , a
                [ href "https://www.gadsbys.co.uk/drawing-scaling-up-an-image-using-a-grid/"
                , target "_blank"
                , rel "noopener noreferrer"
                ]
                [ text "Gadsbys: Using a grid" ]
            ]
        ]



-- PREVIEW REGION (always visible)


viewPreviewRegion : Model -> Html Msg
viewPreviewRegion model =
    div [ class "preview-region" ]
        [ viewGridPreview model
        , case model.uploadedImage of
            Just _ ->
                div [ class "grid-toggle-container" ]
                    [ label [ class "light-switch" ]
                        [ input
                            [ type_ "checkbox"
                            , Html.Attributes.checked model.showGrid
                            , onClick ToggleGridView
                            , class "light-switch-input sr-only"
                            , attribute "aria-label" (if model.showGrid then translate model.language I18n.HideGrid else translate model.language I18n.ShowGrid)
                            ]
                            []
                        , span [ class "light-switch-track" ]
                            [ span [ class "light-switch-thumb" ] [ iconGrid ] ]
                        , span [ class "light-switch-label" ] [ text (if model.showGrid then translate model.language I18n.HideGrid else translate model.language I18n.ShowGrid) ]
                        ]
                    ]

            Nothing ->
                text ""
        ]


viewGridPreview : Model -> Html Msg
viewGridPreview model =
    div [ class "preview-card" ]
        [ case model.uploadedImage of
            Just _ ->
                viewGriddedImage model

            Nothing ->
                div [ class "preview-placeholder" ]
                    [ Svg.svg
                        [ SvgAttr.class "placeholder-grid-background"
                        , SvgAttr.width "100%"
                        , SvgAttr.height "100%"
                        , SvgAttr.preserveAspectRatio "xMidYMid slice"
                        , attribute "aria-hidden" "true"
                        ]
                        [ Svg.defs []
                            [ Svg.pattern
                                [ SvgAttr.id "placeholderGrid"
                                , SvgAttr.width "40"
                                , SvgAttr.height "40"
                                , SvgAttr.patternUnits "userSpaceOnUse"
                                ]
                                [ Svg.path
                                    [ SvgAttr.d "M 40 0 L 0 0 0 40"
                                    , SvgAttr.fill "none"
                                    , SvgAttr.stroke "#80ED99"
                                    , SvgAttr.strokeWidth "1"
                                    , SvgAttr.opacity "0.3"
                                    ]
                                    []
                                ]
                            ]
                        , Svg.rect
                            [ SvgAttr.width "100%"
                            , SvgAttr.height "100%"
                            , SvgAttr.fill "url(#placeholderGrid)"
                            ]
                            []
                        ]
                    , div [ class "placeholder-content" ]
                        [ span [ class "placeholder-icon" ] [ iconFrogLarge ]
                        , p [ class "placeholder-text" ] [ text (translate model.language I18n.UploadPlaceholder) ]
                        ]
                    ]
        ]



-- CARD REGION (single card, cross-fades between upload and controls)


viewCardRegion : Model -> Html Msg
viewCardRegion model =
    div [ class "card-region" ]
        [ case model.uploadedImage of
            Nothing ->
                viewUploadFace model

            Just _ ->
                viewControlsFace model
        ]


viewUploadFace : Model -> Html Msg
viewUploadFace model =
    div [ class "card card-face" ]
        [ button
            [ class "button button-upload button-upload--prominent"
            , onClick PickImage
            , attribute "data-testid" "upload-button"
            ]
            [ text (translate model.language I18n.ChooseFile), text " ", iconUpload ]
        , p [ class "card-text-small" ]
            [ text (translate model.language I18n.MaxFileSize ++ " \u{2022} " ++ translate model.language I18n.SupportedFormats) ]
        , p [ class "privacy-note" ] [ iconLock, text " ", text (translate model.language I18n.ImagePrivacy) ]
        ]


viewControlsFace : Model -> Html Msg
viewControlsFace model =
    div [ class "card card-face" ]
        [ h3 [ class "card-section-title" ] [ text (translate model.language I18n.GridSettings) ]
        , div [ class "grid-controls-grid" ]
            [ viewSizeControl model
            , viewOpacityControl model
            , viewThicknessControl model
            , viewColorControl model
            , viewDiagonalsToggle model
            ]
        , viewActionButtons model
        , button
            [ class "change-image-link"
            , onClick PickImage
            ]
            [ iconUpload, text (" " ++ translate model.language I18n.ChangeImage) ]
        ]


viewSizeControl : Model -> Html Msg
viewSizeControl model =
    div [ class "control-group" ]
        [ div [ class "control-header" ]
            [ label [ class "control-label", for "grid-size-input" ] [ text (translate model.language I18n.GridSize) ]
            , span [ class "control-value" ] [ text (String.fromInt model.gridSize ++ "x" ++ String.fromInt model.gridSize) ]
            ]
        , input
            [ type_ "range"
            , id "grid-size-input"
            , Html.Attributes.min "2"
            , Html.Attributes.max "32"
            , value (String.fromInt model.gridSize)
            , onInput (\s -> GridSizeChanged (Maybe.withDefault 10 (String.toInt s)))
            , class "slider"
            ]
            []
        ]


viewOpacityControl : Model -> Html Msg
viewOpacityControl model =
    div [ class "control-group" ]
        [ div [ class "control-header" ]
            [ label [ class "control-label", for "grid-opacity-input" ] [ text (translate model.language I18n.GridOpacity) ]
            , span [ class "control-value" ] [ text (String.fromInt (round (model.gridOpacity * 100)) ++ "%") ]
            ]
        , input
            [ type_ "range"
            , id "grid-opacity-input"
            , Html.Attributes.min "0.1"
            , Html.Attributes.max "1"
            , step "0.1"
            , value (String.fromFloat model.gridOpacity)
            , onInput (\s -> GridOpacityChanged (Maybe.withDefault 0.5 (String.toFloat s)))
            , class "slider"
            ]
            []
        ]


viewThicknessControl : Model -> Html Msg
viewThicknessControl model =
    div [ class "control-group" ]
        [ div [ class "control-header" ]
            [ label [ class "control-label", for "grid-thickness-input" ] [ text (translate model.language I18n.GridThickness) ]
            , span [ class "control-value" ] [ text (String.fromInt model.gridThickness ++ "px") ]
            ]
        , input
            [ type_ "range"
            , id "grid-thickness-input"
            , Html.Attributes.min "1"
            , Html.Attributes.max "5"
            , value (String.fromInt model.gridThickness)
            , onInput (\s -> GridThicknessChanged (Maybe.withDefault 1 (String.toInt s)))
            , class "slider"
            ]
            []
        ]


viewColorControl : Model -> Html Msg
viewColorControl model =
    div [ class "control-group" ]
        [ div [ class "control-header" ]
            [ label [ class "control-label", for "grid-color-input" ] [ text (translate model.language I18n.GridColor) ]
            ]
        , div [ class "color-input-row" ]
            [ input
                [ type_ "color"
                , id "grid-color-input"
                , value model.gridColor
                , onInput GridColorChanged
                , class "color-input"
                ]
                []
            , input
                [ type_ "text"
                , value model.gridColor
                , onInput GridColorChanged
                , class "hex-text-input"
                , placeholder "#80ED99"
                , Html.Attributes.maxlength 7
                , attribute "aria-label" "Hex color value"
                ]
                []
            ]
        , div [ class "color-presets" ]
            (List.map
                (\color ->
                    button
                        [ class
                            (if String.toUpper model.gridColor == String.toUpper color then
                                "color-swatch color-swatch--selected"
                             else
                                "color-swatch"
                            )
                        , style "background-color" color
                        , onClick (GridColorChanged color)
                        , attribute "aria-label" ("Color " ++ color)
                        ]
                        []
                )
                [ "#000000", "#FFFFFF", "#FF0000", "#0066FF", "#FFD700" ]
            )
        ]


viewDiagonalsToggle : Model -> Html Msg
viewDiagonalsToggle model =
    div [ class "toggle-row" ]
        [ input
            [ type_ "checkbox"
            , Html.Events.onCheck ToggleDiagonals
            , Html.Attributes.checked model.showDiagonals
            , class "toggle-checkbox"
            , id "diagonals"
            ]
            []
        , label [ class "toggle-label", for "diagonals" ] [ text (translate model.language I18n.AddDiagonalLines) ]
        ]


viewActionButtons : Model -> Html Msg
viewActionButtons model =
    div [ class "action-buttons-wrapper" ]
        [ div [ class "action-buttons" ]
            [ button
                [ class "button button-primary button-download"
                , onClick DownloadClicked
                , disabled (model.uploadedImage == Nothing || model.isProcessing)
                ]
                [ span [ class "button-icon" ] [ if model.downloadSuccess then iconCheck else iconDownload ]
                , text
                    (if model.downloadSuccess then
                        translate model.language I18n.Downloaded
                     else if model.isProcessing then
                        "..."
                     else
                        translate model.language I18n.DownloadGriddedImage
                    )
                ]
            , if model.canShare then
                button
                    [ class "button button-share"
                    , onClick ShareClicked
                    , disabled (model.uploadedImage == Nothing || model.isProcessing)
                    ]
                    [ span [ class "button-icon" ] [ iconShare ]
                    ]
              else
                text ""
            ]
        , div [ class "nice-section" ]
            [ button
                [ class "button button-nice"
                , onClick NiceButtonClicked
                , attribute "aria-label" (translate model.language I18n.Nice)
                ]
                [ iconHeart ]
            , if model.niceCounter > 0 then
                span [ class "nice-counter" ] [ text ("\u{00D7}" ++ String.fromInt model.niceCounter) ]
              else
                text ""
            ]
        ]


viewFooter : Model -> Html Msg
viewFooter model =
    Html.node "footer" [ class "app-footer" ]
        [ div [ class "footer-content" ]
            [ div [ class "tooltip-container", attribute "aria-describedby" "footer-tooltip" ]
                [ span [ class "footer-text-main" ] [ text (translate model.language I18n.MadeInArgentina ++ " "), span [ style "color" "#4ade80" ] [ iconGreenHeart ], text " (\u{2579}\u{25E1}\u{2579}\u{0E51})" ]
                , span [ class "tooltip-content", Html.Attributes.tabindex 0, id "footer-tooltip", attribute "role" "tooltip" ] [ text (translate model.language I18n.FooterTooltip) ]
                ]
            ]
        ]



-- LANGUAGE SELECTOR HELPERS


allLanguages : List Language
allLanguages =
    [ English, Spanish, Latin, Italian, Portuguese, French
    , Asturiano, Gaelic, Euskara, Japanese, Russian, Tuvan, Amharic, Hebrew
    ]


parseLanguage : String -> Language
parseLanguage langValue =
    allLanguages
        |> List.filter (\lang -> (languageMeta lang).id == langValue)
        |> List.head
        |> Maybe.withDefault English


viewLanguageSelector : Language -> Html Msg
viewLanguageSelector currentLanguage =
    let
        languageOption language =
            let
                meta = languageMeta language
            in
            option
                [ value meta.id
                , selected (currentLanguage == language)
                , attribute "aria-label" meta.displayName
                ]
                [ text (meta.displayName ++ " (" ++ String.toUpper meta.code ++ ")") ]

        handleLanguageChange langValue =
            LanguageChanged (parseLanguage langValue)
    in
    div [ class "language-selector compact" ]
        [ span [ class "globe-icon" ] [ iconGlobe ]
        , label
            [ for "language-select"
            , class "sr-only"
            ]
            [ text (translate currentLanguage I18n.LanguageLabel) ]
        , select
            [ id "language-select"
            , on "change" (Json.Decode.map handleLanguageChange (Json.Decode.at [ "target", "value" ] Json.Decode.string))
            , class "language-dropdown compact"
            , attribute "aria-label" (translate currentLanguage I18n.LanguageLabel)
            ]
            (List.map languageOption allLanguages)
        ]


viewGriddedImage : Model -> Html Msg
viewGriddedImage model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just width, Just height ) ->
            let
                config = gridConfigFromModel model
                dims = { width = width, height = height }
                gridLines = allGridLines config dims
            in
            div [ class "gridded-image-container" ]
                [ img
                    [ src url
                    , class "gridded-base-image"
                    , Html.Attributes.alt "Uploaded image with grid overlay"
                    ]
                    []
                , if model.showGrid then
                    Svg.svg
                        [ SvgAttr.width (String.fromInt width)
                        , SvgAttr.height (String.fromInt height)
                        , SvgAttr.viewBox ("0 0 " ++ String.fromInt width ++ " " ++ String.fromInt height)
                        , SvgAttr.class "grid-overlay"
                        , attribute "aria-hidden" "true"
                        ]
                        gridLines
                  else
                    text ""
                ]

        ( Just url, _, _ ) ->
            -- Image is loading, show it to trigger onload and get dimensions
            div [ class "gridded-image-container" ]
                [ img
                    [ src url
                    , class "gridded-base-image loading"
                    , Html.Attributes.alt "Uploaded image with grid overlay"
                    , on "load" (decodeImageSize ImageSizeLoaded)
                    ]
                    []
                ]

        _ ->
            text (translate model.language I18n.NoImageYet)



decodeImageSize : (Int -> Int -> Msg) -> Json.Decode.Decoder Msg
decodeImageSize tagger =
    Json.Decode.map2 tagger
        (Json.Decode.at [ "target", "naturalWidth" ] Json.Decode.int)
        (Json.Decode.at [ "target", "naturalHeight" ] Json.Decode.int)


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
