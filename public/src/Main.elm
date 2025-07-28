port module Main exposing (..)

import Base64
import Browser
import Bytes exposing (Bytes)
import Bytes.Decode as BD
import Bytes.Encode as BE
import File exposing (File)
import File.Download
import File.Select as Select
import Html exposing (Html, button, canvas, div, h1, h2, h3, img, input, label, option, p, select, span, text)
import Html.Attributes exposing (class, disabled, for, id, max, min, placeholder, selected, src, step, style, type_, value)
import Html.Events exposing (on, onClick, onInput)
import I18n exposing (Language(..), TranslationKey(..), translate)
import Json.Decode
import Process
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr
import Task



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
    , drawerExpanded : Bool
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
    | ToggleDrawer



-- Debug port for logging


port debug : String -> Cmd msg


port requestPng : { url : String, width : Int, height : Int, grid : Int, color : String, thickness : Int, opacity : Float, showDiagonals : Bool } -> Cmd msg


port receivePng : (String -> msg) -> Sub msg


port downloadImage : { dataUrl : String } -> Cmd msg


port setHtmlLang : String -> Cmd msg



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
      , drawerExpanded = False
      }
    , Cmd.none
    )



-- HELPERS
-- | Convert a Language to its ISO language code


languageToCode : Language -> String
languageToCode language =
    case language of
        English ->
            "en"

        Spanish ->
            "es"

        Latin ->
            "la"

        Italian ->
            "it"

        Portuguese ->
            "pt"

        French ->
            "fr"

        Asturiano ->
            "ast"

        Gaelic ->
            "gd"

        Euskara ->
            "eu"

        Japanese ->
            "ja"

        Russian ->
            "ru"

        Tuvan ->
            "tyv"

        Amharic ->
            "am"

        Hebrew ->
            "he"



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        PickImage ->
            ( model, Select.file [ "image/*" ] ImageSelected )

        ImageSelected file ->
            ( model, Task.perform ImageLoaded (File.toUrl file) )

        ImageLoaded url ->
            ( { model | uploadedImage = Just url, imageWidth = Nothing, imageHeight = Nothing }, Cmd.none )

        GridSizeChanged size ->
            ( { model | gridSize = size }, Cmd.none )

        GridColorChanged color ->
            ( { model | gridColor = color }, Cmd.none )

        GridThicknessChanged thickness ->
            ( { model | gridThickness = thickness }, Cmd.none )

        GridOpacityChanged opacity ->
            ( { model | gridOpacity = opacity }, Cmd.none )

        NiceButtonClicked ->
            ( { model | niceCounter = model.niceCounter + 1 }, Cmd.none )

        ImageSizeLoaded width height ->
            ( { model | imageWidth = Just width, imageHeight = Just height }, Cmd.none )

        LanguageChanged newLanguage ->
            ( { model | language = newLanguage }, setHtmlLang (languageToCode newLanguage) )

        ResetDownloadSuccess ->
            ( { model | downloadSuccess = False }, Cmd.none )

        ToggleDiagonals value ->
            ( { model | showDiagonals = value }, Cmd.none )

        ToggleDrawer ->
            ( { model | drawerExpanded = not model.drawerExpanded }, Cmd.none )

        DownloadClicked ->
            case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
                ( Just url, Just w, Just h ) ->
                    let
                        _ =
                            debug ("Elm: DownloadClicked with valid image data. Width: " ++ String.fromInt w ++ ", Height: " ++ String.fromInt h)

                        requestParams =
                            { url = url, width = w, height = h, grid = model.gridSize, color = model.gridColor, thickness = model.gridThickness, opacity = model.gridOpacity, showDiagonals = model.showDiagonals }
                    in
                    ( model, Cmd.batch [ debug "Elm: Sending requestPng command", requestPng requestParams ] )

                _ ->
                    ( model, debug "Elm: DownloadClicked but missing image data" )

        GriddedReady dataUrl ->
            -- Use JavaScript port to trigger download
            let
                _ =
                    debug ("Elm: GriddedReady received data URL of length: " ++ String.fromInt (String.length dataUrl))

                _ =
                    debug "Elm: Triggering download via downloadImage port"

                -- Set downloadSuccess to true to trigger animation
                updatedModel =
                    { model | downloadSuccess = True }
            in
            ( updatedModel
            , Cmd.batch
                [ debug "Elm: Starting download..."
                , downloadImage { dataUrl = dataUrl }
                , -- Reset animation after 2 seconds
                  Task.perform (\_ -> ResetDownloadSuccess) (Process.sleep 2000)
                ]
            )



-- SUBSCRIPTIONS


subscriptions _ =
    receivePng GriddedReady



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "app-container" ]
        [ viewHeader model.language
        , div [ class "main-content" ]
            [ viewLeftColumn model
            , viewRightColumn model
            ]
        , viewStatusBar model
        , input
            [ type_ "file"
            , id "file-input"
            , class "hidden-file-input"
            , Html.Attributes.attribute "accept" "image/*"
            ]
            []
        ]



-- VIEW COMPONENTS


viewHeader : Language -> Html Msg
viewHeader language =
    div [ class "app-header" ]
        [ div [ class "app-logo-wrapper" ]
            [ span [ class "app-logo" ] [ text "🐸" ]
            , h1 [ class "app-title" ] [ text (translate language AppTitle) ]
            ]
        , p [ class "app-subtitle" ] [ text (translate language AppSubtitle) ]
        , viewLanguageSelector language
        ]


viewSidebar : Model -> Html Msg
viewSidebar model =
    div
        [ class
            (if model.drawerExpanded then
                "sidebar expanded"

             else
                "sidebar"
            )
        ]
        [ div [ class "drawer-handle", onClick ToggleDrawer ]
            [ div [ class "drawer-handle-icon" ]
                [ text "⌃" ]
            ]
        , div [ class "sidebar-content" ]
            [ viewGridControls model
            ]
        ]


viewMobileActions : Model -> Html Msg
viewMobileActions model =
    div [ class "mobile-actions" ]
        [ button
            [ class "btn btn-primary"
            , onClick DownloadClicked
            , disabled (model.uploadedImage == Nothing)
            ]
            [ span [ class "icon" ] [ text "↓" ]
            , text (translate model.language Download)
            ]
        , button
            [ class "btn btn-accent"
            ]
            [ span [ class "icon" ] [ text "↗" ]
            , text (translate model.language Share)
            ]
        ]



-- Left Column with Upload Area and Grid Controls


viewLeftColumn : Model -> Html Msg
viewLeftColumn model =
    div [ class "left-column" ]
        [ viewUploadArea model
        , viewGridControls model
        ]



-- Right Column with Grid Preview


viewRightColumn : Model -> Html Msg
viewRightColumn model =
    div [ class "right-column" ]
        [ viewGridPreviewArea model
        ]



-- Modern Grid Preview Area that matches the mockup


viewGridPreviewArea : Model -> Html Msg
viewGridPreviewArea model =
    div [ class "preview-container" ]
        [ case model.uploadedImage of
            Just url ->
                viewGriddedImage model

            Nothing ->
                div [ class "empty-state" ]
                    [ span [ class "empty-icon" ] [ text "🖼" ]
                    , p [ class "empty-text" ] [ text (translate model.language NoImageYet) ]
                    ]
        ]



-- Modern Upload Area that matches the mockup


viewUploadArea : Model -> Html Msg
viewUploadArea model =
    div [ class "panel" ]
        [ div
            [ class "upload-area"
            , onClick PickImage
            , Html.Attributes.attribute "aria-label" (translate model.language UploadPrompt)
            , Html.Attributes.attribute "role" "button"
            , id "upload-image-button"
            ]
            [ span [ class "upload-icon" ]
                [ if model.uploadedImage == Nothing then
                    text "⬆️"

                  else
                    text "🖼️"
                ]
            , h3 [ class "upload-title" ]
                [ if model.uploadedImage == Nothing then
                    text (translate model.language UploadPrompt)

                  else
                    text (translate model.language UploadNew)
                ]
            , p [ class "upload-description" ]
                [ text (translate model.language UploadDescription)
                ]
            , button
                [ class "button button-outline"
                ]
                [ text (translate model.language ChooseFile)
                ]
            ]
        ]



-- Modern Grid Controls Panel that matches the mockup


viewGridControls : Model -> Html Msg
viewGridControls model =
    div [ class "panel" ]
        [ div [ class "settings-panel-header" ]
            [ span [] [ text "🐸" ]
            , span [ class "grid-icon" ] [ text "⊞" ]
            , text (translate model.language GridSettings)
            ]

        -- Grid Controls in 2-column grid layout
        , div [ class "settings-grid" ]
            -- Grid Size
            [ div [ class "form-group" ]
                [ label
                    [ class "form-label"
                    , for "grid-size-slider"
                    ]
                    [ text (translate model.language GridSize ++ ": " ++ String.fromInt model.gridSize) ]
                , div [ class "input-with-text" ]
                    [ input
                        [ type_ "range"
                        , id "grid-size-slider"
                        , Html.Attributes.min "2"
                        , Html.Attributes.max "50"
                        , step "1"
                        , value (String.fromInt model.gridSize)
                        , onInput (\s -> GridSizeChanged (Maybe.withDefault 10 (String.toInt s)))
                        , class "slider"
                        , Html.Attributes.attribute "aria-valuemin" "2"
                        , Html.Attributes.attribute "aria-valuemax" "50"
                        , Html.Attributes.attribute "aria-valuenow" (String.fromInt model.gridSize)
                        , Html.Attributes.attribute "aria-labelledby" "grid-size-label"
                        ]
                        []
                    , input
                        [ type_ "number"
                        , id "grid-size-number"
                        , Html.Attributes.min "2"
                        , Html.Attributes.max "50"
                        , value (String.fromInt model.gridSize)
                        , onInput (\s -> GridSizeChanged (Maybe.withDefault 10 (String.toInt s)))
                        , class "numeric-input"
                        , Html.Attributes.attribute "aria-label" (translate model.language GridSize)
                        ]
                        []
                    , span [ class "unit" ] [ text "▭" ]
                    ]
                ]

            -- Grid Color
            , div [ class "form-group" ]
                [ label
                    [ class "form-label"
                    , for "grid-color-picker"
                    ]
                    [ text (translate model.language GridColor) ]
                , select
                    [ id "grid-color-picker"
                    , value model.gridColor
                    , onInput GridColorChanged
                    , class "select-input"
                    ]
                    [ option [ value "#000000" ] [ text "Black" ]
                    , option [ value "#ffffff" ] [ text "White" ]
                    , option [ value "#ff0000" ] [ text "Red" ]
                    , option [ value "#00ff00" ] [ text "Green" ]
                    , option [ value "#0000ff" ] [ text "Blue" ]
                    , option [ value "#ffff00" ] [ text "Yellow" ]
                    , option [ value "#ff00ff" ] [ text "Magenta" ]
                    , option [ value "#00ffff" ] [ text "Cyan" ]
                    ]
                , input
                    [ type_ "text"
                    , id "grid-color-hex"
                    , value model.gridColor
                    , onInput GridColorChanged
                    , class "hex-input"
                    , Html.Attributes.attribute "aria-label" (translate model.language GridColor ++ " hex value")
                    , placeholder "#RRGGBB"
                    ]
                    []
                ]
            ]

        -- Diagonal Grid Toggle
        , div [ class "form-group toggle-group" ]
            [ label
                [ class "form-label", for "diagonal-toggle" ]
                [ text (translate model.language DiagonalGrid) ]
            , div [ class "toggle-switch-wrapper" ]
                [ input
                    [ type_ "checkbox"
                    , id "diagonal-toggle"
                    , Html.Events.onCheck ToggleDiagonals
                    , Html.Attributes.checked model.showDiagonals
                    , class "toggle-switch"
                    ]
                    []
                , span [ class "toggle-switch-label" ] []
                ]
            ]

        -- Action Buttons
        , div [ class "action-buttons" ]
            [ button
                [ class "button button-primary"
                , onClick DownloadClicked
                , disabled (model.uploadedImage == Nothing)
                ]
                [ span [ class "icon" ] [ text "↓" ]
                , text (translate model.language Download)
                ]
            , button
                [ class "button button-accent"
                , disabled (model.uploadedImage == Nothing)
                ]
                [ span [ class "icon" ] [ text "↗" ]
                , text (translate model.language Share)
                ]
            ]

        -- Line Width
        , div [ class "form-group" ]
            [ label
                [ class "form-label"
                , for "grid-thickness-slider"
                ]
                [ text (translate model.language GridThickness ++ ": " ++ String.fromInt model.gridThickness ++ "px") ]
            , div [ class "input-with-text" ]
                [ input
                    [ type_ "range"
                    , id "grid-thickness-slider"
                    , Html.Attributes.min "1"
                    , Html.Attributes.max "10"
                    , step "1"
                    , value (String.fromInt model.gridThickness)
                    , onInput (\s -> GridThicknessChanged (Maybe.withDefault 1 (String.toInt s)))
                    , class "slider-input"
                    , Html.Attributes.attribute "aria-valuemin" "1"
                    , Html.Attributes.attribute "aria-valuemax" "10"
                    , Html.Attributes.attribute "aria-valuenow" (String.fromInt model.gridThickness)
                    , Html.Attributes.attribute "aria-labelledby" "grid-thickness-label"
                    ]
                    []
                , input
                    [ type_ "number"
                    , id "grid-thickness-number"
                    , Html.Attributes.min "1"
                    , Html.Attributes.max "10"
                    , value (String.fromInt model.gridThickness)
                    , onInput (\s -> GridThicknessChanged (Maybe.withDefault 1 (String.toInt s)))
                    , class "numeric-input"
                    , Html.Attributes.attribute "aria-label" (translate model.language GridThickness)
                    ]
                    []
                , span [ class "unit" ] [ text "px" ]
                ]
            ]

        -- Grid Opacity
        , div [ class "form-group" ]
            [ label
                [ class "form-label"
                , for "grid-opacity-slider"
                ]
                [ text (translate model.language GridOpacity ++ ": " ++ (String.fromFloat (model.gridOpacity * 100) |> String.left 4) ++ "%") ]
            , div [ class "input-with-text" ]
                [ input
                    [ type_ "range"
                    , id "grid-opacity-slider"
                    , Html.Attributes.min "0"
                    , Html.Attributes.max "1"
                    , step "0.01"
                    , value (String.fromFloat model.gridOpacity)
                    , onInput (\s -> GridOpacityChanged (Maybe.withDefault 0.5 (String.toFloat s)))
                    , class "slider-input"
                    , Html.Attributes.attribute "aria-valuemin" "0"
                    , Html.Attributes.attribute "aria-valuemax" "1"
                    , Html.Attributes.attribute "aria-valuenow" (String.fromFloat model.gridOpacity)
                    , Html.Attributes.attribute "aria-labelledby" "grid-opacity-label"
                    ]
                    []
                , input
                    [ type_ "number"
                    , id "grid-opacity-number"
                    , Html.Attributes.min "0"
                    , Html.Attributes.max "100"
                    , value (String.fromInt (round (model.gridOpacity * 100)))
                    , onInput (\s -> GridOpacityChanged (toFloat (Maybe.withDefault 50 (String.toInt s)) / 100))
                    , class "numeric-input"
                    , Html.Attributes.attribute "aria-label" (translate model.language GridOpacity)
                    ]
                    []
                , span [ class "unit" ] [ text "%" ]
                ]
            ]
        ]


viewActionsPanel : Model -> Html Msg
viewActionsPanel model =
    div [ class "panel", Html.Attributes.attribute "role" "group", Html.Attributes.attribute "aria-labelledby" "actions-title" ]
        [ span [ class "panel-title", id "actions-title" ] [ text (translate model.language Actions) ]
        , div []
            [ button
                [ class
                    (if model.uploadedImage /= Nothing then
                        "btn btn-primary download-ready"

                     else
                        "btn btn-primary"
                    )
                , onClick DownloadClicked
                , disabled (model.uploadedImage == Nothing)
                , Html.Attributes.attribute "aria-label" (translate model.language DownloadGriddedImage)
                , Html.Attributes.attribute "role" "button"
                , id "download-button"
                , Html.Attributes.attribute "aria-disabled"
                    (if model.uploadedImage == Nothing then
                        "true"

                     else
                        "false"
                    )
                , style "background"
                    (if model.uploadedImage /= Nothing then
                        "linear-gradient(135deg, #132a13, #31572c, #4f772d, #90a955, #ecf39e)"

                     else
                        ""
                    )
                , style "color"
                    (if model.uploadedImage /= Nothing then
                        "white"

                     else
                        ""
                    )
                , style "text-shadow"
                    (if model.uploadedImage /= Nothing then
                        "0px 1px 2px rgba(0, 0, 0, 0.5)"

                     else
                        ""
                    )
                ]
                [ text (translate model.language DownloadGriddedImage)
                ]
            ]
        , div []
            [ button
                [ class "btn"
                , onClick NiceButtonClicked
                , Html.Attributes.attribute "aria-label" "Nice Frog Button"
                , Html.Attributes.attribute "role" "button"
                , id "nice-button"
                ]
                [ text "🐸 "
                , text (translate model.language Nice)
                , text (" (" ++ String.fromInt model.niceCounter ++ ")")
                ]
            ]
        ]


viewCanvasArea : Model -> Html Msg
viewCanvasArea model =
    div [ class "canvas-area" ]
        [ case model.uploadedImage of
            Just url ->
                viewGridPreviewLayout model url

            Nothing ->
                viewUploadPrompt model
        ]


viewGridPreviewLayout : Model -> String -> Html Msg
viewGridPreviewLayout model url =
    div [ class "grid-preview-area" ]
        [ div [ class "preview-header" ]
            [ h2 [ class "preview-title" ]
                [ span [ class "preview-icon" ] [ text "🖼️" ]
                , text (translate model.language GriddedImage)
                ]
            ]
        , div [ class "preview-content" ]
            [ case ( model.imageWidth, model.imageHeight ) of
                ( Just width, Just height ) ->
                    let
                        cellWidth =
                            toFloat width / toFloat model.gridSize

                        cellHeight =
                            toFloat height / toFloat model.gridSize

                        verticalLines =
                            List.range 0 model.gridSize
                                |> List.map
                                    (\i ->
                                        let
                                            x =
                                                toFloat i * cellWidth
                                        in
                                        Svg.line
                                            [ SvgAttr.x1 (String.fromFloat x)
                                            , SvgAttr.y1 "0"
                                            , SvgAttr.x2 (String.fromFloat x)
                                            , SvgAttr.y2 (String.fromInt height)
                                            , SvgAttr.stroke model.gridColor
                                            , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                            , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                            ]
                                            []
                                    )

                        horizontalLines =
                            List.range 0 model.gridSize
                                |> List.map
                                    (\i ->
                                        let
                                            y =
                                                toFloat i * cellHeight
                                        in
                                        Svg.line
                                            [ SvgAttr.x1 "0"
                                            , SvgAttr.y1 (String.fromFloat y)
                                            , SvgAttr.x2 (String.fromInt width)
                                            , SvgAttr.y2 (String.fromFloat y)
                                            , SvgAttr.stroke model.gridColor
                                            , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                            , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                            ]
                                            []
                                    )

                        diagonalLines =
                            if model.showDiagonals then
                                let
                                    diagonalLines1 =
                                        List.range 0 (model.gridSize * 2)
                                            |> List.map
                                                (\i ->
                                                    let
                                                        x =
                                                            toFloat i * cellWidth

                                                        y =
                                                            toFloat i * cellHeight
                                                    in
                                                    Svg.line
                                                        [ SvgAttr.x1 (String.fromFloat x)
                                                        , SvgAttr.y1 "0"
                                                        , SvgAttr.x2 "0"
                                                        , SvgAttr.y2 (String.fromFloat y)
                                                        , SvgAttr.stroke model.gridColor
                                                        , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                                        , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                                        ]
                                                        []
                                                )

                                    diagonalLines2 =
                                        List.range 0 (model.gridSize * 2)
                                            |> List.map
                                                (\i ->
                                                    let
                                                        x =
                                                            toFloat (model.gridSize - i) * cellWidth

                                                        y =
                                                            toFloat i * cellHeight
                                                    in
                                                    Svg.line
                                                        [ SvgAttr.x1 (String.fromFloat x)
                                                        , SvgAttr.y1 "0"
                                                        , SvgAttr.x2 (String.fromInt width)
                                                        , SvgAttr.y2 (String.fromFloat y)
                                                        , SvgAttr.stroke model.gridColor
                                                        , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                                        , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                                        ]
                                                        []
                                                )
                                in
                                diagonalLines1 ++ diagonalLines2

                            else
                                []

                        allLines =
                            verticalLines ++ horizontalLines ++ diagonalLines
                    in
                    div [ class "gridded-image-container" ]
                        [ img
                            [ src url
                            , class "gridded-base-image"
                            , on "load" (decodeImageSize ImageSizeLoaded)
                            ]
                            []
                        , Svg.svg
                            [ SvgAttr.width (String.fromInt width)
                            , SvgAttr.height (String.fromInt height)
                            , SvgAttr.viewBox ("0 0 " ++ String.fromInt width ++ " " ++ String.fromInt height)
                            , SvgAttr.class "grid-overlay"
                            ]
                            allLines
                        ]

                _ ->
                    div [ class "gridded-image-container" ]
                        [ img
                            [ src url
                            , class "preview-image"
                            , on "load" (decodeImageSize ImageSizeLoaded)
                            ]
                            []
                        ]
            ]
        , viewDesktopActions model
        ]


viewUploadPrompt : Model -> Html Msg
viewUploadPrompt model =
    div [ class "upload-prompt" ]
        [ div [ class "upload-container" ]
            [ div [ class "upload-icon" ] [ text "📁" ]
            , h2 [ class "upload-title" ] [ text (translate model.language UploadPrompt) ]
            , p [ class "upload-subtitle" ] [ text (translate model.language UploadDescription) ]
            , button
                [ class "btn btn-primary upload-btn"
                , onClick PickImage
                , Html.Attributes.attribute "aria-label" (translate model.language UploadImage)
                ]
                [ span [ class "upload-icon" ] [ text "⬆️" ]
                , text (translate model.language UploadImage)
                ]
            ]
        ]


viewDesktopActions : Model -> Html Msg
viewDesktopActions model =
    div [ class "desktop-actions" ]
        [ button
            [ class "btn btn-primary"
            , onClick DownloadClicked
            , disabled (model.uploadedImage == Nothing)
            ]
            [ span [ class "icon" ] [ text "↓" ]
            , text (translate model.language Download)
            ]
        , button
            [ class "btn btn-secondary"
            , onClick PickImage
            ]
            [ span [ class "icon" ] [ text "⬆" ]
            , text (translate model.language UploadNew)
            ]
        ]


viewPlaceholder : String -> String -> String -> Html Msg
viewPlaceholder icon title subtitle =
    div [ class "placeholder" ]
        [ div [ class "placeholder-icon", style "color" "white" ]
            [ text icon ]
        , p [ class "placeholder-title" ] [ text title ]
        , p [ class "placeholder-text" ] [ text subtitle ]
        ]


viewStatusBar : Model -> Html Msg
viewStatusBar model =
    div [ class "status-bar" ]
        [ span []
            [ text (translate model.language StatusReady ++ " | Grid: ")
            , text (String.fromInt model.gridSize)
            , text "×"
            , text (String.fromInt model.gridSize)
            , text " | Opacity: "
            , text (String.fromInt (round (model.gridOpacity * 100)))
            , text "%"
            ]
        , span [ class "made-with" ]
            [ text "Made in  🇦🇷  with  ❤️ (¯▿¯)" ]
        , span [ class "nice-count" ]
            [ text (translate model.language NiceCounter)
            , text (String.fromInt model.niceCounter)
            , text " 🐸"
            ]
        ]



-- | Convert a Language to a string identifier for the dropdown


languageToString : Language -> String
languageToString language =
    case language of
        English ->
            "english"

        Spanish ->
            "spanish"

        Latin ->
            "latin"

        Italian ->
            "italian"

        Portuguese ->
            "portuguese"

        French ->
            "french"

        Asturiano ->
            "asturiano"

        Gaelic ->
            "gaelic"

        Euskara ->
            "euskara"

        Japanese ->
            "japanese"

        Russian ->
            "russian"

        Tuvan ->
            "tuvan"

        Amharic ->
            "amharic"

        Hebrew ->
            "hebrew"



-- | Get flag emoji for a language


languageFlag : Language -> String
languageFlag language =
    case language of
        English ->
            "🇬🇧🇺🇸 "

        Spanish ->
            "🇪🇸🇦🇷 "

        Latin ->
            "🇮🇹 "

        Italian ->
            "🇮🇹 "

        Portuguese ->
            "🇧🇷🇵🇹 "

        French ->
            "🇫🇷 "

        Asturiano ->
            "🇪🇸 "

        Gaelic ->
            "🇮🇪🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F} "

        Euskara ->
            "🇪🇸 "

        Japanese ->
            "🇯🇵 "

        Russian ->
            "🇷🇺 "

        Tuvan ->
            "🇷🇺 "

        Amharic ->
            "🇪🇹 "

        Hebrew ->
            "🇮🇱 "



-- | Parse a language string from the dropdown to a Language type


parseLanguage : String -> Language
parseLanguage value =
    case value of
        "english" ->
            English

        "spanish" ->
            Spanish

        "latin" ->
            Latin

        "italian" ->
            Italian

        "portuguese" ->
            Portuguese

        "french" ->
            French

        "asturiano" ->
            Asturiano

        "gaelic" ->
            Gaelic

        "euskara" ->
            Euskara

        "japanese" ->
            Japanese

        "russian" ->
            Russian

        "tuvan" ->
            Tuvan

        "amharic" ->
            Amharic

        "hebrew" ->
            Hebrew

        _ ->
            English


viewLanguageSelector : Language -> Html Msg
viewLanguageSelector currentLanguage =
    let
        languageOption language displayName =
            option
                [ value (languageToString language)
                , selected (currentLanguage == language)
                , Html.Attributes.attribute "aria-label" displayName
                ]
                [ text (languageFlag language ++ displayName) ]

        handleLanguageChange value =
            LanguageChanged (parseLanguage value)

        _ =
            debug ("lang:" ++ languageToCode currentLanguage)
    in
    div [ class "language-selector" ]
        [ label
            [ for "language-select"
            , class "sr-only"
            ]
            [ text (translate currentLanguage LanguageLabel) ]
        , select
            [ id "language-select"
            , on "change" (Json.Decode.map handleLanguageChange (Json.Decode.at [ "target", "value" ] Json.Decode.string))
            , class "language-dropdown"
            , Html.Attributes.attribute "aria-label" (translate currentLanguage LanguageLabel)
            ]
            [ languageOption English "English"
            , languageOption Spanish "Español"
            , languageOption Latin "Latin"
            , languageOption Italian "Italiano"
            , languageOption Portuguese "Português"
            , languageOption French "Français"
            , languageOption Asturiano "Asturianu"
            , languageOption Gaelic "Gàidhlig"
            , languageOption Euskara "Euskara"
            , languageOption Japanese "日本語"
            , languageOption Russian "Русский"
            , languageOption Tuvan "Тыва дыл"
            , languageOption Amharic "አማርኛ"
            , languageOption Hebrew "עברית"
            ]
        ]


viewPreview : Maybe String -> Language -> Html Msg
viewPreview maybeUrl language =
    case maybeUrl of
        Just url ->
            img
                [ src url
                , class "preview-image"
                , on "load" (decodeImageSize ImageSizeLoaded)
                ]
                []

        Nothing ->
            viewPlaceholder "↑" (translate language NoImageYet) (translate language UploadPlaceholder)


viewGriddedImage : Model -> Html Msg
viewGriddedImage model =
    case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
        ( Just url, Just width, Just height ) ->
            let
                -- cells
                -- interlinked
                -- within cells interlinked
                cellWidth =
                    toFloat width / toFloat model.gridSize

                cellHeight =
                    toFloat height / toFloat model.gridSize

                verticalLines =
                    List.range 0 model.gridSize
                        |> List.map
                            (\i ->
                                let
                                    x =
                                        toFloat i * cellWidth
                                in
                                Svg.line
                                    [ SvgAttr.x1 (String.fromFloat x)
                                    , SvgAttr.y1 "0"
                                    , SvgAttr.x2 (String.fromFloat x)
                                    , SvgAttr.y2 (String.fromInt height)
                                    , SvgAttr.stroke model.gridColor
                                    , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                    , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                    ]
                                    []
                            )

                horizontalLines =
                    List.range 0 model.gridSize
                        |> List.map
                            (\i ->
                                let
                                    y =
                                        toFloat i * cellHeight
                                in
                                Svg.line
                                    [ SvgAttr.x1 "0"
                                    , SvgAttr.y1 (String.fromFloat y)
                                    , SvgAttr.x2 (String.fromInt width)
                                    , SvgAttr.y2 (String.fromFloat y)
                                    , SvgAttr.stroke model.gridColor
                                    , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                    , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                    ]
                                    []
                            )

                diagonalLines1 =
                    if model.showDiagonals then
                        List.range 0 (model.gridSize * 2)
                            |> List.map
                                (\i ->
                                    let
                                        x =
                                            toFloat i * cellWidth

                                        y =
                                            toFloat i * cellHeight
                                    in
                                    Svg.line
                                        [ SvgAttr.x1 (String.fromFloat x)
                                        , SvgAttr.y1 "0"
                                        , SvgAttr.x2 "0"
                                        , SvgAttr.y2 (String.fromFloat y)
                                        , SvgAttr.stroke model.gridColor
                                        , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                        , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                        ]
                                        []
                                )

                    else
                        []

                diagonalLines2 =
                    if model.showDiagonals then
                        List.range 0 (model.gridSize * 2)
                            |> List.map
                                (\i ->
                                    let
                                        x =
                                            toFloat (model.gridSize - i) * cellWidth

                                        y =
                                            toFloat i * cellHeight
                                    in
                                    Svg.line
                                        [ SvgAttr.x1 (String.fromFloat x)
                                        , SvgAttr.y1 "0"
                                        , SvgAttr.x2 (String.fromInt width)
                                        , SvgAttr.y2 (String.fromFloat y)
                                        , SvgAttr.stroke model.gridColor
                                        , SvgAttr.strokeWidth (String.fromInt model.gridThickness)
                                        , SvgAttr.opacity (String.fromFloat model.gridOpacity)
                                        ]
                                        []
                                )

                    else
                        []

                allLines =
                    verticalLines ++ horizontalLines ++ diagonalLines1 ++ diagonalLines2
            in
            div [ class "gridded-image-container" ]
                [ img
                    [ src url
                    , class "gridded-base-image"
                    ]
                    []
                , Svg.svg
                    [ SvgAttr.width (String.fromInt width)
                    , SvgAttr.height (String.fromInt height)
                    , SvgAttr.viewBox ("0 0 " ++ String.fromInt width ++ " " ++ String.fromInt height)
                    , SvgAttr.class "grid-overlay"
                    ]
                    allLines
                ]

        _ ->
            text (translate model.language NoImageYet)


dataUrlToBytes : String -> Maybe Bytes
dataUrlToBytes dataUrl =
    -- Extract the base64 data from the data URL
    case String.split "," dataUrl of
        -- Data URLs have the format: data:[<mediatype>][;base64],<data>
        [ _, base64Data ] ->
            case Base64.decode base64Data of
                Ok decodedString ->
                    -- Convert the decoded string to bytes
                    let
                        -- Get string length
                        length =
                            String.length decodedString

                        -- Convert each character to its byte value
                        bytes =
                            String.toList decodedString
                                |> List.map (\c -> Char.toCode c)
                                |> List.map BE.unsignedInt8
                                |> BE.sequence
                                |> BE.encode
                    in
                    Just bytes

                Err _ ->
                    Nothing

        _ ->
            Nothing


decodeImageSize : (Int -> Int -> Msg) -> Json.Decode.Decoder Msg
decodeImageSize tagger =
    Json.Decode.map2 tagger
        (Json.Decode.at [ "target", "naturalWidth" ] Json.Decode.int)
        (Json.Decode.at [ "target", "naturalHeight" ] Json.Decode.int)


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
