# Elm View Patterns in Gridit

This document maps common React/JSX component patterns to their Elm equivalents as implemented in the Gridit application.

## Basic Component Structure

### React Component vs Elm View Function

**React/JSX:**
```jsx
function Button({ onClick, disabled, children }) {
  return (
    <button 
      className="btn" 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

**Elm Equivalent:**
```elm
viewButton : Model -> Html Msg
viewButton model =
    button 
        [ class "btn"
        , onClick SomeMessage
        , disabled (model.someCondition)
        ] 
        [ text "Button Text" ]
```

## State Management

### React State vs Elm Model

**React/JSX:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Elm Equivalent:**
```elm
-- In the Model
type alias Model =
    { count : Int
    , -- other fields
    }

-- In the Msg type
type Msg
    = Increment
    | -- other messages

-- In the update function
update msg model =
    case msg of
        Increment ->
            ( { model | count = model.count + 1 }, Cmd.none )
        
        -- other cases

-- In the view
viewCounter : Model -> Html Msg
viewCounter model =
    div []
        [ p [] [ text ("Count: " ++ String.fromInt model.count) ]
        , button [ onClick Increment ] [ text "Increment" ]
        ]
```

## Conditional Rendering

### React Conditional vs Elm Conditional

**React/JSX:**
```jsx
function ConditionalComponent({ isVisible }) {
  return (
    <div>
      {isVisible ? (
        <p>This content is visible</p>
      ) : (
        <p>Alternative content</p>
      )}
    </div>
  );
}
```

**Elm Equivalent:**
```elm
viewConditional : Model -> Html Msg
viewConditional model =
    div []
        [ if model.isVisible then
            p [] [ text "This content is visible" ]
          else
            p [] [ text "Alternative content" ]
        ]
```

Another pattern used in Gridit:

```elm
viewMaybeContent : Model -> Html Msg
viewMaybeContent model =
    div []
        [ case model.maybeValue of
            Just value ->
                viewValue value
                
            Nothing ->
                viewPlaceholder
        ]
```

## List Rendering

### React List vs Elm List

**React/JSX:**
```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

**Elm Equivalent:**
```elm
viewItemList : List Item -> Html Msg
viewItemList items =
    ul []
        (List.map viewItem items)

viewItem : Item -> Html Msg
viewItem item =
    li [] [ text item.name ]
```

## Event Handling

### React Events vs Elm Messages

**React/JSX:**
```jsx
function FormComponent() {
  const [text, setText] = useState("");
  
  const handleChange = (e) => {
    setText(e.target.value);
  };
  
  return (
    <input 
      type="text" 
      value={text} 
      onChange={handleChange} 
    />
  );
}
```

**Elm Equivalent:**
```elm
-- In Msg type
type Msg
    = TextChanged String
    | -- other messages

-- In update
update msg model =
    case msg of
        TextChanged newText ->
            ( { model | text = newText }, Cmd.none )
        
        -- other cases

-- In view
viewInput : Model -> Html Msg
viewInput model =
    input 
        [ type_ "text"
        , value model.text
        , onInput TextChanged
        ] 
        []
```

## Props vs Parameters

In React, you pass props to child components. In Elm, you pass parameters to functions:

**React/JSX:**
```jsx
<ChildComponent 
  value={someValue}
  onAction={handleAction} 
/>
```

**Elm Equivalent:**
```elm
viewChildComponent model.someValue
```

## Responsive Patterns in Gridit

In Gridit, we use CSS media queries for responsive layouts, but conditionally render different layouts in Elm based on model flags like `drawerExpanded`:

```elm
viewSidebar : Model -> Html Msg
viewSidebar model =
    div [ class (if model.drawerExpanded then "sidebar expanded" else "sidebar") ]
        [ -- content
        ]
```

## Specific Gridit Component Mappings

Here are specific mappings of Gridit components to conceptual React components:

1. **App Container** (`view` function)
   - Similar to React's `<App>` root component

2. **Grid Preview Area** (`viewGridPreviewArea` function)
   - Similar to a stateful React component with conditional rendering

3. **Mobile Drawer** (`viewSidebar` with conditional classes)
   - Similar to a React component using state for expansion/collapse

4. **Upload Prompt** (`viewUploadPrompt`)
   - Similar to a React form component with callbacks

5. **Action Buttons** (`viewDesktopActions`, `viewMobileActions`)
   - Similar to React button group components with responsive visibility

This mapping should help when making future changes to adapt new UI patterns from React designs to Elm implementations.
