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
        [ viewHeader model
        , div [ class "main-content" ]
            [ viewLeftColumn model
            , viewCenterColumn model
            , viewRightColumn model
            ]
        , viewFooter model
        , input
            [ type_ "file"
            , id "file-input"
            , class "hidden-file-input"
            , Html.Attributes.attribute "accept" "image/*"
            ]
            []
        ]



-- VIEW COMPONENTS


viewHeader : Model -> Html Msg
viewHeader model =
    div [ class "app-header" ]
        [ div [ class "header-content" ]
            [ h1 [ class "app-title" ] [ text "Gridit Baby! 🐸" ]
            , p [ class "app-subtitle" ] [ text (translate model.language AppSubtitle) ]
            ]
        , viewLanguageSelector model.language
        ]


-- Left Column with What's This About and Upload Image


viewLeftColumn : Model -> Html Msg
viewLeftColumn model =
    div [ class "left-column" ]
        [ viewWhatsThisAbout model
        , viewUploadCard model
        ]


viewWhatsThisAbout : Model -> Html Msg
viewWhatsThisAbout model =
    div [ class "card about-card" ]
        [ h2 [ class "card-title" ] [ text ("🐸 " ++ translate model.language WhatsGridit) ]
        , p [ class "card-text" ] [ text (translate model.language WhatsThisDescription) ]
        ]


viewUploadCard : Model -> Html Msg
viewUploadCard model =
    div [ class "card" ]
        [ div [ class "step-indicator" ]
            [ span [ class "step-badge" ] [ text "1" ]
            , span [ class "step-title" ] [ text (translate model.language UploadImage) ]
            ]
        , button
            [ class "button button-upload"
            , onClick PickImage
            ]
            [ text (translate model.language ChooseFile ++ " 📷") ]
        , p [ class "card-text-small" ]
            [ text (translate model.language MaxFileSize ++ " • " ++ translate model.language SupportedFormats) ]
        ]



-- Center Column with Preview and Grid Controls


viewCenterColumn : Model -> Html Msg
viewCenterColumn model =
    div [ class "center-column" ]
        [ viewGridPreview model
        , viewGridControlsCard model
        ]


viewGridPreview : Model -> Html Msg
viewGridPreview model =
    div [ class "preview-card" ]
        [ case model.uploadedImage of
            Just url ->
                viewGriddedImage model

            Nothing ->
                div [ class "preview-placeholder" ]
                    [ Svg.svg
                        [ SvgAttr.class "placeholder-grid-background"
                        , SvgAttr.width "100%"
                        , SvgAttr.height "100%"
                        , SvgAttr.preserveAspectRatio "xMidYMid slice"
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
                        [ span [ class "placeholder-icon" ] [ text ":)" ]
                        , p [ class "placeholder-text" ] [ text (translate model.language UploadPlaceholder) ]
                        ]
                    ]
        ]


viewGridControlsCard : Model -> Html Msg
viewGridControlsCard model =
    div [ class "card" ]
        [ div [ class "step-indicator" ]
            [ span [ class "step-badge" ] [ text "2" ]
            , span [ class "step-title" ] [ text (translate model.language GridSettings) ]
            ]
        , div [ class "grid-controls-grid" ]
            [ -- Size control
              div [ class "control-group" ]
                [ div [ class "control-header" ]
                    [ label [ class "control-label" ] [ text (translate model.language GridSize) ]
                    , span [ class "control-value" ] [ text (String.fromInt model.gridSize ++ "x" ++ String.fromInt model.gridSize) ]
                    ]
                , input
                    [ type_ "range"
                    , Html.Attributes.min "2"
                    , Html.Attributes.max "32"
                    , value (String.fromInt model.gridSize)
                    , onInput (\s -> GridSizeChanged (Maybe.withDefault 10 (String.toInt s)))
                    , class "slider"
                    ]
                    []
                ]

            -- Opacity control
            , div [ class "control-group" ]
                [ div [ class "control-header" ]
                    [ label [ class "control-label" ] [ text (translate model.language GridOpacity) ]
                    , span [ class "control-value" ] [ text (String.fromInt (round (model.gridOpacity * 100)) ++ "%") ]
                    ]
                , input
                    [ type_ "range"
                    , Html.Attributes.min "0.1"
                    , Html.Attributes.max "1"
                    , step "0.1"
                    , value (String.fromFloat model.gridOpacity)
                    , onInput (\s -> GridOpacityChanged (Maybe.withDefault 0.5 (String.toFloat s)))
                    , class "slider"
                    ]
                    []
                ]

            -- Thickness control
            , div [ class "control-group" ]
                [ div [ class "control-header" ]
                    [ label [ class "control-label" ] [ text (translate model.language GridThickness) ]
                    , span [ class "control-value" ] [ text (String.fromInt model.gridThickness ++ "px") ]
                    ]
                , input
                    [ type_ "range"
                    , Html.Attributes.min "1"
                    , Html.Attributes.max "5"
                    , value (String.fromInt model.gridThickness)
                    , onInput (\s -> GridThicknessChanged (Maybe.withDefault 1 (String.toInt s)))
                    , class "slider"
                    ]
                    []
                ]

            -- Color control
            , div [ class "control-group" ]
                [ div [ class "control-header" ]
                    [ label [ class "control-label" ] [ text (translate model.language GridColor) ]
                    , div
                        [ class "color-preview"
                        , style "background-color" model.gridColor
                        ]
                        []
                    ]
                , input
                    [ type_ "color"
                    , value model.gridColor
                    , onInput GridColorChanged
                    , class "color-input"
                    ]
                    []
                ]

            -- Diagonal toggle
            , div [ class "toggle-row" ]
                [ input
                    [ type_ "checkbox"
                    , Html.Events.onCheck ToggleDiagonals
                    , Html.Attributes.checked model.showDiagonals
                    , class "toggle-checkbox"
                    , id "diagonals"
                    ]
                    []
                , label [ class "toggle-label", for "diagonals" ] [ text (translate model.language DiagonalGrid) ]
                ]
            ]
        ]


-- Right Column with Actions and Scores


viewRightColumn : Model -> Html Msg
viewRightColumn model =
    div [ class "right-column" ]
        [ div [ class "card download-card" ]
            [ div [ class "step-indicator" ]
                [ span [ class "step-badge" ] [ text "3" ]
                , span [ class "step-title" ] [ text (translate model.language DownloadGriddedImage) ]
                ]
            , button
                [ class "button button-primary button-download"
                , onClick DownloadClicked
                , disabled (model.uploadedImage == Nothing)
                ]
                [ span [ class "button-icon" ] [ text "⬇️" ]
                , text (translate model.language DownloadGriddedImage)
                ]
            ]
        , div [ class "nice-section" ]
            [ button
                [ class "button button-nice"
                , onClick NiceButtonClicked
                ]
                [ span [ class "button-icon" ] [ text "♡" ]
                , text (translate model.language Nice)
                ]
            , if model.niceCounter > 0 then
                span [ class "nice-counter" ] [ text ("×" ++ String.fromInt model.niceCounter) ]
              else
                text ""
            ]
        ]


viewFooter : Model -> Html Msg
viewFooter model =
    div [ class "app-footer" ]
        [ div [ class "footer-content" ]
            [ div [ class "tooltip-container" ]
                [ span [ class "footer-text-main" ] [ text (translate model.language MadeInArgentina ++ " 💚 (╹◡╹๑)") ]
                , span [ class "tooltip-content" ] [ text (translate model.language FooterTooltip) ]
                ]
            ]
        ]



-- LANGUAGE SELECTOR HELPERS


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
        -- Compact option shows flag + 2-letter code
        languageOption language displayName code =
            option
                [ value (languageToString language)
                , selected (currentLanguage == language)
                , Html.Attributes.attribute "aria-label" displayName
                ]
                [ text (languageFlag language ++ String.toUpper code) ]

        handleLanguageChange value =
            LanguageChanged (parseLanguage value)

        _ =
            debug ("lang:" ++ languageToCode currentLanguage)
    in
    div [ class "language-selector compact" ]
        [ span [ class "globe-icon" ] [ text "🌐" ]
        , label
            [ for "language-select"
            , class "sr-only"
            ]
            [ text (translate currentLanguage LanguageLabel) ]
        , select
            [ id "language-select"
            , on "change" (Json.Decode.map handleLanguageChange (Json.Decode.at [ "target", "value" ] Json.Decode.string))
            , class "language-dropdown compact"
            , Html.Attributes.attribute "aria-label" (translate currentLanguage LanguageLabel)
            ]
            [ languageOption English "English" "en"
            , languageOption Spanish "Español" "es"
            , languageOption Latin "Latin" "la"
            , languageOption Italian "Italiano" "it"
            , languageOption Portuguese "Português" "pt"
            , languageOption French "Français" "fr"
            , languageOption Asturiano "Asturianu" "ast"
            , languageOption Gaelic "Gàidhlig" "gd"
            , languageOption Euskara "Euskara" "eu"
            , languageOption Japanese "日本語" "ja"
            , languageOption Russian "Русский" "ru"
            , languageOption Tuvan "Тыва дыл" "tyv"
            , languageOption Amharic "አማርኛ" "am"
            , languageOption Hebrew "עברית" "he"
            ]
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
                    ]
                    []
                , Svg.svg
                    [ SvgAttr.width (String.fromInt width)
                    , SvgAttr.height (String.fromInt height)
                    , SvgAttr.viewBox ("0 0 " ++ String.fromInt width ++ " " ++ String.fromInt height)
                    , SvgAttr.class "grid-overlay"
                    ]
                    gridLines
                ]

        ( Just url, _, _ ) ->
            -- Image is loading, show it to trigger onload and get dimensions
            div [ class "gridded-image-container" ]
                [ img
                    [ src url
                    , class "gridded-base-image loading"
                    , on "load" (decodeImageSize ImageSizeLoaded)
                    ]
                    []
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
