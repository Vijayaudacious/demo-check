import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 20,
  },
  viewer: {
    width: "100%",
    height: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    width: 100,
  },
  table: {
    // @ts-ignore
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  totalTableCol: {
    width: "66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
  earning: {
    marginTop: 50,
    marginBottom: 10,
  },
  finalAmount: {
    marginTop: 20,
    fontSize: 15,
  },
  employeeDetails: {
    marginTop: 20,
  },
  noData: {
    textAlign: "center",
    fontSize: 10,
  },
  column: {
    fontFamily: "Courier-Bold",
    margin: "auto",
    marginTop: 3,
    fontSize: 11,
  },
  total: {
    margin: "auto",
    fontSize: 11,
    fontFamily: "Courier-Bold",
  },
});
