import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/Colors";
import MapHeader from "../components/MapHeader";
import ENV from "../env";

const TourDetailsScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [tour, setTour] = useState([]);
  const [initialLocCoords, setCoords] = useState({});
  const [tourLocations, setTourLocations] = useState([]);

  const tourId = props.navigation.getParam("id");
  const locName = props.navigation.getParam("name");

  useEffect(() => {
    fetch(`${ENV.hostURL}/tours`)
      .then(response => response.json())
      .then(responseJson => {        
        setTour(responseJson.tours.find(item => item._id === tourId));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    fetch(`${ENV.hostURL}/locations`)
      .then(response => response.json())
      .then(responseJson => {
        let locations = responseJson.locations.filter(item => item.tourId.includes(tourId));
        
        setTourLocations(locations);
        setCoords(locations[0].coordinates);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderListItem = data => {

    return (
      <View key={data.item.locationName} style={styles.tourItem}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("LocationDetails", {
              tourId,
              name: data.item.locationName,
              place_id: data.item.place_id,
              menu: data.item.menu,
              summary: data.item.summary,
              image: data.item.image
            })
          }
        >
          <View>
            <View style={{ ...styles.tourRow, ...styles.tourHeader }}>
              <ImageBackground
                source={{ uri: data.item.image }}
                style={styles.image}
              >
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{data.item.locationName}</Text>
                </View>
              </ImageBackground>
            </View>
            <View>
              <View style={{ ...styles.tourRow, ...styles.tourDetail }}>
                <Text>{data.item.address.match(/^(.+?),/)[1]}</Text>
                <Text>{data.item.phone}</Text>
              </View>
              <View
                style={{
                  ...styles.tourRow,
                  paddingHorizontal: 10,
                  textAlign: "justify"
                }}
              >
                <Text numberOfLines={4}>{data.item.summary}</Text>
                <Text></Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    return (
      <View style={styles.list}>
        <FlatList
          keyExtractor={(item, idx) => item._id}
          data={tourLocations}
          renderItem={renderListItem}
          numColumns={1}
          ListHeaderComponent={
            <MapHeader
              style={styles.map}
              location={initialLocCoords}
              onPress={() => {
                props.navigation.navigate("MapDynamic", {
                  name: locName,
                  tourLocations
                });
              }}
            />
          }
        />
      </View>
    );
  }
};

TourDetailsScreen.navigationOptions = navData => {
  const tourName = navData.navigation.getParam("name");

  return {
    headerTitle: `${tourName} Stops`,
    headerStyle: {
      backgroundColor: Platform.OS === "android" ? Colors.primaryColor : ""
    },
    headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor,
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Home"
          iconName="md-home"
          onPress={() => {
            navData.navigation.navigate("Cities");
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  tourItem: {
    height: 225,
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10
  },
  tourRow: {
    flexDirection: "row"
  },
  tourHeader: {
    height: "50%"
  },
  tourDetail: {
    paddingTop: 5,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "25%",
    paddingBottom: 10
  },
  titleContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 30,
    color: "white",
    textAlign: "center"
  },
  image: {
    width: "100%",
    height: 115,
    justifyContent: "center"
  },
  list: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15
  },
  map: {
    marginBottom: 10,
    width: "100%",
    height: 75,
    borderColor: "#ccc",
    borderWidth: 1
  }
});

export default TourDetailsScreen;
