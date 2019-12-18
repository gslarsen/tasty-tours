import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Button,
  ImageBackground,
  Image
} from "react-native";
import ViewMoreText from "react-native-view-more-text";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import LocationHeader from "../components/LocationHeader";
import HeaderButton from "../components/HeaderButton";
import { TOURS } from "../data/data";
import Colors from "../constants/Colors";

const LocationDetailsScreen = props => {
  // console.log('PROPS :', props);
  const tourId = props.navigation.getParam("tourId");
  const locName = props.navigation.getParam("name");
  const place_id = props.navigation.getParam("place_id");

  const renderViewMore = onPress => {
    return <Text onPress={onPress}>View more</Text>;
  };

  const renderViewLess = onPress => {
    return <Text onPress={onPress}>View less</Text>;
  };

  const renderListItem = data => {
    const tour = TOURS.find(item => item.id === tourId);
    const location = tour.locations.find(
      location => location.locationName === locName
    );
    console.log(location.image);
    return (
      <View>
        <Image style={styles.image} source={{ uri: location.image }} />
        <LocationHeader place_id={place_id} />
        <View style={styles.summary}>
          <ViewMoreText
            numberOfLines={13}
            renderViewMore={this.renderViewMore}
            renderViewLess={this.renderViewLess}
            textStyle={{}}
          >
            <Text style={styles.text}>{location.summary}</Text>
          </ViewMoreText>
        </View>

        <Link toRoute={location.menu}>Menu</Link>
        
      </View>
    );
  };

  return (
    <FlatList
      keyExtractor={(item, idx) => item.id}
      data={TOURS}
      renderItem={renderListItem}
      numColumns={1}
    />
  );
};

LocationDetailsScreen.navigationOptions = navData => {
  // console.log('NAV OPTIONS:', navData.navigation.getParam('name'))
  const locName = navData.navigation.getParam("name");

  return {
    headerTitle: `${locName}`,
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
  summary: {
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10
  },
  text: {
    fontFamily: "open-sans",
    textAlign: "justify"
  },
  image: {
    marginTop: 10,
    width: 400,
    height: 200,
    borderRadius: 10,
    marginLeft: 6
  }
});

export default LocationDetailsScreen;
