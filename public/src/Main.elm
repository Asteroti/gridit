port module Main exposing (..)

import Base64
import Browser
import Bytes exposing (Bytes)
import Bytes.Decode as BD
import Bytes.Encode as BE
import File exposing (File)
import File.Download
import File.Select as Select
import Html exposing (Html, button, div, h1, h2, h3, img, input, label, option, p, select, span, text)
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



-- Debug port for logging


port debug : String -> Cmd msg


port requestPng : { url : String, width : Int, height : Int, grid : Int, color : String, thickness : Int, opacity : Float } -> Cmd msg


port receivePng : (String -> msg) -> Sub msg


port downloadImage : { dataUrl : String } -> Cmd msg


port setHtmlLang : String -> Cmd msg



-- INITIAL STATE


init : Model
init =
    { uploadedImage = Nothing
    , gridSize = 10
    , niceCounter = 0
    , imageWidth = Nothing
    , imageHeight = Nothing
    , gridColor = "#80ED99"
    , gridThickness = 1
    , gridOpacity = 1
    , language = Spanish
    , downloadSuccess = False
    }



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

        DownloadClicked ->
            case ( model.uploadedImage, model.imageWidth, model.imageHeight ) of
                ( Just url, Just w, Just h ) ->
                    let
                        _ =
                            debug ("Elm: DownloadClicked with valid image data. Width: " ++ String.fromInt w ++ ", Height: " ++ String.fromInt h)

                        requestParams =
                            { url = url, width = w, height = h, grid = model.gridSize, color = model.gridColor, thickness = model.gridThickness, opacity = model.gridOpacity }
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
        [ viewTitleBar model
        , div [ class "main-content" ]
            [ viewSidebar model
            , viewCanvasArea model
            ]
        , viewStatusBar model
        ]



-- VIEW COMPONENTS


viewTitleBar : Model -> Html Msg
viewTitleBar model =
    div [ class "title-bar" ]
        [ span [ class "title-text" ] [ text " gridit gridit" ]
        , viewLanguageSelector model.language
        ]


viewSidebar : Model -> Html Msg
viewSidebar model =
    div [ class "sidebar" ]
        [ viewAppHeader model
        , div [ class "sidebar-content" ]
            [ viewFileOperationsPanel model
            , viewGridParametersPanel model
            , viewActionsPanel model
            ]
        ]


viewAppHeader : Model -> Html Msg
viewAppHeader model =
    div [ class "app-header" ]
        [ div []
            [ h1 [ class "app-title" ] [ text (translate model.language AppTitle) ]
            , p [ class "app-subtitle" ] [ text (translate model.language AppSubtitle) ]
            ]
        ]


viewFileOperationsPanel : Model -> Html Msg
viewFileOperationsPanel model =
    div [ class "panel", Html.Attributes.attribute "role" "group", Html.Attributes.attribute "aria-labelledby" "file-operations-title" ]
        [ span [ class "panel-title", id "file-operations-title" ] [ text (translate model.language FileOperations) ]
        , button
            [ class "btn"
            , onClick PickImage
            , Html.Attributes.attribute "aria-label" (translate model.language UploadImage)
            , Html.Attributes.attribute "role" "button"
            , id "upload-image-button"
            ]
            [ text (translate model.language UploadImage)
            ]
        ]


viewGridParametersPanel : Model -> Html Msg
viewGridParametersPanel model =
    div [ class "panel" ]
        [ span [ class "panel-title" ] [ text (translate model.language GridParameters) ]

        -- Grid Size
        , div [ class "form-group" ]
            [ div [ class "form-row" ]
                [ label
                    [ class "form-label"
                    , for "grid-size-slider"
                    ]
                    [ text (translate model.language GridSize) ]
                ]
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
            [ div [ class "form-row" ]
                [ label
                    [ class "form-label"
                    , for "grid-color-picker"
                    ]
                    [ text (translate model.language GridColor) ]
                ]
            , div [ class "input-with-text" ]
                [ input
                    [ type_ "color"
                    , id "grid-color-picker"
                    , value model.gridColor
                    , onInput GridColorChanged
                    , class "color-picker"
                    , Html.Attributes.attribute "aria-label" (translate model.language GridColor)
                    ]
                    []
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

        -- Grid Thickness
        , div [ class "form-group" ]
            [ div [ class "form-row" ]
                [ label
                    [ class "form-label"
                    , for "grid-thickness-slider"
                    ]
                    [ text (translate model.language GridThickness) ]
                ]
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
            [ div [ class "form-row" ]
                [ label
                    [ class "form-label"
                    , for "grid-opacity-slider"
                    ]
                    [ text (translate model.language GridOpacity) ]
                ]
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
        [ div [ class "preview-grid" ]
            [ viewSourceImageWindow model
            , viewGridPreviewWindow model
            ]
        ]


viewSourceImageWindow : Model -> Html Msg
viewSourceImageWindow model =
    div [ class "preview-window original-image-preview" ]
        [ div [ class "window-titlebar" ]
            [ span [ class "window-title" ] [ text (translate model.language OriginalImage) ]
            ]
        , div [ class "window-content" ]
            [ case model.uploadedImage of
                Just url ->
                    img
                        [ src url
                        , class "preview-image"
                        , on "load" (decodeImageSize ImageSizeLoaded)
                        ]
                        []

                Nothing ->
                    viewPlaceholder "↑" (translate model.language NoImageYet) (translate model.language UploadPlaceholder)
            ]
        ]


viewGridPreviewWindow : Model -> Html Msg
viewGridPreviewWindow model =
    div [ class "preview-window gridded-image-preview" ]
        [ div [ class "window-titlebar" ]
            [ span [ class "window-title" ] [ text (translate model.language GriddedImage) ]
            ]
        , div [ class "window-content" ]
            [ case model.uploadedImage of
                Just _ ->
                    viewGriddedImage model

                Nothing ->
                    viewPlaceholder "#" (translate model.language GriddedImage) (translate model.language GridPreviewPlaceholder)
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
                    (verticalLines ++ horizontalLines)
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
        { init = \() -> ( init, Cmd.none )
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
