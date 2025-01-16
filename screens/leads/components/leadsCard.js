import CardFooter from "@components/card_components/CardFooter";
import DataColumn from "@components/card_components/DataColumn";
import DataRow from "@components/card_components/DataRow";
import SalesTable from "@screens/sales_desk/components/SalesTable";
import { formatDate, formatNumberWithCommas } from "@utils/Utils";
import { memo, useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import LeadCardHeader from "./leadsCardHeader";
import { useSelector } from "react-redux";
import { getShops } from "duqactStore/selectors";
import { useNavigation } from "@react-navigation/native";
import { LEADS_FORM } from "@navigation/ScreenNames";

function LeadsCard({ data, print }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigation();

  const toggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  useEffect(() => {}, [data]);

  return (
    <View style={[styles.container]}>
      <LeadCardHeader data={data} expanded={expanded} />

      {!expanded && (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <DataColumn title={"Status"} value={data?.statusName} />

            <DataColumn title={"Source"} value={data?.source} />
            <DataColumn title={"Physical Address"} value={data?.physicalAddress} />
          </View>
        </>
      )}
      {expanded && (
        <View style={{ flex: 1, marginTop: 10 }}>
          {data?.shopName && (
            <DataRow key={1} label={"Shop Name"} value={data.shopName} labelTextStyle={styles.label} style={{ marginTop: 5 }} valueTextStyle={styles.value} />
          )}

          {data?.firstName && (
            <DataRow key={2} label={"Name"} value={data.firstName + " " + data.lastName} labelTextStyle={styles.label} valueTextStyle={styles.value} />
          )}

          {data?.phone && <DataRow key={6} label={"Phone"} value={data.phone} labelTextStyle={styles.label} valueTextStyle={styles.value} />}

          {data?.email && (
            <DataRow key={7} label={"Email"} value={data.email} labelTextStyle={styles.label} valueTextStyle={styles.value} style={{ marginBottom: 10 }} />
          )}

          {data?.statusName && <DataRow key={3} label={"Status"} value={data.statusName} labelTextStyle={styles.label} valueTextStyle={styles.value} />}

          {data?.stageName && <DataRow key={4} label={"Stage"} value={data.stageName} labelTextStyle={styles.label} valueTextStyle={styles.value} />}

          {data?.source && <DataRow key={5} label={"Source"} value={data.source} labelTextStyle={styles.label} valueTextStyle={styles.value} />}

          {data?.remark && (
            <View>
              <Text style={{ fontWeight: 600 }}>Remark</Text>
              <Text numberOfLines={1}>{data?.remark}</Text>
            </View>
          )}
        </View>
      )}

      <CardFooter
        onClick2={toggleExpand}
        btnTitle1={expanded ? "Edit" : null}
        label={data?.createdByFullName}
        entered
        darkMode={!expanded}
        btnTitle2={expanded ? "Hide" : "More"}
        onClick1={() => navigate?.navigate(LEADS_FORM, data)}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

export default memo(LeadsCard);
const styles = StyleSheet.create({
  label: {
    fontWeight: "400",
    fontSize: 14,
  },
  value: { fontWeight: "600", fontSize: 14 },
  footerText1: {
    fontWeight: "600",
    fontSize: 12,
  },
  footerText2: {
    fontWeight: "300",
    fontSize: 12,
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 3,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
