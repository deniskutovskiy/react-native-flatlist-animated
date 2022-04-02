import React, { useState } from "react";
import {
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AnimatedFlatList from "react-native-flatlist-animated";
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { initialWindowMetrics } from "react-native-safe-area-context";

const avatars = {
  andy: require("./assets/andy.png"),
  avocado: require("./assets/avocado.png"),
  beer: require("./assets/beer.png"),
  cagri: require("./assets/cagri.png"),
  camera: require("./assets/camera.png"),
  can: require("./assets/can.png"),
  canga: require("./assets/canga.png"),
  charik: require("./assets/charik.png"),
  fuelTank: require("./assets/fuelTank.png"),
  guitar: require("./assets/guitar.png"),
  herman: require("./assets/herman.png"),
  honey: require("./assets/honey.png"),
  kiwi: require("./assets/kiwi.png"),
  smallTank: require("./assets/smallTank.png"),
  tennisBall: require("./assets/tennis_ball.png"),
  tuna: require("./assets/tuna.png"),
  wine: require("./assets/wine.png"),
};
export default function App() {
  const [ready, setReady] = useState(false);

  const cacheResourcesAsync = async () => {
    const cacheImages = Object.values(avatars).map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    await Promise.all(cacheImages);
  };

  const dataMap = [
    {
      key: "Andy",
      value: {
        description: "He is known with his fancy shoes.",
        avatar: avatars.andy,
      },
    },
    {
      key: "Çağrı",
      value: {
        description: "He is the healthy guy. He likes cats.",
        avatar: avatars.cagri,
      },
    },
    {
      key: "Can",
      value: {
        description: "He is an artistic guy. Not as much as Herman...",
        avatar: avatars.can,
      },
    },
    {
      key: "Herman",
      value: {
        description:
          "He is the best at everything in all categories across all planets...",
        avatar: avatars.herman,
      },
    },
    {
      key: "Tuna",
      value: {
        description: "He is carrying a machine gun!",
        avatar: avatars.tuna,
      },
    },
    {
      key: "Avocado",
      value: {
        description: "Çağrı's favorite meal.",
        avatar: avatars.avocado,
      },
    },
    {
      key: "Beer",
      value: {
        description: "Tuna cannot live without this.",
        avatar: avatars.beer,
      },
    },
    {
      key: "Camera",
      value: {
        description: "Çağrı likes to play with that.",
        avatar: avatars.camera,
      },
    },
    {
      key: "Canga",
      value: {
        description: "Andy can eat 30 canga bars at once.",
        avatar: avatars.canga,
      },
    },
    {
      key: "Charık",
      value: {
        description:
          "Here we go. Andy's favorite shoes. How did you find them?",
        avatar: avatars.charik,
      },
    },
    {
      key: "Fuel Tank",
      value: {
        description:
          "Dangerous, heavy and expensive. I wouldn't play with that.",
        avatar: avatars.fuelTank,
      },
    },
    {
      key: "Guitar",
      value: {
        description: "Can can make noise with this.",
        avatar: avatars.guitar,
      },
    },
    {
      key: "Honey",
      value: {
        description: "Herman's key of success at everything.",
        avatar: avatars.honey,
      },
    },
    {
      key: "Kiwi",
      value: {
        description: "Andy eats kiwi with it's skin. Isn't it disgusting?",
        avatar: avatars.kiwi,
      },
    },
    {
      key: "Small Tank",
      value: {
        description: "Fuel can also be used as a heat sink in an aircraft.",
        avatar: avatars.smallTank,
      },
    },
    {
      key: "Tennis Ball",
      value: {
        description: "I don't know what Herman does with that...",
        avatar: avatars.tennisBall,
      },
    },

    {
      key: "Wine",
      value: {
        description: "Tuna cannot live with this too...",
        avatar: avatars.wine,
      },
    },
  ];

  const [listData, setListData] = useState(dataMap.slice(0, 5));

  const handleAddItem = () => {
    if (listData.length === dataMap.length) return;

    let randomElement = dataMap[Math.floor(Math.random() * dataMap.length)];
    const listKeys = listData.map((item) => item.key);
    if (listKeys.includes(randomElement.key)) {
      return handleAddItem();
    } else {
      let newListData = [...listData];
      let randomPlace = Math.ceil(Math.random() * (listData.length - 1));
      newListData.splice(randomPlace, 0, randomElement);

      setListData(newListData);
    }
  };

  const handleDeleteItem = (index = null) => {
    if (listData.length === 0) return;
    if (typeof index !== "number") {
      index = Math.ceil(Math.random() * (listData.length - 1));
    }
    const newListData = listData.filter((item, idx) => idx !== index);
    setListData(newListData);
  };

  const handleReorderItem = () => {
    if (listData.length === 0) return;
    let randomIndex = Math.ceil(Math.random() * (listData.length - 1));
    const selectedItem = listData[randomIndex];

    const newListData = listData.filter((item, index) => index !== randomIndex);
    if (randomIndex > 1) {
      newListData.splice(randomIndex - 2, 0, selectedItem);
    } else {
      newListData.unshift(selectedItem);
    }
    setListData(newListData);
  };

  return !ready ? (
    <AppLoading
      startAsync={cacheResourcesAsync}
      onFinish={() => setReady(true)}
      onError={console.warn}
    />
  ) : (
    <View style={styles.container}>
      <AnimatedFlatList
        data={listData}
        bounces={false}
        style={{ width: "100%", paddingHorizontal: 10 }}
        ListHeaderComponent={() => (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handleAddItem}
            >
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handleDeleteItem}
            >
              <Text style={styles.buttonText}>Delete Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handleReorderItem}
            >
              <Text style={styles.buttonText}>Reorder Item</Text>
            </TouchableOpacity>
          </View>
        )}
        springConfig={{ damping: 12 }}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ flexGrow: 1 }}
        indicatorStyle={"black"}
        itemContainerHeight={80}
        renderItem={({ item, index }) => (
          <TouchableHighlight
            style={{ paddingVertical: 3 }}
            onPress={() => handleDeleteItem(index)}
            activeOpacity={1}
            underlayColor={"transparent"}
          >
            <View style={styles.itemContainer}>
              <View style={styles.avatarContainer}>
                <View style={styles.imageContainer}>
                  <Image source={item.value.avatar} style={styles.image} />
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>{item.key}</Text>
                <Text style={styles.descriptionText}>
                  {item.value.description}
                </Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: initialWindowMetrics.insets.top,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    height: 80,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 110,
    height: 45,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  itemContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  avatarContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    resizeMode: "cover",
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  textContainer: {
    flex: 0.8,
    alignItems: "flex-start",
    marginRight: 5,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "black",
  },
  descriptionText: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
    width: "100%",
    fontStyle: "italic",
  },
});

// const selectRandomElement = () => {
//   let randomElement = dataMap[Math.floor(Math.random() * dataMap.length)];
//   const listKeys = data.map((item) => item?.key);
//   if (listKeys.includes(randomElement.key)) {
//     return selectRandomElement();
//   } else {
//     return randomElement;
//   }
// };

// const shuffleListData = () => {
//   const newListData = dataMap
//     .map((value) => ({ value, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ value }) => value);
//   // let newListData = Array(20)
//   //   .fill(0)
//   //   .map(() => selectRandomElement());

//   setData(newListData);
// };

// const sameListData = () => {
//   setData([...data]);
// };

// const sameStyle = () => {
//   setStyle({ ...style });
// };

// const sameStyleAndData = () => {
//   setData([...data]);
//   // setStyle({...style, backgroundColor: "green"});
//   setStyle({ ...style });
// };

// const slightChange = () => {
//   const addIndex = Math.floor(Math.random() * dataMap.length);
//   const removeIndex = Math.floor(Math.random() * dataMap.length);

//   let newData = [...data];
//   newData.splice(addIndex, 0, {
//     value: data[removeIndex].value,
//     key: data[removeIndex].key,
//   });
//   newData = newData.filter((item, index) => index !== removeIndex);
//   setData(newData);
// };

// const [listIndex, setListIndex] = useState(1);

// const listData = useMemo(
//   () => ({
//     // 0: [
//     //   { value: "Şeyma", key: "ş" },
//     //   { value: "Onur", key: "o" },
//     //   { value: "Jüli", key: "j" },
//     //   { value: "Ahmet", key: "a" },
//     //   { value: "İbrahim", key: "i" },
//     // ],
//     // 1: [
//     //   { value: "Ahmet", key: "a" },
//     //   { value: "İbrahim", key: "i" },
//     //   { value: "Şeyma", key: "ş" },
//     //   { value: "Onur", key: "o" },
//     //   { value: "Jüli", key: "j" },
//     // ],
//     // 0: [
//     //   { value: "Jüli", key: "j" },
//     //   { value: "Onur", key: "o" },
//     //   { value: "Şeyma", key: "ş" },
//     //   { value: "Ahmet", key: "a" },
//     //   { value: "İbrahim", key: "i" },
//     // ],
//     // 1: [
//     //   { value: "Şeyma", key: "ş" },
//     //   { value: "İbrahim", key: "i" },
//     //   { value: "Jüli", key: "j" },
//     //   { value: "Ahmet", key: "a" },
//     //   { value: "Onur", key: "o" },
//     // ],
//     0: [
//       { value: "Şeyma", key: "ş" },
//       { value: "Onur", key: "o" },
//       { value: "Jüli", key: "j" },
//       { value: "Ahmet", key: "a" },
//       { value: "İbrahim", key: "i" },
//     ],
//     1: [
//       { value: "İbrahim", key: "i" },
//       { value: "Şeyma", key: "ş" },
//       { value: "Jüli", key: "j" },
//       { value: "Gizem", key: "g" },
//       { value: "Onur", key: "o" },
//     ],
//     // 0: [
//     //   { value: "Şeyma", key: "ş" },
//     //   { value: "Onur", key: "o" },
//     //   { value: "Jüli", key: "j" },
//     //   { value: "Ahmet", key: "a" },
//     //   { value: "İbrahim", key: "i" },
//     // ],
//     // 1: [
//     //   { value: "Şeyma", key: "ş" },
//     //   { value: "Onur", key: "o" },
//     //   { value: "Jüli", key: "j" },
//     //   { value: "İbrahim", key: "i" },
//     // ],
//   }),
//   []
// );

// const timer = useRef(null);

// useEffect(() => {
//   timer.current = setInterval(() => {
//     setListIndex((listIndex) => (listIndex === 1 ? 0 : 1));
//   }, 3000);
//   return () => {
//     clearInterval(timer.current);
//   };
// }, []);
