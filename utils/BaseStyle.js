import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export const BaseStyle = StyleSheet.create({
  shadowedContainer: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    marginVertical: 10,
    backgroundColor: Colors.light,
    elevation: 5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    borderRadius: 8,
  },
  container: {
    marginHorizontal: 5,
    paddingHorizontal: 5,
    marginVertical: 10,
    backgroundColor: Colors.light,
  },
  card: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 10,
    elevation: 1,
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    gap: 10,
    marginBottom: 10,
  },
});
