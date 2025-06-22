module I18n exposing (Language(..), TranslationKey(..), translate)

-- LANGUAGE TYPE


type Language
    = English
    | Spanish
    | Latin
    | Italian
    | Portuguese
    | French
    | Asturiano
    | Gaelic
    | Euskara
    | Japanese



-- TRANSLATION KEYS
-- Define all the text keys used in the application


type TranslationKey
    = AppTitle
    | UploadImage
    | CustomizeIt
    | GridSize
    | Rectangles
    | GridColor
    | GridThickness
    | GridOpacity
    | OriginalImage
    | GriddedImage
    | DownloadGriddedImage
    | Nice
    | NiceCounter
    | NoImageYet
    | LanguageLabel



-- TRANSLATIONS
-- Dictionary of all translations


translations : Language -> TranslationKey -> String
translations language key =
    case language of
        English ->
            englishTranslations key

        Spanish ->
            spanishTranslations key

        Latin ->
            latinTranslations key

        Italian ->
            italianTranslations key

        Portuguese ->
            portugueseTranslations key

        French ->
            frenchTranslations key

        Asturiano ->
            asturianoTranslations key

        Gaelic ->
            gaelicTranslations key

        Euskara ->
            euskaraTranslations key

        Japanese ->
            japaneseTranslations key



-- ENGLISH TRANSLATIONS


englishTranslations : TranslationKey -> String
englishTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Upload Image"

        CustomizeIt ->
            "Customize it!"

        GridSize ->
            "Grid Size: "

        Rectangles ->
            " rectangles."

        GridColor ->
            "Grid Color: "

        GridThickness ->
            "Grid Thickness: "

        GridOpacity ->
            "Grid Opacity: "

        OriginalImage ->
            "Original Image"

        GriddedImage ->
            "Gridded Image"

        DownloadGriddedImage ->
            "Download your Gridded Image!!!"

        Nice ->
            "Nice! "

        NiceCounter ->
            "Nice Counter: "

        NoImageYet ->
            "No image yet! Click Upload Image to begin!"

        LanguageLabel ->
            "Language:"



-- SPANISH TRANSLATIONS


spanishTranslations : TranslationKey -> String
spanishTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Subir una Imagen"

        CustomizeIt ->
            "Personalizá la grilla"

        GridSize ->
            "Tamaño de la grilla: "

        Rectangles ->
            " rectángulos."

        GridColor ->
            "Color de la grilla: "

        GridThickness ->
            "Grosor de las líneas de la grilla: "

        GridOpacity ->
            "Opacidad de la grilla: "

        OriginalImage ->
            "Imagen Original"

        GriddedImage ->
            "Imagen con Grilla"

        DownloadGriddedImage ->
            "Descargá la imagen grillada!"

        Nice ->
            "Magnífico"

        NiceCounter ->
            "Contador de Magníficos: "

        NoImageYet ->
            "Todavía no hay nada! Click en subir una Imagen para empezar!"

        LanguageLabel ->
            "Idioma:"



-- LATIN TRANSLATIONS


latinTranslations : TranslationKey -> String
latinTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Imago Mittere"

        CustomizeIt ->
            "Personaliza!"

        GridSize ->
            "Magnitudinem Retis: "

        Rectangles ->
            " rectangula."

        GridColor ->
            "Color Retis: "

        GridThickness ->
            "Crassitudo Retis: "

        GridOpacity ->
            "Opacitas Retis: "

        OriginalImage ->
            "Imago Originalis"

        GriddedImage ->
            "Imago cum Rete"

        DownloadGriddedImage ->
            "Imago cum Rete Descende!"

        Nice ->
            "Bellus! "

        NiceCounter ->
            "Numerator Bellus: "

        NoImageYet ->
            "Nulla imago adhuc! Preme Imago Mittere ad incipiendum!"

        LanguageLabel ->
            "Lingua:"



-- ITALIAN TRANSLATIONS


italianTranslations : TranslationKey -> String
italianTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Carica Immagine"

        CustomizeIt ->
            "Personalizzalo!"

        GridSize ->
            "Dimensione Griglia: "

        Rectangles ->
            " rettangoli."

        GridColor ->
            "Colore Griglia: "

        GridThickness ->
            "Spessore Griglia: "

        GridOpacity ->
            "Opacità Griglia: "

        OriginalImage ->
            "Immagine Originale"

        GriddedImage ->
            "Immagine con Griglia"

        DownloadGriddedImage ->
            "Scarica la tua Immagine con Griglia!"

        Nice ->
            "Bello! "

        NiceCounter ->
            "Contatore Bello: "

        NoImageYet ->
            "Nessuna immagine ancora! Clicca su Carica Immagine per iniziare!"

        LanguageLabel ->
            "Lingua:"



-- PORTUGUESE TRANSLATIONS


portugueseTranslations : TranslationKey -> String
portugueseTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Carregar Imagem"

        CustomizeIt ->
            "Personalize!"

        GridSize ->
            "Tamanho da Grade: "

        Rectangles ->
            " retângulos."

        GridColor ->
            "Cor da Grade: "

        GridThickness ->
            "Espessura da Grade: "

        GridOpacity ->
            "Opacidade da Grade: "

        OriginalImage ->
            "Imagem Original"

        GriddedImage ->
            "Imagem com Grade"

        DownloadGriddedImage ->
            "Baixe sua Imagem com Grade!"

        Nice ->
            "Legal! "

        NiceCounter ->
            "Contador Legal: "

        NoImageYet ->
            "Ainda não há imagem! Clique em Carregar Imagem para começar!"

        LanguageLabel ->
            "Lingua:"



-- FRENCH TRANSLATIONS


frenchTranslations : TranslationKey -> String
frenchTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Télécharger une Image"

        CustomizeIt ->
            "Personnalisez-le!"

        GridSize ->
            "Taille de la Grille: "

        Rectangles ->
            " rectangles."

        GridColor ->
            "Couleur de la Grille: "

        GridThickness ->
            "Épaisseur de la Grille: "

        GridOpacity ->
            "Opacité de la Grille: "

        OriginalImage ->
            "Image Originale"

        GriddedImage ->
            "Image avec Grille"

        DownloadGriddedImage ->
            "Téléchargez votre Image avec Grille!"

        Nice ->
            "Sympa! "

        NiceCounter ->
            "Compteur Sympa: "

        NoImageYet ->
            "Pas encore d'image! Cliquez sur Télécharger une Image pour commencer!"

        LanguageLabel ->
            "Langue:"



-- ASTURIANO TRANSLATIONS


asturianoTranslations : TranslationKey -> String
asturianoTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Xubir Imaxe"

        CustomizeIt ->
            "¡Personalízalu!"

        GridSize ->
            "Tamañu de la Cuadrícula: "

        Rectangles ->
            " rectángulos."

        GridColor ->
            "Color de la Cuadrícula: "

        GridThickness ->
            "Grosor de la Cuadrícula: "

        GridOpacity ->
            "Opacidá de la Cuadrícula: "

        OriginalImage ->
            "Imaxe Orixinal"

        GriddedImage ->
            "Imaxe con Cuadrícula"

        DownloadGriddedImage ->
            "¡Descarga la to Imaxe con Cuadrícula!"

        Nice ->
            "¡Guapu! "

        NiceCounter ->
            "Contador Guapu: "

        NoImageYet ->
            "¡Entá nun hai imaxe! ¡Fai clic en Xubir Imaxe pa entamar!"

        LanguageLabel ->
            "Llingua:"



-- GAELIC TRANSLATIONS


gaelicTranslations : TranslationKey -> String
gaelicTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Luchdaich Dealbh"

        CustomizeIt ->
            "Gnàthaich e!"

        GridSize ->
            "Meud a' Ghriod: "

        Rectangles ->
            " ceart-chearnagan."

        GridColor ->
            "Dath a' Ghriod: "

        GridThickness ->
            "Tiughad a' Ghriod: "

        GridOpacity ->
            "Dorchadas a' Ghriod: "

        OriginalImage ->
            "Dealbh Tùsail"

        GriddedImage ->
            "Dealbh le Griod"

        DownloadGriddedImage ->
            "Luchdaich sìos do Dhealbh le Griod!"

        Nice ->
            "Sgoinneil! "

        NiceCounter ->
            "Cunntair Sgoinneil: "

        NoImageYet ->
            "Chan eil dealbh ann fhathast! Cliog air Luchdaich Dealbh gus tòiseachadh!"

        LanguageLabel ->
            "Cànan:"



-- EUSKARA TRANSLATIONS


euskaraTranslations : TranslationKey -> String
euskaraTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "Irudia Igo"

        CustomizeIt ->
            "Pertsonalizatu!"

        GridSize ->
            "Sareta Tamaina: "

        Rectangles ->
            " laukizuzenak."

        GridColor ->
            "Sareta Kolorea: "

        GridThickness ->
            "Sareta Lodiera: "

        GridOpacity ->
            "Sareta Opakutasuna: "

        OriginalImage ->
            "Jatorrizko Irudia"

        GriddedImage ->
            "Saretadun Irudia"

        DownloadGriddedImage ->
            "Zure Saretadun Irudia Deskargatu!"

        Nice ->
            "Bikain! "

        NiceCounter ->
            "Bikain Kontagailua: "

        NoImageYet ->
            "Oraindik ez dago irudirik! Egin klik Irudia Igo botoian hasteko!"

        LanguageLabel ->
            "Hizkuntza:"



-- JAPANESE TRANSLATIONS


japaneseTranslations : TranslationKey -> String
japaneseTranslations key =
    case key of
        AppTitle ->
            "Gridit! 🐸"

        UploadImage ->
            "画像をアップロード"

        CustomizeIt ->
            "カスタマイズしよう！"

        GridSize ->
            "格子サイズ: "

        Rectangles ->
            " 長方形"

        GridColor ->
            "格子の色: "

        GridThickness ->
            "格子の太さ: "

        GridOpacity ->
            "格子の透明度: "

        OriginalImage ->
            "元の画像"

        GriddedImage ->
            "格子付き画像"

        DownloadGriddedImage ->
            "格子付き画像をダウンロード！"

        Nice ->
            "素晴らしい！ "

        NiceCounter ->
            "素晴らしいカウンター: "

        NoImageYet ->
            "まだ画像がありません！画像をアップロードボタンをクリックして始めましょう！"

        LanguageLabel ->
            "言語:"



-- TRANSLATE FUNCTION
-- Helper function to get a translation for the current language


translate : Language -> TranslationKey -> String
translate language key =
    translations language key
