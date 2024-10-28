import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import Colors from "@constants/Colors";
import TopHeader from "@components/TopHeader";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { getFilterParams } from "reducers/selectors";
import { BaseApiService } from "@utils/BaseApiService";
import { LEADS_ENDPOINT } from "@utils/EndPointUtils";
import { hasInternetConnection } from "@utils/NetWork";
import LeadsCard from "./components/leadsCard";
import { useNavigation } from "@react-navigation/native";
import { LEADS_FORM } from "@navigation/ScreenNames";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const filterParams = useSelector(getFilterParams);
  const navigate = useNavigation();

  const fetchLeads = async () => {
    setLoading(true);
    let searchParameters = {
      limit: 0,
      offset: 0,
      ...filterParams,
    };

    const hasNet = await hasInternetConnection();

    if (hasNet === false) {
      setMessage("Cannot connect to the internet.");
      setLoading(false);
    } else {
      await new BaseApiService(LEADS_ENDPOINT)
        .getRequestWithJsonResponse(searchParameters)
        .then((response) => {
          setLeads(response.records);

          if (response.records.length === 0) {
            setMessage("No leads found.");
          }
          setLoading(false);
        })
        .catch((error) => {
          setMessage("Cannot get leads!");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <TopHeader title={"Leads"} showShopName={false} showMenuDots menuItems={[{name: 'Add Lead', onClick: () => navigate.navigate(LEADS_FORM)}]} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={leads}
          renderItem={({ item, i }) => (
            <LeadsCard item={item} key={i} data={item} />
          )}
          ListEmptyComponent={() => (
            <Text style={{ flex: 1, textAlign: "center", alignSelf: "center" }}>
              {message}
            </Text>
          )}
          onRefresh={() => {
            fetchLeads();
          }}
          refreshing={loading}
        />
      </SafeAreaView>
  );
};

export default Leads;
