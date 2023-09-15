import React, { useEffect, useState } from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer'

import EventEQLogo from '../../../../src/assets/EventEQ.png'

import path from '../../utils/path'

const tailwindStyles = {
  textBase: { fontSize: 12 }, // Tailwind's base text size
  textLg: { fontSize: 16 }, // Tailwind's large text size
  fontBold: { fontWeight: 'bold' }
  // ... Add more mappings as needed
}

// Register font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Regular.ttf'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Bold.ttf',
      fontWeight: 'bold'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Italic.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-BoldItalic.ttf',
      fontWeight: 'bold',
      fontStyle: 'italic'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Light.ttf',
      fontWeight: 'light'
    },
    {
      src: '../../../../src/assets/fonts/Roboto/Roboto-Medium.ttf',
      fontWeight: 'medium'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    fontFamily: 'Roboto'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  logo: {
    width: 70,
    height: 70
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  infoText: {
    flex: 1,
    textAlign: 'left',
    fontSize: 12
  },
  table: {
    display: 'table',
    width: '100%',
    fontSize: 12,
    marginBottom: 10
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 5
  },
  rightSection: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12
  },
  rightContainer: {
    width: '100%' // Adjust the width as needed
  },
  totalRow: {
    flexDirection: 'row',
    marginTop: 10
  },
  totalLabel: {
    flex: 1,
    fontWeight: 'bold'
  },
  totalValue: {
    flex: 1,
    textAlign: 'right'
  },
  thankYou: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center'
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  label: {
    fontWeight: 'bold'
  }
})

export default function BookingReceipt () {
  // Extract the bookingId from the URL
  const pathParts = window.location.pathname.split('/')
  const bookingId = pathParts[pathParts.indexOf('booking') + 1]

  const [data, setData] = useState({})

  useEffect(() => {
    const getData = async () => {
      fetch(
        path.url + 'api/booking/receipt/' + bookingId
      )
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setData(data)
          }
        })
    }
    getData()
  }, [bookingId])

  return (
    <Document
      title="EventEQ Booking Receipt"
      subject={'EventEQ-Booking-' + bookingId}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image src={EventEQLogo} style={styles.logo} />
            <Text style={styles.title}>Receipt</Text>
          </View>

          {data && data.Booking ? (
            <View
              style={[
                {
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  fontSize: 12,
                  marginBottom: 10,
                  marginTop: 10
                }
              ]}
            >
              {/* <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Booking ID:
                </Text>{' '}
                {data.Booking.Id}
              </Text> */}
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Created Date:
                </Text>{' '}
                {new Date(data.Booking.CreatedAt).toLocaleString('en-MY', {
                  timeZone: 'Asia/Kuala_Lumpur',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </Text>
              <Text>
                <Text
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  Booking Date:
                </Text>{' '}
                {data.Booking.StartDate}
                {' - '}
                {data.Booking.EndDate}
              </Text>
            </View>
          ) : (
            <Text>No booking found</Text>
          )}

          {/* From and To Info */}
          {data && data.Owner && data.Renter ? (
            <View style={styles.infoContainer}>
              <View style={styles.infoText}>
                <Text style={styles.header}>From:</Text>
                <Text style={tailwindStyles.textSm}>
                  {data.Owner.FirstName} {data.Owner.LastName}
                </Text>
                <Text style={tailwindStyles.textSm}>{data.Owner.Email}</Text>
                <Text style={tailwindStyles.textSm}>{data.Owner.NoPhone}</Text>
              </View>
              <View style={styles.infoText}>
                <Text style={styles.header}>To:</Text>
                <Text style={tailwindStyles.textSm}>
                  {data.Renter.FirstName} {data.Renter.LastName}
                </Text>
                <Text style={tailwindStyles.textSm}>{data.Renter.Email}</Text>
                <Text style={tailwindStyles.textSm}>{data.Renter.NoPhone}</Text>
              </View>
            </View>
          ) : (
            <Text>No owner or renter found</Text>
          )}

          {/* Table for Details */}
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Item Name</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Quantity</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Price</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.label}>Total</Text>
              </View>
            </View>

            {/* Table Rows */}
            {data && data.Booking && data.Booking.Items ? (
              data.Booking.Items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCell}>
                    <Text>{item.Name}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{item.Quantity}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>
                      RM&nbsp;
                      {parseFloat(item.Price).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>
                      RM&nbsp;
                      {parseFloat(item.Quantity * item.Price).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>No items found</Text>
            )}
          </View>

          {data && data.Booking ? (
            <View style={styles.rightSection}>
              {/* Enclose the right section in a fixed-width container */}
              <View style={styles.rightContainer}>
                {/* Sub Total */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Sub Total:</Text>
                  <Text style={styles.totalValue}>
                    RM {parseFloat(data.Booking.SubTotal).toFixed(2)}
                  </Text>
                </View>
                {/* Service Fee */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Service Fee (7%):</Text>
                  <Text style={styles.totalValue}>
                    RM {parseFloat(data.Booking.ServiceFee).toFixed(2)}
                  </Text>
                </View>
                {/* Grand Total */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Grand Total:</Text>
                  <Text style={styles.totalValue}>
                    RM {parseFloat(data.Booking.GrandTotal).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          {/* Thank You */}
          <Text style={styles.thankYou}>Thank you for choosing EventEQ.</Text>
        </View>
      </Page>
    </Document>
  )
}
