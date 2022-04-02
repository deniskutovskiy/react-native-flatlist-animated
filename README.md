# react-native-flatlist-animated
Animated FlatList component that supports entering, exiting and reordering animations.
# Installation
`npm i react-native-flatlist-animated`

# Demo
Supports `zoom`, `fade` and `slide` animations for enterance and exit.

![zoom](https://user-images.githubusercontent.com/87723231/161383297-f2d46059-ce73-4b72-b04f-a6612a848b0a.gif)
![slide](https://user-images.githubusercontent.com/87723231/161383344-963449ce-a1cf-494d-905e-2af3fd3cb341.gif)

# Key Advantages
- No animation on layout properties (better performance)
- Handles unmounting and mounting animations
- Handles list re-ordering
- Native driver is used in all animations
- Supports React Native FlatList props
- JavaScript only implementation
- Fully typed

# Usage
```ts
import { Text, View } from "react-native";
import AnimatedFlatList from "react-native-flatlist-animated";

const listData = [
  { key: "item1", value: "ITEM-1" },
  { key: "item2", value: "ITEM-2" },
];

() => (
  <AnimatedFlatList
    data={listData}
    style={{ width: "100%" }}
    itemContainerHeight={50}
    renderItem={({ item, _index }) => (
      <View style={{ width: "100%", height: "100%" }}>
        <Text>{item.value}</Text>
      </View>
    )}
  />
);

```

# Properties
- Any [FlatList property.](https://reactnative.dev/docs/flatlist#props)
- The following properties are supported.

| Property | Description  | Default  |
| ------- | --- | --- |
| `itemContainerHeight` | Required. Height of a single list item. | `-` |
| `entering` | Optional. Animation selection for entering phase. | `zoomIn` |
| `exiting` | Optional. Animation selection for exiting phase. | `zoomOut` |
| `transition` | Optional. Animation selection for layout transitions. | `spring` |
| `reordering` | Optional. Animation selection for items that are moved up in the list. | `translateOnly` |
| `timingConfig` | Optional. Animation configuration for transitions. Requires `transition="timing"`. | Default timing config in Animated API. Note that below props will be overwritten: `toValue: 1`, `duration: depends`, `delay: depends`, `useNativeDriver: true`  |
| `springConfig` | Optional. Animation configuration for transitions. Requires `transition="spring"`. | Default spring config in Animated API. Note that below props will be overwritten: `toValue: 1`, `delay: depends`, `useNativeDriver: true` |
| `enterDuration` | Optional. Duration of entering animation in milliseconds. | `250` |
| `exitDuration` | Optional. Duration of exiting animation in milliseconds. | `250` |
| `horizontalSlideRange` | Optional. The initial or final position to be used in sliding type animations. | screen width |


# Examples
Check full example in the `Example` folder.
- Click on the items to remove them from the list.
- Press `Add Item` to add random entry from the map.
- Press `Delete Item` to remove a random entry from the list.
- Press `Reorder Item` to pick a random entry and change its position randomly.

**Note:** The assets used in the example app represent imaginary characters but influenced by real friendship. I have used Aseprite for pixel art.

